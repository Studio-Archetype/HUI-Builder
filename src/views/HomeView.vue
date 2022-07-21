<style scoped lang="scss">
main {
  @apply h-full w-full flex flex-col text-white;

  .toolbarBottom {
    @apply flex bg-black items-center text-white p-2.5 text-xs flex-grow-0;

    .saveIndicator {
      @apply flex-shrink text-neutral-500;
    }

    .spacer {
      @apply flex-grow;
    }

    .stats {
      @apply flex-shrink flex;

      .divider {
        @apply border-neutral-500 bg-neutral-500;
      }

      > :not(:first-child) {
        @apply ml-2;
      }

      .muted {
        @apply text-neutral-500;
      }
    }
  }

  .main {
    @apply w-full flex flex-grow overflow-hidden;

    .sidebar {
      @apply flex flex-col items-center p-2;
      background-color: lighten(#000, 5);

      > :not(.spacer) {
        @apply flex-grow-0;

        &:not(:first-child) {
          @apply mt-2;
        }
      }

      .spacer {
        @apply flex-grow;
      }
    }

    .viewport {
      @apply flex flex-grow divide-x divide-neutral-800 bg-neutral-900 relative;

      .errorMessage {
        @apply absolute bottom-2 right-2 bg-red-600 px-3 py-2 rounded shadow-md;
        z-index: 1000;
      }

      .content {
        @apply flex flex-col w-full divide-neutral-800 divide-y-[1px];

        .canvasViewport {
          @apply flex-grow flex items-center justify-center p-6;
        }

        .componentPanel {
          @apply flex flex-col items-center p-4;

          h2 {
            @apply mb-6;
          }

          .choices {
            @apply grid grid-cols-3 gap-8 w-full;

            .choice {
              @apply bg-neutral-800 rounded flex items-center justify-center py-8;
            }
          }
        }
      }

      .right {
        @apply w-1/4 min-w-[25%] flex flex-col divide-y divide-neutral-800;

        .treePanel {
          @apply h-64 overflow-auto;
        }

        .detailPanel {
          @apply flex flex-col p-4;

          .header {
            @apply font-bold text-xl;
          }

          .textIconText {
            @apply mt-3;
          }

          .offset {
            @apply flex flex-col items-start mt-4;

            > label {
              @apply font-semibold;
            }

            .inputs {
              @apply grid grid-cols-3 gap-2 mt-1;

              .group {
                @apply flex items-center;

                input {
                  @apply flex-grow w-full;
                }

                label {
                  @apply mr-2 flex-grow-0;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
<script setup lang="ts">
// vendor & 3rd-party
import { computed, ref } from 'vue';
import Ajv from 'ajv';
import Codemirror from 'codemirror-editor-vue3';

// types
import type { Doc, Editor, EditorConfiguration } from 'codemirror';
import type {
  Component,
  Deco,
  TextIcon,
  HuiData,
  TextImageIcon,
} from '@/schema';

// lib
import { downloadSchema, getComponentDisplay } from '@/schema';
import type { ImageDef } from '@/stores/images';
import { useImageStore } from '@/stores/images';
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '@/stores/settings';

// components
import EditorCanvas from '@/components/EditorCanvas.vue';
import TreeView from '@/components/tree/TreeView.vue';
import TreeItem from '@/components/tree/TreeItem.vue';
import SettingsModal from '@/components/SettingsModal.vue';
import ImagesModal from '@/components/ImagesModal.vue';
import AboutModal from '@/components/AboutModal.vue';
import AddComponentModal from '@/components/AddComponentModal.vue';
import type { ComponentAddType } from '@/components/AddComponentModal.vue';
import NavBar from '@/components/NavBar.vue';

import ChooseIconModal from '@/components/ChooseIconModal.vue';
import ComponentTreeItem from '@/components/tree/ComponentTreeItem.vue';

// codemirror css
import 'codemirror/mode/javascript/javascript.js';
import '../assets/base16-dark-modified.css';
import { v4 as uuidV4 } from 'uuid';

// data
const imageStore = useImageStore();
const projectStore = useProjectStore();
const settingsStore = useSettingsStore();
const visualMode = ref(true);
const { project: data } = storeToRefs(projectStore);
const line = ref(0);
const char = ref(0);
const errorMessageTimeout = ref<number | null>(null);
const showErrorMessage = ref(false);
const errorMessage = ref('Validation error');
const cmOptions = ref<EditorConfiguration>({
  mode: { name: 'javascript', json: true }, // Language mode
  theme: 'base16-dark', // Theme
  lineNumbers: true, // Show line number
  smartIndent: true, // Smart indent
  indentUnit: 2, // The smart indent unit is 2 spaces in length
});
const activeComponentId = ref<string | null>(null);
const activeComponent = computed<Component | null>(
  () =>
    projectStore.project.components.find(
      (it: Component) => it.id === activeComponentId.value
    ) || null
);
const imageModalOpen = ref<boolean>(false);
const imageModalSelectionMode = ref(false);
const settingsModalOpen = ref<boolean>(false);
const aboutModalOpen = ref<boolean>(false);
const chooseIconStaticModalOpen = ref<boolean>(false);
const addComponentModalOpen = ref<boolean>(false);
const addComponentModalType = ref<ComponentAddType | null>(null);

// computed
const activeComponentDisplay = computed<string>(() => {
  if (activeComponent.value) return getComponentDisplay(activeComponent.value);
  else return '';
});
const dataJson = computed<string>({
  get(): string {
    return JSON.stringify(data.value, null, 2);
  },
  set(newValue: string) {
    projectStore.setProject(JSON.parse(newValue));
  },
});

// methods
function toggleMode() {
  visualMode.value = !visualMode.value;
}

function upload() {
  const element = document.createElement('input');
  element.type = 'file';
  element.onchange = async (evt: Event) => {
    projectStore.setProject(
      await new Response((evt.target as HTMLInputElement)?.files?.[0]).json()
    );

    document.body.removeChild(element);

    // todo: notify the user that the upload was successful.
  };
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
}

function validate() {
  const schema = downloadSchema();
  const ajv = new Ajv();
  const validateSchema = ajv.compile(schema);

  if (!validateSchema(data.value)) {
    console.log(validateSchema.errors);

    showErrorMessage.value = true;

    if (errorMessageTimeout.value !== null)
      clearTimeout(errorMessageTimeout.value);

    errorMessageTimeout.value = setTimeout(() => {
      showErrorMessage.value = false;
      errorMessageTimeout.value = null;
    });
  }
}

function download() {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    `data:application/json;charset=utf-8,${encodeURIComponent(dataJson.value)}`
  );
  element.setAttribute('download', 'hui-project.json');

  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function cmChange() {
  validate();
}

function cmCursor(instance: Editor) {
  const cursor = instance.getDoc().getCursor();
  line.value = cursor.line;
  char.value = cursor.ch;
}

function componentClickedInTreeView(component: Component) {
  activeComponentId.value = component.id;
}

function textIconTextChange(e: Event) {
  const newText = (e.target as HTMLElement).innerText;

  // write the data to the component
  const copyData: HuiData = data.value;
  const componentIndex = copyData.components.findIndex(
    (value: Component) => value.id === activeComponentId.value
  );

  ((copyData.components[componentIndex].data as Deco).icon as TextIcon).text =
    newText;
  projectStore.setProject(copyData);
}

function textImageIconPathChange(e: Event) {
  const newPath = (e.target as HTMLInputElement).value;

  // write the data to the component
  const copyData: HuiData = data.value;
  const componentIndex = copyData.components.findIndex(
    (value: Component) => value.id === activeComponentId.value
  );

  (
    (copyData.components[componentIndex].data as Deco).icon as TextImageIcon
  ).path = newPath;
  projectStore.setProject(copyData);
}

function offsetChange(index: number, e: Event) {
  const newValue = parseInt((e.target as HTMLInputElement).value);

  // write the data to the component
  const copyData: HuiData = data.value;
  const componentIndex = copyData.components.findIndex(
    (value: Component) => value.id === activeComponentId.value
  );
  copyData.components[componentIndex].offset[index] = newValue;
  projectStore.setProject(copyData);
}

function componentIdChange(e: Event) {
  const newValue = (e.target as HTMLInputElement).value;
  const oldValue = activeComponentId.value;

  if (projectStore.project.components.find((it) => it.id === newValue)) {
    // taken, cancel and give a warning
    // todo: warning
    return;
  }

  const componentIndex = projectStore.project.components.findIndex(
    (value: Component) => value.id === oldValue
  );

  projectStore.project.components[componentIndex].id = newValue;
  activeComponentId.value = newValue;
}

function componentSelectedOnCanvas(componentId: string) {
  activeComponentId.value =
    projectStore.project.components.find(
      (it: Component) => it.id === componentId
    )?.id || null;
}

function canvasDeselected() {
  activeComponentId.value = null;
}

function openAddComponentModal(type: ComponentAddType) {
  addComponentModalType.value = type;
  addComponentModalOpen.value = true;
}

function closeAddComponentModal() {
  addComponentModalOpen.value = false;
  addComponentModalType.value = null;
}

window.addEventListener('keydown', (e: KeyboardEvent) => {
  switch (e.code) {
    case 'Delete': {
      if (activeComponent.value) {
        projectStore.deleteComponent(activeComponent.value.id);
      }

      break;
    }
    case 'ArrowDown': {
      if (activeComponent.value) {
        const componentIndex = projectStore.project.components.findIndex(
          (it: Component) => it.id === activeComponentId.value
        );

        projectStore.project.components[componentIndex].offset[1] += 1;
      }

      break;
    }
    case 'ArrowLeft': {
      if (activeComponent.value) {
        const componentIndex = projectStore.project.components.findIndex(
          (it: Component) => it.id === activeComponentId.value
        );

        projectStore.project.components[componentIndex].offset[0] -= 1;
      }

      break;
    }
    case 'ArrowRight': {
      if (activeComponent.value) {
        const componentIndex = projectStore.project.components.findIndex(
          (it: Component) => it.id === activeComponentId.value
        );

        projectStore.project.components[componentIndex].offset[0] += 1;
      }

      break;
    }
    case 'ArrowUp': {
      if (activeComponent.value) {
        const componentIndex = projectStore.project.components.findIndex(
          (it: Component) => it.id === activeComponentId.value
        );

        projectStore.project.components[componentIndex].offset[1] -= 1;
      }

      break;
    }
  }
});

function addText(text = 'Text Element') {
  projectStore.addComponent({
    id: uuidV4(),
    offset: [0, 0, 0],
    data: {
      type: 'decoration',
      icon: {
        type: 'text',
        text,
      },
    },
  });
}

function addImage(image: ImageDef) {
  projectStore.addComponent({
    id: uuidV4(),
    offset: [0, 0, 0],
    data: {
      type: 'decoration',
      icon: {
        type: 'textImage',
        path: image.path,
      },
    },
  });
}
</script>

<template>
  <main>
    <nav-bar />
    <images-modal
      :open="imageModalOpen"
      :selection-mode="imageModalSelectionMode"
      @close="imageModalOpen = false"
    />
    <settings-modal
      :open="settingsModalOpen"
      @close="settingsModalOpen = false"
    />
    <add-component-modal
      :open="addComponentModalOpen"
      @close="closeAddComponentModal"
      :type="addComponentModalType ?? undefined"
    />
    <choose-icon-modal
      :open="chooseIconStaticModalOpen"
      @close="chooseIconStaticModalOpen = false"
      title="Add a Static Component"
      @text="addText()"
      @image="addImage"
    />
    <about-modal :open="aboutModalOpen" @close="aboutModalOpen = false" />

    <section class="main">
      <nav class="sidebar">
        <button class="button icon faint" @click="toggleMode()">
          <font-awesome-icon
            fixed-width
            v-if="visualMode"
            icon="code"
          ></font-awesome-icon>
          <font-awesome-icon
            fixed-width
            v-else
            icon="cubes"
          ></font-awesome-icon>
        </button>

        <div class="divider" />

        <button class="button icon faint" @click="upload()">
          <font-awesome-icon fixed-width icon="upload"></font-awesome-icon>
        </button>
        <button class="button icon faint" @click="download()">
          <font-awesome-icon fixed-width icon="save"></font-awesome-icon>
        </button>
        <button class="button icon faint" @click="imageModalOpen = true">
          <font-awesome-icon fixed-width icon="image"></font-awesome-icon>
        </button>

        <div class="spacer" />

        <button class="button icon faint" @click="settingsModalOpen = true">
          <font-awesome-icon fixed-width icon="cog"></font-awesome-icon>
        </button>
        <button class="button icon faint" @click="aboutModalOpen = true">
          <font-awesome-icon fixed-width icon="question"></font-awesome-icon>
        </button>
      </nav>

      <div v-if="visualMode" class="viewport">
        <div class="errorMessage" v-if="showErrorMessage">
          {{ errorMessage }}
        </div>

        <div class="content">
          <div class="canvasViewport">
            <editor-canvas
              :data="data"
              backdrop="https://cdn.discordapp.com/attachments/897227758340542505/963623720516210738/hui_backdrop.webp"
              :show-bounds="settingsStore.settings.debugFrames"
              :activeComponentId="activeComponentId ?? undefined"
              @componentSelected="componentSelectedOnCanvas"
              @deselect="canvasDeselected"
            />
          </div>
          <div class="componentPanel">
            <h2>Add a Component</h2>
            <div class="choices">
              <button class="choice" @click="chooseIconStaticModalOpen = true">
                Static
              </button>
              <button class="choice" @click="openAddComponentModal('button')">
                Button
              </button>
              <button class="choice" @click="openAddComponentModal('toggle')">
                Toggle
              </button>
            </div>
          </div>
        </div>
        <aside class="right">
          <div class="treePanel">
            <TreeView>
              <TreeItem root toggleable>
                Components

                <template #closedIcon>
                  <font-awesome-icon
                    fixed-width
                    icon="folder-closed"
                  ></font-awesome-icon>
                </template>

                <template #openIcon>
                  <font-awesome-icon
                    fixed-width
                    icon="folder-open"
                  ></font-awesome-icon>
                </template>

                <template #children>
                  <ComponentTreeItem
                    v-for="component in data.components"
                    :key="component.id"
                    :selected="
                      activeComponent
                        ? component.id === activeComponent.id
                        : false
                    "
                    :component="component"
                    @click="componentClickedInTreeView(component)"
                  />
                </template>
              </TreeItem>
            </TreeView>
          </div>

          <div v-if="activeComponent" class="detailPanel">
            <div class="header">{{ activeComponentDisplay }}</div>
            <template v-if="activeComponent.data.type === 'decoration'">
              <p
                class="textIconText"
                v-if="(activeComponent.data as Deco).icon.type === 'text'"
                contenteditable
                @input="textIconTextChange"
              >
                {{ ((activeComponent.data as Deco).icon as TextIcon).text }}
              </p>
            </template>

            <div class="offset">
              <label for="positionField">Position</label>
              <div class="inputs" id="positionField">
                <div class="group">
                  <label for="offsetX">X:</label>
                  <input
                    type="number"
                    id="offsetX"
                    :value="activeComponent.offset[0]"
                    @change="offsetChange(0, $event)"
                  />
                </div>
                <div class="group">
                  <label for="offsetY">Y:</label>
                  <input
                    type="number"
                    id="offsetY"
                    :value="activeComponent.offset[1]"
                    @change="offsetChange(1, $event)"
                  />
                </div>
                <div class="group">
                  <label for="offsetZ">Z:</label>
                  <input
                    type="number"
                    id="offsetZ"
                    :value="activeComponent.offset[2]"
                    @change="offsetChange(2, $event)"
                  />
                </div>
              </div>
            </div>

            <template v-if="activeComponent.data.type === 'decoration'">
              <div
                v-if="(activeComponent.data as Deco).icon.type === 'textImage'"
                class="inputGroup"
              >
                <label for="textImageIconPathInput">Path</label>

                <select
                  id="textImageIconPathInput"
                  @change="textImageIconPathChange"
                  :value="((activeComponent.data as Deco).icon as TextImageIcon).path"
                >
                  <option
                    v-for="image in imageStore.allImages"
                    :key="image.path"
                  >
                    {{ image.path }}
                  </option>
                </select>
              </div>
            </template>

            <div class="inputGroup">
              <label for="componentId">Name</label>
              <input
                id="componentId"
                type="text"
                :value="activeComponent.id"
                @blur="componentIdChange"
              />
            </div>
          </div>
        </aside>
      </div>

      <div v-else class="viewport">
        <div class="errorMessage" v-if="showErrorMessage">
          {{ errorMessage }}
        </div>
        <div class="content">
          <Codemirror
            v-model:value="dataJson"
            :options="cmOptions"
            width="100%"
            height="100%"
            @change="cmChange"
            @cursorActivity="cmCursor"
          ></Codemirror>
        </div>
      </div>
    </section>

    <section class="toolbarBottom">
      <div class="saveIndicator">Changes Auto-saved in LocalStorage</div>
      <div class="spacer" />
      <div v-if="!visualMode" class="stats">
        <span class="muted">JSON</span>
        <div class="divider" />
        <span>{{ line }}:{{ char }}</span>
      </div>
    </section>
  </main>
</template>

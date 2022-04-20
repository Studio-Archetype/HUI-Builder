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
          @apply flex-grow flex items-center justify-center;
        }

        .componentPanel {
          @apply flex-grow-0 flex flex-col items-center p-8;

          h2 {
            @apply mb-8;
          }

          .choices {
            @apply grid grid-cols-4 gap-8 w-full;

            .choice {
              @apply bg-neutral-800 rounded flex items-center justify-center py-8;
            }
          }
        }
      }

      .right {
        @apply w-1/4 flex flex-col divide-y divide-neutral-800;

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
import { computed, ref } from "vue";
import Ajv from "ajv";
import Codemirror from "codemirror-editor-vue3";

// types
import type { Doc, Editor, EditorConfiguration } from "codemirror";
import type {
  Component,
  Deco,
  TextIcon,
  HuiData,
  TextImageIcon,
} from "@/schema";

// lib
import { downloadSchema, getComponentDisplay } from "@/schema";

// components
import EditorCanvas from "@/components/EditorCanvas.vue";
import TreeView from "@/components/tree/TreeView.vue";
import TreeItem from "@/components/tree/TreeItem.vue";
import ComponentTreeItem from "@/components/tree/ComponentTreeItem.vue";

// codemirror
import "codemirror/mode/javascript/javascript.js";
import "../assets/base16-dark-modified.css";
import ImagesModal from "@/components/ImagesModal.vue";
import { useImageStore } from "@/stores/images";
import { useProjectStore } from "@/stores/project";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";
import SettingsModal from "@/components/SettingsModal.vue";
import AboutModal from "@/components/AboutModal.vue";
import AddComponentModal from "@/components/AddComponentModal.vue";

// data
const imageStore = useImageStore();
const projectStore = useProjectStore();
const settingsStore = useSettingsStore();
let visualMode = ref(true);
let { project: data } = storeToRefs(projectStore);
let line = ref(0);
let char = ref(0);
let errorMessageTimeout = ref<number | null>(null);
let showErrorMessage = ref(false);
let errorMessage = ref("Validation error");
let cmOptions = ref<EditorConfiguration>({
  mode: { name: "javascript", json: true }, // Language mode
  theme: "base16-dark", // Theme
  lineNumbers: true, // Show line number
  smartIndent: true, // Smart indent
  indentUnit: 2, // The smart indent unit is 2 spaces in length
});
let activeComponentId = ref<string | null>(null);
let activeComponent = computed<Component | null>(
  () =>
    projectStore.project.components.find(
      (it: Component) => it.id === activeComponentId.value
    ) || null
);
let imageModalOpen = ref<boolean>(false);
let imageModalSelectionMode = ref(false);
let settingsModalOpen = ref<boolean>(false);
let aboutModalOpen = ref<boolean>(false);
let addComponentModalOpen = ref<boolean>(false);
let addComponentModalType = ref<string | null>(null);

// computed
let activeComponentDisplay = computed<string>(() => {
  if (activeComponent.value) return getComponentDisplay(activeComponent.value);
  else return "";
});
let dataJson = computed<string>({
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
  const element = document.createElement("input");
  element.type = "file";
  element.onchange = async (evt: Event) => {
    projectStore.setProject(
      await new Response((evt.target as HTMLInputElement)?.files?.[0]).json()
    );

    document.body.removeChild(element);

    // todo: notify the user that the upload was successful.
  };
  element.style.display = "none";
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
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    `data:application/json;charset=utf-8,${encodeURIComponent(dataJson.value)}`
  );
  element.setAttribute("download", "hui-project.json");

  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function cmChange(value: string, cm: Editor) {
  validate();
}

function cmCursor(doc: Doc) {
  const cursor = doc.getCursor();
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
function componentSelectedOnCanvas(componentId: string) {
  activeComponentId.value =
    projectStore.project.components.find(
      (it: Component) => it.id === componentId
    )?.id || null;
}

function canvasDeselected() {
  activeComponentId.value = null;
}

function openAddComponentModal(type: string) {
  addComponentModalType.value = type;
  addComponentModalOpen.value = true;
}

function closeAddComponentModal() {
  addComponentModalOpen.value = false;
  addComponentModalType.value = null;
}

window.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.code === "Delete") {
    if (activeComponent.value) {
      projectStore.deleteComponent(activeComponent.value.id);
    }
  }
});
</script>

<template>
  <main>
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
      :type="addComponentModalType"
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
              :activeComponentId="activeComponentId"
              @componentSelected="componentSelectedOnCanvas"
              @deselect="canvasDeselected"
            />
          </div>
          <div class="componentPanel">
            <h2>Add a Component</h2>
            <div class="choices">
              <button class="choice" @click="openAddComponentModal('image')">
                Image
              </button>
              <button class="choice" @click="openAddComponentModal('text')">
                Text
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
                v-if="activeComponent.data.icon.type === 'text'"
                contenteditable
                @input="textIconTextChange"
              >
                {{ activeComponent.data.icon.text }}
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
                v-if="activeComponent.data.icon.type === 'textImage'"
                class="inputGroup"
              >
                <label for="textImageIconPathInput">Path</label>

                <select
                  id="textImageIconPathInput"
                  @change="textImageIconPathChange"
                  :value="activeComponent.data.icon.path"
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
              <label for="componentId">ID</label>
              <input
                id="componentId"
                type="text"
                :value="activeComponent.id"
                readonly
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

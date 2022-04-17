<style lang="scss">
main {
  @apply h-full w-full flex flex-col text-white;

  .toolbarBottom {
    @apply flex bg-black items-center text-white p-1 text-xs flex-grow-0;

    .saveIndicator {
      @apply flex-shrink;
    }

    .spacer {
      @apply flex-grow;
    }

    .stats {
      @apply flex-shrink;
    }
  }

  .main {
    @apply w-full flex flex-grow overflow-hidden;

    .sidebar {
      @apply flex flex-col items-center p-2;
      background-color: lighten(#000, 4);

      .divider {
        @apply border-neutral-700 border-[1px] rounded-sm w-full;

        &:not(:first-child) {
          @apply mt-2;
        }
      }

      .buttonItem {
        @apply p-2 bg-white bg-opacity-0 rounded leading-5 transition-[background-color] w-full;

        &:not(:first-child) {
          @apply mt-2;
        }

        &:hover {
          @apply bg-opacity-25;
        }
      }
    }

    .viewport {
      @apply flex flex-grow divide-x divide-neutral-700 bg-neutral-900 relative;

      .errorMessage {
        @apply absolute bottom-2 right-2 bg-red-600 px-3 py-2 rounded shadow-md;
        z-index: 1000;
      }

      .content {
        @apply flex flex-col w-full;
      }

      .right {
        @apply w-96 flex flex-col divide-y divide-neutral-700;

        .treePanel {
          @apply h-80 overflow-y-scroll;
        }

        .detailPanel {
          @apply flex flex-col;
        }
      }
    }
  }
}

::-webkit-scrollbar {
  @apply w-2;
  pointer-events: none;

  &-track {
    @apply bg-transparent;
  }

  &-thumb {
    @apply bg-neutral-400 w-1/2;

    &:hover {
      @apply bg-neutral-300 w-full;
    }
  }
}
</style>

<template>
  <main>
    <section class="main">
      <nav class="sidebar">
        <button class="buttonItem" @click="toggleMode()">
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

        <button class="buttonItem" @click="upload()">
          <font-awesome-icon fixed-width icon="upload"></font-awesome-icon>
        </button>
        <button class="buttonItem" @click="download()">
          <font-awesome-icon fixed-width icon="save"></font-awesome-icon>
        </button>
      </nav>

      <div v-if="visualMode" class="viewport">
        <div class="errorMessage" v-if="showErrorMessage">
          {{ errorMessage }}
        </div>

        <div class="content"></div>
        <aside class="right">
          <div class="treePanel">
            <TreeView>
              <TreeItem root toggleable>
                Components

                <template #closedIcon>
                  <font-awesome-icon
                    fixed-width
                    icon="caret-right"
                  ></font-awesome-icon>
                </template>

                <template #openIcon>
                  <font-awesome-icon
                    fixed-width
                    icon="caret-down"
                  ></font-awesome-icon>
                </template>

                <template #children>
                  <ComponentTreeItem
                    v-for="component in data.components"
                    :key="component.id"
                    :component="component"
                    @click="componentClickedInTreeView(component)"
                  />
                </template>
              </TreeItem>
            </TreeView>
          </div>

          <div class="detailPanel"></div>
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
            @change="validate"
          ></Codemirror>
        </div>
      </div>
    </section>

    <section class="toolbarBottom">
      <div class="saveIndicator">Saving/Saved</div>
      <div class="spacer" />
      <div class="stats">0:0</div>
    </section>
  </main>
</template>

<script lang="ts">
import Codemirror from "codemirror-editor-vue3";
import type { EditorConfiguration } from "codemirror";
import { v4 as uuidV4 } from "uuid";

// language
import "codemirror/mode/javascript/javascript.js";

// theme
import "../assets/base16-dark-modified.css";
import TreeView from "@/components/tree/TreeView.vue";
import TreeItem from "@/components/tree/TreeItem.vue";
import { downloadSchema } from "../schema";
import type { Component, HuiData } from "../schema";
import Ajv from "ajv";
import ComponentTreeItem from "@/components/tree/ComponentTreeItem.vue";

interface Data {
  visualMode: boolean;
  data: HuiData;
  errorMessageTimeout: number | null;
  showErrorMessage: boolean;
  errorMessage: string;
  cmOptions: EditorConfiguration;
}

export default {
  components: {
    ComponentTreeItem,
    TreeItem,
    TreeView,
    Codemirror,
  },
  data(): Data {
    return {
      visualMode: true,
      data: {
        components: [
          {
            id: uuidV4(),
            offset: [0, 0, 0],
            data: {
              type: "decoration",
              icon: {
                type: "text",
                text: "Test Text",
              },
            },
          },
        ],
        offset: [0, 0, 0],
        lockPosition: false,
      },
      errorMessageTimeout: null,
      showErrorMessage: true, //todo: set false
      errorMessage: "Validation Errors",
      cmOptions: {
        mode: { name: "javascript", json: true }, // Language mode
        theme: "base16-dark", // Theme
        lineNumbers: true, // Show line number
        smartIndent: true, // Smart indent
        indentUnit: 2, // The smart indent unit is 2 spaces in length
      },
    };
  },
  methods: {
    toggleMode() {
      this.visualMode = !this.visualMode;
    },
    upload() {
      const element = document.createElement("input");
      element.type = "file";
      element.onchange = async (evt: Event) => {
        this.data = await new Response(
          (evt.target as HTMLInputElement)?.files?.[0]
        ).json();

        document.body.removeChild(element);

        // todo: notify the user that the upload was successful.
      };
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
    },
    validate() {
      const schema = downloadSchema();
      const ajv = new Ajv();
      const validateSchema = ajv.compile(schema);

      if (!validateSchema(this.data)) {
        console.log(validateSchema.errors);

        this.showErrorMessage = true;

        if (this.errorMessageTimeout !== null)
          clearTimeout(this.errorMessageTimeout);

        this.errorMessageTimeout = setTimeout(() => {
          this.showErrorMessage = false;
          this.errorMessageTimeout = null;
        });
      }
    },
    download() {
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        `data:application/json;charset=utf-8,${encodeURIComponent(
          this.dataJson
        )}`
      );
      element.setAttribute("download", "hui-project.json");

      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    // elementClickedInTreeView(elementName: string) {
    //   console.log(`Clicked element: ${elementName}`);
    // },
    componentClickedInTreeView(component: Component) {
      console.log(component);
    },
  },
  computed: {
    dataJson: {
      get(): string {
        return JSON.stringify(this.data);
      },
      set(newValue: string) {
        this.data = JSON.parse(newValue);
      },
    },
  },
};
</script>

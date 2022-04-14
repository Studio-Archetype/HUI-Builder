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

      .buttonItem {
        @apply p-2 bg-white bg-opacity-0 rounded leading-5 transition-[background-color] w-full;

        &:hover {
          @apply bg-opacity-25;
        }
      }
    }

    .viewport {
      @apply flex flex-grow divide-x divide-neutral-700 bg-neutral-900;

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
        <button class="buttonItem" @click="upload()">
          <font-awesome-icon
              fixed-width
              icon="upload"
          ></font-awesome-icon>
        </button>
      </nav>

      <div v-if="visualMode" class="viewport">
        <div class="content">

        </div>
        <aside class="right">
          <div class="treePanel">
            <TreeView>
              <TreeItem root toggleable>
                Elements

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
                  <TreeItem @click="elementClickedInTreeView('test')">
                    Element
                  </TreeItem>
                </template>
              </TreeItem>
            </TreeView>
          </div>

          <div class="detailPanel">

          </div>
        </aside>
      </div>

      <div v-else class="viewport">
        <div class="content">
          <Codemirror
            v-model:value="file"
            :options="cmOptions"
            width="100%"
            height="100%"
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

// language
import "codemirror/mode/javascript/javascript.js";

// theme
import "../assets/base16-dark-modified.css";
import TreeView from "@/components/tree/TreeView.vue";
import TreeItem from "@/components/tree/TreeItem.vue";

export default {
  components: {
    TreeItem,
    TreeView,
    Codemirror,
  },
  data() {
    return {
      visualMode: true,
      file: '{"": ""}',
      cmOptions: {
        mode: { name: "javascript", json: true }, // Language mode
        theme: "base16-dark", // Theme
        lineNumbers: true, // Show line number
        smartIndent: true, // Smart indent
        indentUnit: 2, // The smart indent unit is 2 spaces in length
        foldGutter: true, // Code folding
        styleActiveLine: true, // Display the style of the selected row
      },
    };
  },
  methods: {
    toggleMode() {
      this.visualMode = !this.visualMode;
    },
    upload() {

    },
    elementClickedInTreeView(elementName: string) {
      console.log(`Clicked element: ${elementName}`);
    },
  },
};
</script>

<template>
  <TreeItem @click.stop="click">
    {{ name }}
  </TreeItem>
</template>

<script lang="ts">
import TreeItem from "./TreeItem.vue";

export default {
  name: "ComponentTreeItem",
  components: { TreeItem },
  props: {
    component: Object,
  },
  computed: {
    name: {
      get(): string {
        switch (this.component.data.type) {
          case "button":
            return `Button ${this.component.id}`;
          case "decoration": {
            switch (this.component.data.icon.type) {
              case "text":
                return `Text (${this.component.data.icon.text})`;
              case "textImage":
                return `Image ${this.component.id}`;
              default:
                return `Decoration ${this.component.id}`;
            }
          }
          case "toggle":
            return `Toggle ${this.component.id}`;
          default:
            return `Unknown component ${this.component.id}`;
        }
      },
    },
  },
  methods: {
    click() {
      this.$emit("click");
    },
  },
};
</script>

<style scoped></style>

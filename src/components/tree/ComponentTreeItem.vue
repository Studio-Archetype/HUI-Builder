<script setup lang="ts">
import type { Component } from "@/schema";
import TreeItem from "./TreeItem.vue";
import { computed } from "vue";
import { getComponentDisplay } from "@/schema";

const props = defineProps({
  component: {
    type: Object as () => Component,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

let name = computed<string>(() => {
  return getComponentDisplay(props.component, true);
});

function click() {
  emit("click");
}
</script>

<template>
  <TreeItem @click.stop="click" :selected="selected">
    {{ name }}
  </TreeItem>
</template>

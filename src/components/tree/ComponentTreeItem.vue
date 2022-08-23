<script setup lang="ts">
import type { Component } from '@/schema';
import { getComponentDisplay } from '@/schema';
import TreeItem from './TreeItem.vue';
import { computed } from 'vue';

interface ComponentTreeItemProps {
  component: Component;
  selected?: boolean;
}

const props = withDefaults(defineProps<ComponentTreeItemProps>(), {
  selected: false,
});

const name = computed<string>(() => getComponentDisplay(props.component, true));
</script>

<template>
  <TreeItem :selected="props.selected">
    {{ name }}
  </TreeItem>
</template>

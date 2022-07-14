<script setup lang="ts">
import { ref } from 'vue';

export interface TreeItemProps {
  toggleable?: boolean;
  root?: boolean;
  open?: boolean;
  selected?: boolean;
}

const props = withDefaults(defineProps<TreeItemProps>(), {
  toggleable: false,
  root: false,
  open: false,
  selected: false,
});

const opened = ref(props.open);

function click() {
  if (props.toggleable) opened.value = !opened.value;
}
</script>

<template>
  <div
    class="treeItem"
    :class="{
      open: opened,
      toggleable: props.toggleable,
      root: props.root,
      selected: props.selected,
    }"
  >
    <div class="title" @click="click">
      <slot name="icon">
        <template v-if="props.toggleable">
          <slot v-if="opened" name="openIcon">
            <font-awesome-icon
              fixed-width
              icon="caret-down"
            ></font-awesome-icon>
          </slot>
          <slot v-else name="closedIcon">
            <font-awesome-icon
              fixed-width
              icon="caret-right"
            ></font-awesome-icon>
          </slot>
        </template>
      </slot>

      <slot />
    </div>
    <div class="treeItemInner">
      <slot name="children"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.treeItem {
  @apply transition block truncate;

  &:not(.root) {
    @apply border-l-2 border-neutral-600 pl-2 ml-2;
  }

  &.selected .title {
    @apply bg-neutral-600;

    &:hover {
      @apply bg-neutral-600;
    }
  }

  > .title {
    @apply cursor-pointer select-none overflow-hidden px-2;

    &:hover {
      @apply bg-neutral-800;
    }
  }

  .treeItemInner {
    @apply hidden;
  }

  &.open {
    > .treeItemInner {
      @apply flex flex-col;
    }
  }
}
</style>

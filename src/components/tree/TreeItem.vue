<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  toggleable: {
    type: Boolean,
    default: false,
  },
  root: {
    type: Boolean,
    default: false,
  },
  open: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

let opened = ref(props.open);

function click(event: Event) {
  event.stopPropagation();
  if (props.toggleable) opened.value = !opened.value;
  emit("click", event);
}
</script>

<template>
  <div class="treeItem" :class="{ open: opened, toggleable, root, selected }">
    <div class="title" @click.stop="click">
      <slot name="icon">
        <template v-if="toggleable">
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
    @apply cursor-pointer select-none;

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

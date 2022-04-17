<template>
  <div class="treeItem" :class="{ open: opened, toggleable, root }">
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

<script lang="ts">
export default {
  name: "TreeItem",
  props: {
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
  },
  data() {
    return {
      opened: false,
    };
  },

  methods: {
    click(event: Event) {
      event.stopPropagation();
      if (this.toggleable) this.opened = !this.opened;
      this.$emit("click", event);
    },
  },

  created() {
    this.opened = this.open;
  },
};
</script>

<style scoped lang="scss">
.treeItem {
  @apply transition block truncate;

  &:not(.root) {
    @apply border-l-2 border-neutral-600 pl-2 ml-2;
  }

  > .title {
    @apply cursor-pointer;

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

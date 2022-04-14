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

<script>
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
    click() {
      if (this.toggleable) this.opened = !this.opened;
      this.$emit("click");
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
    @apply border-l-2 border-gray-400 pl-2 ml-2;
  }

  > .title {
    @apply cursor-pointer;

    &:hover {
      @apply bg-gray-100;
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

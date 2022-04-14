<style lang="scss">
.treeView {
  @apply p-1;
}
</style>

<template>
  <div class="treeView">
    <slot />
  </div>
</template>

<script>
export default {
  name: "TreeView",
};
</script>

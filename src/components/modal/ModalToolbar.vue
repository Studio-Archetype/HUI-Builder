<template>
  <div class="toolbar">
    <div class="title">
      <slot name="title" />
    </div>
    <div class="spacer" />
    <div class="actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.toolbar {
  @apply rounded-t-lg flex items-center p-2 flex-grow-0;
  background-color: lighten(#000, 4);

  .title {
    @apply font-bold flex-grow-0 p-2 leading-none;
  }

  .spacer {
    @apply flex-grow;
  }

  .actions {
    @apply flex-grow-0 flex flex-row items-center;

    > :not(:first-child) {
      @apply ml-2;
    }
  }
}
</style>

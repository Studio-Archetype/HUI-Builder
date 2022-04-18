<template>
  <div class="body">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.body {
  @apply flex flex-grow flex-col divide-y-[1px] divide-neutral-600;

  &:first-child {
    @apply rounded-t-lg;
  }

  > :last-child {
    @apply rounded-b-lg;
  }
}
</style>

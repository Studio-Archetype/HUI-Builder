<script setup lang="ts">
defineProps({
  danger: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="contextMenuItem" :class="{ danger }">
    <slot name="iconStart" />
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.contextMenuItem {
  @apply p-2 flex items-center;

  &.danger {
    @apply text-red-600;
  }

  &:hover {
    @apply bg-neutral-900;
  }

  > *:not(:first-child) {
    @apply ml-2;
  }
}
</style>

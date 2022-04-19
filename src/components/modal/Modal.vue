<script setup lang="ts">
const emit = defineEmits(["backgroundClick"]);
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

function backgroundClicked(e: MouseEvent) {
  if (e.target !== e.currentTarget) return;
  emit("backgroundClick");
}
</script>

<template>
  <div class="modalContainer" :class="{ open }" @click="backgroundClicked">
    <section class="modal">
      <slot />
    </section>
  </div>
</template>

<style scoped lang="scss">
.modalContainer {
  @apply absolute bottom-0 top-0 left-0 right-0 bg-neutral-800 bg-opacity-80 hidden items-center justify-center;
  z-index: 2000;

  &.open {
    @apply flex;
  }

  .modal {
    @apply rounded-lg bg-neutral-900 w-[75%] h-[75%] flex flex-col shadow-2xl;
  }
}
</style>

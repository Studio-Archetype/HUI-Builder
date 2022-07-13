<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";

const emit = defineEmits(["close"]);
const props = defineProps({
  x: Number,
  y: Number,
  show: Boolean,
});

const vFocusOnMount = {
  mounted: (el: HTMLElement) => {
    nextTick(() => el.focus());
  },
};

function close() {
  emit("close");
}

let style = computed(() => ({
  left: `${props.x}px`,
  top: `${props.y}px`,
  display: props.show ? "flex" : "none",
}));
</script>

<template>
  <div
    v-if="show"
    class="contextMenu"
    :style="style"
    v-show="show"
    ref="context"
    tabindex="-1"
    @blur="close"
    v-focus-on-mount
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
.contextMenu {
  @apply fixed bg-neutral-800 outline-0 shadow cursor-pointer rounded flex flex-col;
  z-index: 3000;
}
</style>

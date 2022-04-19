<script setup lang="ts">
import type { PropType, Ref } from "vue";
import type { ImageDef } from "@/stores/images";
import { ref } from "vue";
import ContextMenu from "@/components/contextMenu/ContextMenu.vue";
import ContextMenuItem from "@/components/contextMenu/ContextMenuItem.vue";

const emit = defineEmits(["click", "edit", "delete"]);
const props = defineProps({
  image: Object as PropType<ImageDef>,
  selectable: {
    type: Boolean,
    default: false,
  },
});

let contextMenuOpen = ref(false);
let contextMenuX = ref(0);
let contextMenuY = ref(0);

function emitEdit() {
  emit("edit");
}

function emitDelete() {
  emit("delete");
}

function openContextMenu(evt: MouseEvent) {
  contextMenuX.value = evt.pageX || evt.clientX;
  contextMenuY.value = evt.pageY || evt.clientY;
  contextMenuOpen.value = true;
}

function closeContextMenu() {
  contextMenuX.value = 0;
  contextMenuY.value = 0;
  contextMenuOpen.value = false;
}
</script>

<template>
  <div
    class="item"
    :class="{ selectable }"
    @click.stop="emit('click')"
    @click.right.prevent="openContextMenu"
  >
    <div class="image">
      <img :src="image.content" :alt="image.path" />
    </div>
    <div class="caption">
      <div class="content">
        {{ image.path }}
      </div>
    </div>
  </div>

  <context-menu
    :show="contextMenuOpen"
    :x="contextMenuX"
    :y="contextMenuY"
    @close="closeContextMenu"
  >
    <context-menu-item @click="emitEdit">
      <template #iconStart>
        <font-awesome-icon fixed-width icon="pencil"></font-awesome-icon>
      </template>
      Edit
    </context-menu-item>

    <context-menu-item danger @click="emitDelete">
      <template #iconStart>
        <font-awesome-icon fixed-width icon="trash"></font-awesome-icon>
      </template>
      Delete
    </context-menu-item>
  </context-menu>
</template>

<style scoped lang="scss">
.item {
  @apply flex flex-col divide-y-[1px] divide-neutral-800 rounded bg-neutral-800;

  &.selectable {
    @apply cursor-pointer;

    &:hover {
      @apply bg-neutral-700;
    }
  }

  .image {
    @apply flex-grow flex items-center justify-center p-8;

    img {
      @apply w-full h-auto;
      image-rendering: pixelated;
    }
  }

  .caption {
    @apply flex-grow-0 flex flex-col p-4 whitespace-nowrap overflow-x-scroll;

    .content {
      @apply mx-auto;
    }
  }
}
</style>

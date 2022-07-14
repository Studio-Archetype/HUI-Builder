<script setup lang="ts">

import ImageListItem from '@/components/imageList/ImageListItem.vue';

import type { ImageDef } from '@/stores/images';
import { ensurePath } from '@/lib/image';
import { useImageStore } from '@/stores/images';

const imageStore = useImageStore();
const emit = defineEmits(['imageSelected', 'edit', 'delete']);
defineProps({
  selectable: {
    type: Boolean,
    default: false,
  },
  showAddBtn: {
    type: Boolean,
    default: false,
  },
  allowDelete: {
    type: Boolean,
    default: true,
  },
});

function click(image: ImageDef) {
  emit('imageSelected', image);
}

function emitEdit(image: ImageDef) {
  emit('edit', image);
}

function emitDelete(image: ImageDef) {
  emit('delete', image);
}

function readAndAddImage(file: File) {
  const reader = new FileReader();
  reader.onload = (readerEvt: Event) => {
    imageStore.addImage({
      path: ensurePath(file.name),
      content: (readerEvt.target as FileReader).result as string,
    });
  };

  reader.readAsDataURL(file);
}

function chooseImage() {
  const element = document.createElement('input');
  element.type = 'file';
  element.accept = 'png';
  element.multiple = true;
  element.onchange = async (fileEvt: Event) => {
    const files = (fileEvt.target as HTMLInputElement)?.files;
    if (files) for (const file of files) readAndAddImage(file);
    document.body.removeChild(element);
  };
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
}
</script>

<template>
  <div class="imageList">
    <image-list-item
      v-for="imageDef in imageStore.allImages"
      :key="imageDef.path"
      :selectable="selectable"
      :image="imageDef"
      @click="click(imageDef)"
      @edit="emitEdit(imageDef)"
      :show-delete="allowDelete"
      @delete="emitDelete(imageDef)"
    />

    <button v-if="showAddBtn" @click="chooseImage" class="addButton">
      <div class="iconContainer">
        <font-awesome-icon fixed-width icon="plus"></font-awesome-icon>
      </div>
      <div class="text">Add</div>
    </button>
  </div>
</template>

<style scoped lang="scss">
.imageList {
  @apply grid grid-cols-6 gap-4 p-4;

  .addButton {
    @apply flex flex-col items-center rounded bg-neutral-800 cursor-pointer;

    &:hover {
      @apply bg-neutral-700;
    }

    .iconContainer {
      @apply flex-grow flex items-center justify-center text-6xl w-full h-auto p-16;
    }

    .text {
      @apply flex-grow-0 p-4 text-center overflow-x-scroll;
    }
  }
}
</style>

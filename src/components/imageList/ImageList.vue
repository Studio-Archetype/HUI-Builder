<script setup lang="ts">
import type { ImageDef } from "@/stores/images";
import type { PropType } from "vue";
import ImageListItem from "@/components/imageList/ImageListItem.vue";

const emit = defineEmits(["imageSelected", "edit", "delete", "addClicked"]);
defineProps({
  images: Array as PropType<ImageDef[]>,
  selectable: {
    type: Boolean,
    default: false,
  },
});

function click(image: ImageDef) {
  emit("imageSelected", image);
}

function emitEdit(image: ImageDef) {
  emit("edit", image);
}

function emitDelete(image: ImageDef) {
  emit("delete", image);
}

function emitAddBtn() {
  emit("addClicked");
}
</script>

<template>
  <div class="imageList">
    <image-list-item
      v-for="imageDef in images"
      :key="imageDef.path"
      :selectable="selectable"
      :image="imageDef"
      @click="click(imageDef)"
      @edit="emitEdit(imageDef)"
      @delete="emitDelete(imageDef)"
    />

    <button @click="emitAddBtn" class="addButton">
      <div class="iconContainer">
        <font-awesome-icon fixed-width icon="plus"></font-awesome-icon>
      </div>
      <div class="text">Add</div>
    </button>
  </div>
</template>

<style scoped lang="scss">
.imageList {
  @apply grid grid-cols-8 gap-4 p-4;

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

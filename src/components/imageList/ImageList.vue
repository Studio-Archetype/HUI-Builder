<script setup lang="ts">
import type { ImageDef } from "@/stores/images";
import type { PropType } from "vue";
import ImageListItem from "@/components/imageList/ImageListItem.vue";

const emit = defineEmits(["imageSelected", "edit", "delete"]);
const props = defineProps({
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

// no longer needed
// function getFileParts(filename: string): string[] {
//   const dotSplit = filename.split(".");
//   if (dotSplit.length === 1 || (dotSplit[0] === "" && dotSplit.length === 2)) {
//     return [filename, ""];
//   }
//
//   const ext = dotSplit.pop();
//   return [dotSplit.join("."), ext!];
// }
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
  </div>
</template>

<style scoped lang="scss">
.imageList {
  @apply grid grid-cols-8 gap-4 p-4;
}
</style>

<script setup lang="ts">
import {ref, watch} from "vue";
import type { IconType } from "@/schema";
import { faImage, faFont } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/components/modal/Modal.vue";
import ModalToolbar from "@/components/modal/ModalToolbar.vue";
import ModalBody from "@/components/modal/ModalBody.vue";
import type { ImageDef } from "@/stores/images";
import { v4 as uuidV4 } from "uuid";
import { useProjectStore } from "@/stores/project";
import ImagesModal from "@/components/ImagesModal.vue";

const projectStore = useProjectStore();
const iconType = ref<IconType | null>(null);
const emit = defineEmits(["cancel", "selected"]);

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String as () => IconType | null,
    default: null,
  },
});

function close() {
  emit("cancel");
}

function addText(text = "Text Element") {
  projectStore.addComponent({
    id: uuidV4(),
    offset: [0, 0, 0],
    data: {
      type: "decoration",
      icon: {
        type: "text",
        text,
      },
    },
  });

  close();
}

function addImage(image: ImageDef) {
  projectStore.addComponent({
    id: uuidV4(),
    offset: [0, 0, 0],
    data: {
      type: "decoration",
      icon: {
        type: "textImage",
        path: image.path,
      },
    },
  });

  close();
}

watch(
  () => props.type,
  () => {
    iconType.value = props.type;
    if (iconType.value === "text") addText();
  }
);
</script>

<template>
  <images-modal
    :open="open"
    @close="close"
    selection-mode
    @selected="addImage"
  />
  <modal :open="open" @backgroundClick="close" width="35%" height="75%">
    <modal-toolbar>
      <template #title>About Application</template>
      <template #actions>
        <button class="button icon faint" @click="close">
          <font-awesome-icon fixed-width icon="close"></font-awesome-icon>
        </button>
      </template>
    </modal-toolbar>
    <modal-body>
      <div class="flex flex-col">
        <template v-if="iconType">
          <!-- todo: switch types -->
        </template>
        <div v-else>
          <div class="flex flex-row items-center p-4">
            <font-awesome-icon :icon="faImage" class="mr-4"></font-awesome-icon>
            Image
          </div>
          <div class="flex flex-row items-center p-4">
            <font-awesome-icon :icon="faFont" class="mr-4"></font-awesome-icon>
            Text
          </div>
        </div>
      </div>
    </modal-body>
  </modal>
</template>

<style scoped lang="scss"></style>

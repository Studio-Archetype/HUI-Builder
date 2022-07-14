<script setup lang="ts">
import { ref, watch } from 'vue';
import { v4 as uuidV4 } from 'uuid';
import { faImage, faFont } from '@fortawesome/free-solid-svg-icons';

import Modal from '@/components/modal/Modal.vue';
import ModalToolbar from '@/components/modal/ModalToolbar.vue';
import ModalBody from '@/components/modal/ModalBody.vue';
import ImageList from '@/components/imageList/ImageList.vue';

import type { IconType } from '@/schema';
import type { ImageDef } from '@/stores/images';
import { useProjectStore } from '@/stores/project';
import { useImageStore } from '@/stores/images';

const imageStore = useImageStore();
const projectStore = useProjectStore();
const iconType = ref<IconType | null>(null);

const emit = defineEmits(['close']);
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
  iconType.value = null;
  emit('close');
}

function addText(text = 'Text Element') {
  projectStore.addComponent({
    id: uuidV4(),
    offset: [0, 0, 0],
    data: {
      type: 'decoration',
      icon: {
        type: 'text',
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
      type: 'decoration',
      icon: {
        type: 'textImage',
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
    if (iconType.value === 'text') addText();
  }
);
</script>

<template>
  <modal :open="open" @backgroundClick="close" width="35%" height="auto">
    <modal-toolbar>
      <template #title>Choose An Icon</template>
      <template #actions>
        <button class="button icon faint" @click="close">
          <font-awesome-icon fixed-width icon="close"></font-awesome-icon>
        </button>
      </template>
    </modal-toolbar>
    <modal-body>
      <div class="flex flex-col">
        <template v-if="iconType">
          <image-list
            v-if="iconType === 'textImage'"
            selectable
            show-add-btn
            :allow-delete="false"
            @imageSelected="addImage"
          />
        </template>
        <div v-else>
          <div class="choice" role="button" @click="iconType = 'textImage'">
            <font-awesome-icon
              fixed-width
              :icon="faImage"
              class="mr-4"
            ></font-awesome-icon>
            Image
          </div>
          <div class="choice" role="button" @click="addText()">
            <font-awesome-icon
              fixed-width
              :icon="faFont"
              class="mr-4"
            ></font-awesome-icon>
            Text
          </div>
        </div>
      </div>
    </modal-body>
  </modal>
</template>

<style scoped lang="scss">
.choice {
  @apply flex flex-row items-center p-4 cursor-pointer bg-white bg-opacity-0 hover:bg-opacity-10;

  &:last-child {
    @apply rounded-b-lg;
  }
}
</style>

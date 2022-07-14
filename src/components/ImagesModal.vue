<script setup lang="ts">
import { useImageStore } from '@/stores/images';
import type { ImageDef } from '@/stores/images';
import { ref, withDefaults } from 'vue';
import ImageList from '@/components/imageList/ImageList.vue';
import Modal from '@/components/modal/Modal.vue';
import ModalToolbar from '@/components/modal/ModalToolbar.vue';
import ModalFooter from '@/components/modal/ModalFooter.vue';
import ModalBody from '@/components/modal/ModalBody.vue';

enum ModalPage {
  LIST = 'List',
  DELETE_CONFIRM = 'Confirm Deletion',
}

export interface ImagesModalProps {
  open?: boolean;
  selectionMode?: boolean;
}

const imageStore = useImageStore();
const emit = defineEmits(['close', 'selected']);
const props = withDefaults(defineProps<ImagesModalProps>(), {
  open: false,
  selectionMode: false,
});

const page = ref<ModalPage>(ModalPage.LIST);
const editDeleteImage = ref<ImageDef>();

function close() {
  emit('close');
}

function confirmDeleteImage() {
  if (editDeleteImage.value) imageStore.deleteImage(editDeleteImage.value.path);
  page.value = ModalPage.LIST;
}

function deleteImage(image: ImageDef) {
  editDeleteImage.value = image;
  page.value = ModalPage.DELETE_CONFIRM;
}

function select(image: ImageDef) {
  emit('selected', image);
}
</script>

<template>
  <modal :open="props.open" @backgroundClick="close">
    <modal-toolbar>
      <template #title>
        Image Management {{ page !== ModalPage.LIST ? `// ${page}` : '' }}
      </template>
      <template #actions>
        <button class="button icon faint" @click="close">
          <font-awesome-icon fixed-width icon="close"></font-awesome-icon>
        </button>
      </template>
    </modal-toolbar>
    <modal-body>
      <template v-if="page === ModalPage.LIST">
        <div class="page listPage">
          <image-list
            :images="imageStore.allImages"
            :selectable="props.selectionMode"
            show-add-btn
            allow-delete
            @delete="deleteImage"
            @imageSelected="select"
          />
        </div>
      </template>
      <template v-else-if="page === ModalPage.DELETE_CONFIRM">
        <div class="page confirmDeletePage">
          <h3 class="heading">Confirm Deletion?</h3>
          <p class="subHeading">The image will be gone <b>forever</b></p>
          <p class="mt-4">This will not delete the image on your local disk.</p>
        </div>

        <modal-footer>
          <button class="button faint mr-2" @click="page = ModalPage.LIST">
            Cancel
          </button>
          <button class="button" @click="confirmDeleteImage">Confirm</button>
        </modal-footer>
      </template>
    </modal-body>
  </modal>
</template>

<style scoped lang="scss">
.page {
  @apply flex flex-grow;

  &.uploadPage,
  &.editImagePage {
    @apply divide-x-[1px] divide-neutral-800;

    .form {
      @apply p-4 grid grid-cols-[auto_1fr] gap-4 w-[65%] self-start;

      label {
        @apply my-auto text-right;
      }

      .noFill {
        @apply w-auto;
      }
    }

    .imagePreview {
      @apply flex items-center justify-center w-[35%] text-neutral-400;

      img {
        @apply w-[65%] h-auto;
        image-rendering: pixelated;
      }
    }
  }

  &.listPage {
    @apply items-start;
  }

  &.confirmDeletePage {
    @apply flex-col items-center justify-center;

    .heading {
      @apply font-light text-7xl;
    }

    .subHeading {
      @apply font-light text-2xl text-red-600 mt-8;

      b {
        @apply font-semibold;
      }
    }
  }
}
</style>

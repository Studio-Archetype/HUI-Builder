<script setup lang="ts">
import { ref, watch } from 'vue';
import { faImage, faFont, faBox } from '@fortawesome/free-solid-svg-icons';

import Modal from '@/components/modal/Modal.vue';
import ModalToolbar from '@/components/modal/ModalToolbar.vue';
import ModalBody from '@/components/modal/ModalBody.vue';
import ImageList from '@/components/imageList/ImageList.vue';

import type { IconType } from '@/schema';
import type { ImageDef } from '@/stores/images';
import ChooseItemDropDown from '@/components/ChooseItemDropDown.vue';
import ModalFooter from '@/components/modal/ModalFooter.vue';

const iconType = ref<IconType | null>(null);

const emit = defineEmits(['close', 'text', 'image', 'item']);
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String as () => IconType | null,
    default: null,
  },
  title: {
    type: String,
    default: 'Choose an icon',
  },
});

function close() {
  iconType.value = null;
  emit('close');
}

function image(image: ImageDef) {
  emit('image', image);
  close();
}

function textSelected() {
  emit('text');
  close();
}

const item = ref<string>('');

function itemSelected() {
  emit('item', item.value);
}

function itemValueChanged(itemName: string) {
  item.value = itemName;
}

watch(
  () => props.type,
  () => {
    iconType.value = props.type;
    if (iconType.value === 'text') textSelected();
  }
);
</script>

<template>
  <modal
    :open="open"
    @backgroundClick="close"
    :width="iconType === 'textImage' ? '75%' : '35%'"
    height="auto"
  >
    <modal-toolbar>
      <template #title>{{ title }}</template>
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
            @imageSelected="image"
          />
          <template v-if="iconType === 'item'">
            <div class="p-4">
              <choose-item-drop-down @selected="itemValueChanged" />
            </div>
            <modal-footer>
              <button
                class="button"
                :disabled="!item"
                @click="itemSelected"
              >
                Add
              </button>
            </modal-footer>
          </template>
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
          <div class="choice" role="button" @click="textSelected">
            <font-awesome-icon
              fixed-width
              :icon="faFont"
              class="mr-4"
            ></font-awesome-icon>
            Text
          </div>
          <div class="choice" role="button" @click="iconType = 'item'">
            <font-awesome-icon
              fixed-width
              :icon="faBox"
              class="mr-4"
            ></font-awesome-icon>
            Item
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

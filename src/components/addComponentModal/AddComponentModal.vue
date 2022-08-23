<script setup lang="ts">
import Modal from '@/components/modal/Modal.vue';
import ModalToolbar from '@/components/modal/ModalToolbar.vue';
import ModalBody from '@/components/modal/ModalBody.vue';
import ModalFooter from '@/components/modal/ModalFooter.vue';
import ChooseIconModal from '@/components/ChooseIconModal.vue';
import { computed, ref, watch } from 'vue';
import type { PropType } from 'vue';
import type { Action, Icon } from '@/schema';
import { getIconDisplay } from '@/schema';
import type { ImageDef } from '@/stores/images';
import ActionList from '@/components/addComponentModal/ActionList.vue';
import { v4 as uuidV4 } from 'uuid';
import { useProjectStore } from '@/stores/project';

export type ComponentAddType = 'button' | 'toggle';

const projectStore = useProjectStore();
const emit = defineEmits(['close']);
const props = defineProps({
  type: {
    type: String as unknown as PropType<ComponentAddType>,
    default: null,
  },
  open: {
    type: Boolean,
    default: false,
  },
});

const chooseIconModalOpen = ref<boolean>(false);
const page = ref<ComponentAddType | null>(props.type);
const newButtonTextInput = ref('');

watch(
  () => props.type,
  () => {
    page.value = props.type;
  }
);

const newButtonIconValue = ref<Icon>();
const newButtonActions = ref<Action[]>([]);
const newButtonHighlightModifier = ref<number>(0);
const newButtonIconDisplay = computed<string>(() => {
  if (newButtonIconValue.value)
    return getIconDisplay(
      newButtonIconValue.value,
      newButtonIconValue.value.type !== 'text'
    );
  else return 'Choose';
});

function clear() {
  newButtonTextInput.value = '';
  newButtonActions.value = [];
  newButtonIconValue.value = undefined;
  newButtonHighlightModifier.value = 0;
  page.value = null;
}

function close() {
  emit('close');
  clear();
}

function addButton() {
  projectStore.addComponent({
    id: uuidV4(),
    offset: [0, 0, 0],
    data: {
      type: 'button',
      icon: newButtonIconValue.value!,
      actions: newButtonActions.value,
      highlightModifier: newButtonHighlightModifier.value,
    },
  });

  close();
}

function chooseIconModalImage(image: ImageDef) {
  if (page.value === 'button') {
    newButtonIconValue.value = {
      type: 'textImage',
      path: image.path,
    };
  }
}

function chooseIconModalItem(item: string) {
  if (page.value === 'button') {
    newButtonIconValue.value = {
      type: 'item',
      item,
      count: 0,
      customModelData: 0,
    };
  }
}

function chooseIconModalText() {
  if (page.value === 'button') {
    newButtonIconValue.value = {
      type: 'text',
      text: 'Button text',
    };
  }
}

function setButtonText(text: string) {
  newButtonIconValue.value = {
    type: 'text',
    text,
  };
}

function newButtonEditAction(index: number, newAction: Action) {
  console.log(newAction);
  const oldActions = [...newButtonActions.value];
  oldActions[index] = newAction;
  newButtonActions.value = oldActions;
}

function newButtonCreateAction() {
  newButtonActions.value.push({
    type: 'command',
    command: '',
    source: 'server',
  });
}

function newButtonDeleteAction(index: number) {
  newButtonActions.value.splice(index, 1);
}
</script>

<template>
  <choose-icon-modal
    style="z-index: 9999"
    :open="chooseIconModalOpen"
    @close="chooseIconModalOpen = false"
    @image="chooseIconModalImage"
    @text="chooseIconModalText"
    @item="chooseIconModalItem"
  />
  <modal :open="open" width="40%">
    <modal-toolbar>
      <template #title>Add Component{{ page ? ` // ${page}` : '' }}</template>
      <template #actions>
        <button class="button icon faint" @click="close">
          <font-awesome-icon fixed-width icon="close"></font-awesome-icon>
        </button>
      </template>
    </modal-toolbar>
    <modal-body>
      <template v-if="page !== null">
        <template v-if="page === 'button'">
          <div class="page">
            <div class="form w-full">
              <label for="newButtonIconChoice">Icon</label>
              <button
                class="button"
                id="newButtonIconChoice"
                @click="chooseIconModalOpen = true"
              >
                {{ newButtonIconDisplay }}
              </button>

              <template
                v-if="newButtonIconValue && newButtonIconValue.type === 'text'"
              >
                <label for="newButtonTextInput">Text</label>
                <input
                  id="newButtonTextInput"
                  :value="newButtonIconValue.text"
                  @change="(e) => setButtonText(e.target.value)"
                />
              </template>

              <label for="newButtonActions">Actions</label>
              <ActionList
                :actions="newButtonActions"
                id="newButtonActions"
                @edit="newButtonEditAction"
                @new="newButtonCreateAction"
                @delete="newButtonDeleteAction"
              />

              <label for="newButtonHighlightModifier">
                Highlight Modifier
              </label>
              <input
                id="newButtonHighlightModifier"
                type="number"
                v-model="newButtonHighlightModifier"
              />
            </div>
          </div>
          <modal-footer>
            <button
              class="button"
              :disabled="!newButtonIconValue"
              @click="addButton"
            >
              Add
            </button>
          </modal-footer>
        </template>
      </template>
    </modal-body>
  </modal>
</template>

<style scoped lang="scss">
.page {
  @apply flex-grow flex flex-col;

  .form {
    @apply p-4 grid grid-cols-[auto_1fr] gap-4 self-start;

    label {
      @apply my-auto text-right h-full mt-1;
    }

    .noFill {
      @apply w-auto;
    }
  }

  &.new {
    @apply p-4;

    .choices {
      @apply h-full w-full grid grid-cols-2 gap-4;

      .choice {
        @apply bg-neutral-800 rounded;
      }
    }
  }
}
</style>

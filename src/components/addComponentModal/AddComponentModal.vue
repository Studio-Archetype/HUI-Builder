<script setup lang="ts">
import Modal from '@/components/modal/ModalBase.vue';
import ModalToolbar from '@/components/modal/ModalToolbar.vue';
import ModalBody from '@/components/modal/ModalBody.vue';
import ModalFooter from '@/components/modal/ModalFooter.vue';
import ChooseIconModal from '@/components/ChooseIconModal.vue';
import type { PropType } from 'vue';
import { computed, ref, watch } from 'vue';
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

const chooseButtonIconModalOpen = ref<boolean>(false);
const chooseToggleTrueIconModalOpen = ref<boolean>(false);
const chooseToggleFalseIconModalOpen = ref<boolean>(false);
const page = ref<ComponentAddType | null>(props.type);
const newToggleExpectedValue = ref('');
const newToggleCondition = ref('');

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

const newToggleTrueIconValue = ref<Icon>();
const newToggleTrueActions = ref<Action[]>([]);
const newToggleHighlightModifier = ref<number>(0);
const newToggleTrueIconDisplay = computed<string>(() => {
  if (newToggleTrueIconValue.value)
    return getIconDisplay(
      newToggleTrueIconValue.value,
      newToggleTrueIconValue.value.type !== 'text'
    );
  else return 'Choose';
});

const newToggleFalseIconValue = ref<Icon>();
const newToggleFalseActions = ref<Action[]>([]);
const newToggleFalseIconDisplay = computed<string>(() => {
  if (newToggleFalseIconValue.value)
    return getIconDisplay(
      newToggleFalseIconValue.value,
      newToggleFalseIconValue.value.type !== 'text'
    );
  else return 'Choose';
});

function clear() {
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      icon: newButtonIconValue.value!,
      actions: newButtonActions.value,
      highlightModifier: newButtonHighlightModifier.value,
    },
  });

  close();
}

function addToggle() {
  projectStore.addComponent({
    id: uuidV4(),
    offset: [0, 0, 0],
    data: {
      type: 'toggle',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      trueIcon: newToggleTrueIconValue.value!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      falseIcon: newToggleFalseIconValue.value!,

      trueActions: newToggleTrueActions.value,
      falseActions: newToggleTrueActions.value,
      highlightModifier: newToggleHighlightModifier.value,
      expectedValue: newToggleExpectedValue.value,
      condition: newToggleCondition.value,
    },
  });

  close();
}

function chooseButtonIconModalImage(image: ImageDef) {
  if (page.value === 'button') {
    newButtonIconValue.value = {
      type: 'textImage',
      path: image.path,
    };
  }
}

function chooseButtonIconModalItem(item: string) {
  if (page.value === 'button') {
    newButtonIconValue.value = {
      type: 'item',
      item,
      count: 0,
      customModelData: 0,
    };
  }
}

function chooseButtonIconModalText() {
  if (page.value === 'button') {
    newButtonIconValue.value = {
      type: 'text',
      text: 'Button text',
    };
  }
}

function chooseToggleTrueIconModalImage(image: ImageDef) {
  if (page.value === 'toggle') {
    newToggleTrueIconValue.value = {
      type: 'textImage',
      path: image.path,
    };
  }
}

function chooseToggleTrueIconModalItem(item: string) {
  if (page.value === 'toggle') {
    newToggleTrueIconValue.value = {
      type: 'item',
      item,
      count: 0,
      customModelData: 0,
    };
  }
}

function chooseToggleTrueIconModalText() {
  if (page.value === 'toggle') {
    newToggleTrueIconValue.value = {
      type: 'text',
      text: 'True icon text',
    };
  }
}

function chooseToggleFalseIconModalImage(image: ImageDef) {
  if (page.value === 'toggle') {
    newToggleFalseIconValue.value = {
      type: 'textImage',
      path: image.path,
    };
  }
}

function chooseToggleFalseIconModalItem(item: string) {
  if (page.value === 'toggle') {
    newToggleFalseIconValue.value = {
      type: 'item',
      item,
      count: 0,
      customModelData: 0,
    };
  }
}

function chooseToggleFalseIconModalText() {
  if (page.value === 'toggle') {
    newToggleFalseIconValue.value = {
      type: 'text',
      text: 'False icon text',
    };
  }
}

function setButtonText(text: string) {
  newButtonIconValue.value = {
    type: 'text',
    text,
  };
}

function setToggleTrueIconText(text: string) {
  newToggleTrueIconValue.value = {
    type: 'text',
    text,
  };
}

function setToggleFalseIconText(text: string) {
  newToggleFalseIconValue.value = {
    type: 'text',
    text,
  };
}

function newButtonEditAction(index: number, newAction: Action) {
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

function newToggleEditTrueAction(index: number, newAction: Action) {
  const oldActions = [...newToggleTrueActions.value];
  oldActions[index] = newAction;
  newToggleTrueActions.value = oldActions;
}

function newToggleCreateTrueAction() {
  newToggleTrueActions.value.push({
    type: 'command',
    command: '',
    source: 'server',
  });
}

function newToggleDeleteTrueAction(index: number) {
  newToggleTrueActions.value.splice(index, 1);
}

function newToggleEditFalseAction(index: number, newAction: Action) {
  const oldActions = [...newToggleFalseActions.value];
  oldActions[index] = newAction;
  newToggleFalseActions.value = oldActions;
}

function newToggleCreateFalseAction() {
  newToggleFalseActions.value.push({
    type: 'command',
    command: '',
    source: 'server',
  });
}

function newToggleDeleteFalseAction(index: number) {
  newToggleFalseActions.value.splice(index, 1);
}
</script>

<template>
  <choose-icon-modal
    style="z-index: 9999"
    :open="chooseButtonIconModalOpen"
    @close="chooseButtonIconModalOpen = false"
    @image="chooseButtonIconModalImage"
    @text="chooseButtonIconModalText"
    @item="chooseButtonIconModalItem"
  />

  <choose-icon-modal
    style="z-index: 9999"
    :open="chooseToggleTrueIconModalOpen"
    @close="chooseToggleTrueIconModalOpen = false"
    @image="chooseToggleTrueIconModalImage"
    @text="chooseToggleTrueIconModalText"
    @item="chooseToggleTrueIconModalItem"
  />

  <choose-icon-modal
    style="z-index: 9999"
    :open="chooseToggleFalseIconModalOpen"
    @close="chooseToggleFalseIconModalOpen = false"
    @image="chooseToggleFalseIconModalImage"
    @text="chooseToggleFalseIconModalText"
    @item="chooseToggleFalseIconModalItem"
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
                @click="chooseButtonIconModalOpen = true"
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
                  @change="(e) => setButtonText((e.target as HTMLInputElement).value)"
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
              Add Button
            </button>
          </modal-footer>
        </template>
        <template v-if="page === 'toggle'">
          <div class="page">
            <div class="form w-full">
              <label for="newToggleTrueIconChoice">True Icon</label>
              <button
                class="button"
                id="newToggleTrueIconChoice"
                @click="chooseToggleTrueIconModalOpen = true"
              >
                {{ newToggleTrueIconDisplay }}
              </button>

              <template
                v-if="
                  newToggleTrueIconValue &&
                  newToggleTrueIconValue.type === 'text'
                "
              >
                <label for="newToggleTrueIconTextInput">True Icon Text</label>
                <input
                  id="newToggleTrueIconTextInput"
                  :value="newToggleTrueIconValue.text"
                  @input="(e) => setToggleTrueIconText((e.target as HTMLInputElement).value)"
                />
              </template>

              <label for="newToggleFalseIconChoice">False Icon</label>
              <button
                class="button"
                id="newToggleFalseIconChoice"
                @click="chooseToggleFalseIconModalOpen = true"
              >
                {{ newToggleFalseIconDisplay }}
              </button>

              <template
                v-if="
                  newToggleFalseIconValue &&
                  newToggleFalseIconValue.type === 'text'
                "
              >
                <label for="newToggleFalseIconTextInput">False Icon Text</label>
                <input
                  id="newToggleFalseIconTextInput"
                  :value="newToggleFalseIconValue.text"
                  @input="(e) => setToggleFalseIconText((e.target as HTMLInputElement).value)"
                />
              </template>

              <label for="newToggleTrueActions">True Actions</label>
              <ActionList
                :actions="newToggleTrueActions"
                id="newToggleTrueActions"
                @edit="newToggleEditTrueAction"
                @new="newToggleCreateTrueAction"
                @delete="newToggleDeleteTrueAction"
              />

              <label for="newToggleTrueActions">False Actions</label>
              <ActionList
                :actions="newToggleFalseActions"
                id="newToggleTrueActions"
                @edit="newToggleEditFalseAction"
                @new="newToggleCreateFalseAction"
                @delete="newToggleDeleteFalseAction"
              />

              <label for="newToggleHighlightModifier">
                Highlight Modifier
              </label>
              <input
                id="newToggleHighlightModifier"
                type="number"
                v-model="newToggleHighlightModifier"
              />

              <label for="newToggleExpectedValue"> Expected Value </label>
              <input
                id="newToggleExpectedValue"
                v-model="newToggleExpectedValue"
                placeholder="true"
              />

              <label for="newToggleCondition"> Condition </label>
              <input
                id="newToggleCondition"
                v-model="newToggleCondition"
                placeholder="x == y"
              />
            </div>
          </div>
          <modal-footer>
            <button
              class="button"
              :disabled="
                !newToggleTrueIconValue ||
                !newToggleFalseIconValue ||
                newToggleCondition === '' ||
                newToggleExpectedValue === ''
              "
              @click="addToggle"
            >
              Add Toggle
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

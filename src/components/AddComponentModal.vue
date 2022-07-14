<script setup lang="ts">
import Modal from '@/components/modal/Modal.vue';
import ModalToolbar from '@/components/modal/ModalToolbar.vue';
import ModalBody from '@/components/modal/ModalBody.vue';
import { ref, watch } from 'vue';
import type { PropType } from 'vue';

export type ComponentAddType = 'button' | 'toggle';

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

const page = ref<ComponentAddType | null>(props.type);
const newImageImageInput = ref('');

watch(
  () => props.type,
  () => {
    page.value = props.type;
  }
);

function clear() {
  newImageImageInput.value = '';
  page.value = null;
}

function close() {
  emit('close');
  clear();
}
</script>

<template>
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
        <!--    <template v-if="page === 'static'">-->
        <!--      <div class="page">-->
        <!--        <div class="form">-->
        <!--          <label for="newTextTextInput">Text</label>-->
        <!--          <input id="newTextTextInput" v-model="newTextTextInput" />-->
        <!--        </div>-->
        <!--      </div>-->
        <!--      <modal-footer>-->
        <!--        <button class="button faint" @click="clear">Cancel</button>-->
        <!--        <button class="button" @click="addText">Add</button>-->
        <!--      </modal-footer>-->
        <!--    </template>-->
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
      @apply my-auto text-right;
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

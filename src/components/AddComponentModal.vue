<script setup lang="ts">
import Modal from "@/components/modal/Modal.vue";
import ModalToolbar from "@/components/modal/ModalToolbar.vue";
import ModalBody from "@/components/modal/ModalBody.vue";
import { ref, watch } from "vue";
import type { PropType } from "vue";
import { useImageStore } from "@/stores/images";
import type { ImageDef } from "@/stores/images";
import { useProjectStore } from "@/stores/project";
import { v4 as uuidV4 } from "uuid";
import ImagesModal from "@/components/ImagesModal.vue";

type ComponentAddType = "image" | "text" | "button" | "toggle";

const imageStore = useImageStore();
const projectStore = useProjectStore();
const emit = defineEmits(["close"]);
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

const page = ref<string | null>(props.type);
const newImageImageInput = ref("");

watch(
  () => props.type,
  () => {
    page.value = props.type;
    if (page.value === "text") addText();
  }
);

function clear() {
  newImageImageInput.value = "";
  page.value = null;
}

function close() {
  emit("close");
  clear();
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
</script>

<template>
  <images-modal
    :open="open"
    @close="close"
    v-if="page === 'image'"
    selection-mode
    @selected="addImage"
  />
  <modal v-else :open="open" width="40%">
    <modal-toolbar>
      <template #title>Add Component{{ page ? ` // ${page}` : "" }}</template>
      <template #actions>
        <button v-if="page !== null" class="button icon faint" @click="clear">
          <font-awesome-icon fixed-width icon="arrow-left"></font-awesome-icon>
        </button>
        <button class="button icon faint" @click="close">
          <font-awesome-icon fixed-width icon="close"></font-awesome-icon>
        </button>
      </template>
    </modal-toolbar>
    <modal-body>
      <template v-if="page !== null">
        <!--    <template v-if="page === 'text'">-->
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
      <template v-else>
        <div class="page new">
          <div class="choices">
            <button class="choice" @click="page = 'image'">Image</button>
            <button class="choice" @click="page = 'text'">Text</button>
            <button class="choice" @click="page = 'button'">Button</button>
            <button class="choice" @click="page = 'toggle'">Toggle</button>
          </div>
        </div>
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

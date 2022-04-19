<script setup lang="ts">
import Modal from "@/components/modal/Modal.vue";
import ModalToolbar from "@/components/modal/ModalToolbar.vue";
import ModalFooter from "@/components/modal/ModalFooter.vue";
import ModalBody from "@/components/modal/ModalBody.vue";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const emit = defineEmits(["close"]);
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

function close() {
  emit("close");
}
</script>

<template>
  <modal :open="open" @backgroundClick="close">
    <modal-toolbar>
      <template #title>About Application</template>
      <template #actions>
        <a
          class="button icon faint"
          href="https://github.com/Studio-Archetype/HUI-Builder"
        >
          <font-awesome-icon fixed-width :icon="faGithub"></font-awesome-icon>
        </a>
        <div class="divider" />
        <button class="button icon faint" @click="close">
          <font-awesome-icon fixed-width icon="close"></font-awesome-icon>
        </button>
      </template>
    </modal-toolbar>
    <modal-body>
      <div class="page topology">

      </div>
      <modal-footer>
        <p class="text-neutral-500">
          &copy; {{ new Date().getFullYear() }} Studio Archetype, All Rights
          Reserved.
        </p>
      </modal-footer>
    </modal-body>
  </modal>
</template>

<style scoped lang="scss">
.page {
  @apply flex flex-grow p-4 flex-col;
}
</style>

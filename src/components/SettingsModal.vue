<script setup lang="ts">
import Modal from "@/components/modal/Modal.vue";
import ModalToolbar from "@/components/modal/ModalToolbar.vue";
import { useSettingsStore } from "@/stores/settings";
import ModalFooter from "@/components/modal/ModalFooter.vue";
import ModalBody from "@/components/modal/ModalBody.vue";

const settingsStore = useSettingsStore();
const emit = defineEmits(["close"]);
defineProps({
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
      <template #title>Settings</template>
      <template #actions>
        <button class="button icon faint" @click="close">
          <font-awesome-icon fixed-width icon="close"></font-awesome-icon>
        </button>
      </template>
    </modal-toolbar>
    <modal-body>
      <div class="page">
        <div class="inputGroup">
          <input
            type="checkbox"
            id="debugFramesCheck"
            v-model="settingsStore.settings.debugFrames"
          />
          <label for="debugFramesCheck">
            Debug Frames:
            {{ settingsStore.settings.debugFrames ? "On" : "Off" }}
          </label>
        </div>
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

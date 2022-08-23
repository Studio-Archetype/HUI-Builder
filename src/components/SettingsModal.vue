<script setup lang="ts">
import Modal from '@/components/modal/ModalBase.vue';
import ModalToolbar from '@/components/modal/ModalToolbar.vue';
import { useSettingsStore } from '@/stores/settings';
import ModalFooter from '@/components/modal/ModalFooter.vue';
import ModalBody from '@/components/modal/ModalBody.vue';
import VersionSwitcher from '@/components/VersionSwitcher.vue';

const settingsStore = useSettingsStore();
const emit = defineEmits(['close']);
defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

function close() {
  emit('close');
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
            v-model="settingsStore.debugFrames"
          />
          <label for="debugFramesCheck">
            Debug Frames:
            {{ settingsStore.debugFrames ? 'On' : 'Off' }}
          </label>
        </div>

        <div class="inputGroup">
          <label>Minecraft Version:</label>
          <VersionSwitcher />
        </div>

        <div class="inputGroup">
          <input
            type="checkbox"
            id="devModeCheck"
            v-model="settingsStore.devMode"
          />
          <label for="devModeCheck">
            Developer Mode:
            {{ settingsStore.devMode ? 'On' : 'Off' }}
            (Only enable this if you know what you're doing)
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

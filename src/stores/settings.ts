import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useSettingsStore = defineStore(
  'settings',
  () => {
    const debugFrames = ref<boolean>(false);
    const devMode = ref<boolean>(false);
    const minecraftVersion = ref<string>('1.19');

    return {
      debugFrames,
      minecraftVersion,
      devMode,
    };
  },
  { persist: true }
);

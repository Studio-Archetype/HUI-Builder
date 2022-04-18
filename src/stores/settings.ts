import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useSettingsStore = defineStore({
  id: "settings",
  state: () => ({
    settings: useStorage("settings", {
      debugFrames: false,
    }),
  }),
});

import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import type { HuiData } from "@/schema";
import { v4 as uuidV4 } from "uuid";

export const useProjectStore = defineStore({
  id: "project",
  state: () => ({
    project: useStorage<HuiData>("project", {
      components: [
        {
          id: uuidV4(),
          offset: [0, 0, 0],
          data: {
            type: "decoration",
            icon: {
              type: "text",
              text: "Test Text",
            },
          },
        },
      ],
      offset: [0, 0, 0],
      lockPosition: false,
    }),
  }),
  getters: {},
  actions: {
    setProject(project: HuiData) {
      this.project = project;
    },
  },
});

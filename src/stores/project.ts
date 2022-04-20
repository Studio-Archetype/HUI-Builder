import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import type { Component, HuiData } from "@/schema";
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
    addComponent(component: Component) {
      this.project.components.push(component);
    },
    deleteComponent(componentId: string) {
      const index = this.project.components.findIndex(
        (it: Component) => it.id === componentId
      );
      this.project.components.splice(index, 1);
    },
  },
});

import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export interface ImageDef {
  path: string;
  content: string;
}

export type ImageEditParams = Partial<ImageDef>;

export const useImageStore = defineStore({
  id: 'images',
  state: () => ({
    images: useStorage<ImageDef[]>('images', []),
  }),
  getters: {
    allImages: (state): ImageDef[] => state.images,
    imageByPath(state): (path: string) => ImageDef | undefined {
      return (path: string): ImageDef | undefined =>
        state.images.find((it: ImageDef) => it.path === path);
    },
  },
  actions: {
    addImage(image: ImageDef) {
      this.images.push(image);
    },
    deleteImage(path: string) {
      this.images.splice(
        this.images.findIndex((it: ImageDef) => it.path === path),
        1
      );
    },
    editImage(path: string, editParams: ImageEditParams) {
      const imageIndex = this.images.findIndex(
        (it: ImageDef) => it.path === path
      );

      const oldValue = this.images[imageIndex];
      this.images[imageIndex] = {
        ...oldValue,
        ...editParams,
      };
    },
  },
});

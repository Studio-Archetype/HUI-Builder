import { defineStore } from 'pinia';
import type { ImageDef } from '@/stores/images';
import { ref } from 'vue';

function getDataUri(img: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ctx = canvas.getContext('2d')!;
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL('image/png');
}

export const useItemImageCacheStore = defineStore(
  'itemImages',
  () => {
    const images = ref<ImageDef[]>([]);

    async function getItemImage(itemName: string): Promise<ImageDef> {
      return new Promise((resolve, reject) => {
        for (const image of [...images.value])
          if (image.path === itemName) return resolve(image);

        // nothing matches, add it
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => {
          const imageDef: ImageDef = {
            path: itemName,
            content: getDataUri(image),
          };

          images.value.push(imageDef);
          return getItemImage(itemName);
        };

        image.onerror = () => {
          reject();
        };

        // todo: use CDN link
        image.src = '/dirt.png';
      });
    }

    return { images, getItemImage };
  },
  { persist: true }
);

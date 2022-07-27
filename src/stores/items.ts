import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useSettingsStore } from '@/stores/settings';

export interface ItemDef {
  id: number;
  name: string;
  displayName: string;
  stackSize: number;
}

export const useItemStore = defineStore(
  'items',
  () => {
    const items = ref<ItemDef[]>();
    const settingsStore = useSettingsStore();
    const lastFetched = ref<number>();

    async function fetchItems(version = settingsStore.minecraftVersion) {

      console.log(`Fetching items for version ${version}`)
      const res = await fetch(
        `https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/${version}/items.json`,
        {
          headers: {
            'Accept': 'application/json', // eslint-disable-line prettier/prettier
          },
        }
      );

      if (!res.ok) {
        // todo: handle error
        return;
      }

      items.value = await res.json();
      lastFetched.value = Date.now();
    }

    async function autoFetchItems() {
      const cacheThreshold = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

      if (
        !lastFetched.value ||
        (!!lastFetched.value && lastFetched.value < Date.now() - cacheThreshold)
      )
        await fetchItems();
    }

    return {
      items,
      lastFetched,
      fetchItems,
      autoFetchItems,
    };
  },
  { persist: true }
);

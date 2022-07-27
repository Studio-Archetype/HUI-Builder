<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings';
import { useItemStore } from '@/stores/items';
import { computed, onMounted } from 'vue';

const settingsStore = useSettingsStore();
const itemStore = useItemStore();
const options = ['1.18', '1.19'];

export interface VersionSwitcherProps {
  inline?: boolean;
}

const props = withDefaults(defineProps<VersionSwitcherProps>(), {
  inline: false,
});

const dynamicClasses = computed(() => ({
  inline: props.inline,
}));

onMounted(() => {
  itemStore.autoFetchItems();
});

async function upd(value: string) {
  settingsStore.minecraftVersion = value;
  await itemStore.fetchItems(value);
}
</script>

<template>
  <select
    :value="settingsStore.minecraftVersion"
    @change="(e) => upd(e.target.value)"
    :class="dynamicClasses"
  >
    <option v-for="(version, index) in options" :key="index">
      {{ version }}
    </option>
  </select>
</template>

<style scoped lang="scss"></style>

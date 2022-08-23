<script setup lang="ts">
import type { Icon, TextImageIcon, TextIcon, ItemIcon } from '@/schema';
import { useImageStore } from '@/stores/images';
import ChooseItemDropDown from '@/components/ChooseItemDropDown.vue';

// props
interface IconDataSidebarProps {
  icon: Icon;
}

const props = withDefaults(defineProps<IconDataSidebarProps>(), {});
const emit = defineEmits(['iconChanged']);

// hooks
const imageStore = useImageStore();

// methods
function textImageIconPathChange(e: Event) {
  const newPath = (e.target as HTMLInputElement).value;
  const copyIcon: TextImageIcon = {
    ...(props.icon as TextImageIcon),
    path: newPath,
  };
  emit('iconChanged', copyIcon);
}

function textIconTextChange(e: Event) {
  const newText = (e.target as HTMLInputElement).value;
  const copyIcon: TextIcon = {
    ...(props.icon as TextIcon),
    text: newText,
  };
  emit('iconChanged', copyIcon);
}

function itemIconItemChange(item: string) {
  const copyIcon: ItemIcon = {
    ...(props.icon as ItemIcon),
    item,
  };
  emit('iconChanged', copyIcon);
}
</script>

<template>
  <div class="inputGroup" v-if="props.icon.type === 'text'">
    <label for="textIconText">Text</label>
    <input
      id="textIconText"
      :value="(props.icon as TextIcon).text"
      @input="textIconTextChange"
    />
  </div>
  <div v-if="props.icon.type === 'textImage'" class="inputGroup">
    <label for="textImageIconPathInput">Path</label>

    <select
      id="textImageIconPathInput"
      @change="textImageIconPathChange"
      :value="(props.icon as TextImageIcon).path"
    >
      <option v-for="image in imageStore.allImages" :key="image.path">
        {{ image.path }}
      </option>
    </select>
  </div>
  <div v-if="props.icon.type === 'item'" class="inputGroup">
    <label>Item</label>

    <choose-item-drop-down
      :item="(props.icon as ItemIcon).item"
      @selected="itemIconItemChange"
    />
  </div>
</template>

<style scoped lang="scss">
.textIconText {
  @apply mt-3;
}
</style>

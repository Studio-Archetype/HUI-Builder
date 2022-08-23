<script setup lang="ts">
import VueSelect from 'vue-select';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ItemDef } from '@/stores/items';
import { useItemStore } from '@/stores/items';
import { ref } from 'vue';

const itemStore = useItemStore();

const emit = defineEmits(['selected']);

const item = ref<string>();

function itemSelected(value: string) {
  item.value = value;
  emit('selected', value);
}
</script>

<template>
  <VueSelect
    class="itemChooser"
    :options="itemStore.items"
    :reduce="(item: ItemDef) => item.name"
    :modelValue="item"
    @update:modelValue="itemSelected"
    label="displayName"
    placeholder="Select an item"
  ></VueSelect>
</template>

<style lang="scss">
.itemChooser {
  @apply text-white rounded transition text-base align-middle appearance-none flex flex-col max-h-72 justify-items-stretch box-border;

  &.vs--open {
    .vs__dropdown-toggle {
      .vs__selected-options {
        .vs__selected {
          @apply bg-opacity-25;
        }

        .vs__search {
          @apply bg-opacity-25;
        }
      }
      .vs__actions {
        @apply bg-opacity-25;
      }
    }
  }

  .vs__dropdown-toggle {
    @apply flex;
    .vs__selected-options {
      @apply flex-grow flex;

      .vs__selected {
        @apply rounded-l py-1 pl-3 bg-opacity-10 bg-white flex-grow-0;
      }

      .vs__search {
        @apply outline-0 py-1 px-3 bg-opacity-10 bg-white flex-grow;

        &:first-child {
          @apply rounded-l;
        }
      }
    }

    .vs__actions {
      @apply flex-grow-0 flex items-center w-[33px] bg-opacity-10 bg-white rounded-r;

      .vs__clear {
        @apply aspect-square flex justify-center items-center h-full px-2 ml-[1px] bg-opacity-0 bg-white rounded-r;

        &:hover {
          @apply bg-opacity-10;
        }

        svg {
          @apply fill-white block;
        }
      }

      .vs__open-indicator {
        @apply block w-0;
      }
    }
  }

  .vs__dropdown-menu {
    @apply overflow-y-auto rounded mt-1.5;

    .vs__dropdown-option {
      @apply py-1 px-3 bg-opacity-10 bg-white;

      &:first-child {
        @apply rounded-tl;
      }

      &:last-child {
        @apply rounded-bl;
      }

      &:hover {
        @apply bg-opacity-25;
      }
    }
  }
}
</style>

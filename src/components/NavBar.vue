<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings";

const settingsStore = useSettingsStore();
</script>

<template>
  <div class="navbar">
    <div class="navbarInner">
      <div class="brand">
        <img src="/logo.svg" alt="Studio Archetype Logo" />
        <div class="text"><span class="font-black">STUDIO</span>ARCHETYPE</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.navbar {
  @apply bg-black flex-grow-0;

  .navbarInner {
    @apply mx-auto flex items-center h-16 px-4;

    .brand {
      @apply mr-4 flex items-center appearance-none;

      img {
        @apply h-8 w-8 lg:mr-4;
      }

      .text {
        @apply text-white font-thin hidden lg:inline-block;
      }
    }

    .navItem {
      @apply relative h-full;

      .inner {
        @apply text-sm text-white h-full px-4 h-full flex items-center leading-none;
      }
    }
  }
}
</style>

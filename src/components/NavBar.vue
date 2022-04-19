<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings";

const settingsStore = useSettingsStore();

function confirmLeave() {
  const leave = window.confirm("Leave the page?");
  if (leave) window.location.href = "https://studioarchetype.net/holoui";
}
</script>

<template>
  <div class="navbar">
    <div class="navbarInner">
      <button class="brand" @click="confirmLeave">
        <img :src="import('@/assets/logo.svg')" alt="Studio Archetype Logo" />
        <div class="text"><span class="font-black">STUDIO</span>ARCHETYPE</div>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.navbar {
  @apply bg-black;

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
    }
  }
}
</style>

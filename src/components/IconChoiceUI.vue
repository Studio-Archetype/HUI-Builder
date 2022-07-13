<script setup lang="ts">
import { ref } from "vue";
import type { IconType } from "@/schema";

const iconType = ref<IconType>();
</script>

<template>
  <div class="flex flex-col">
    <template v-if="iconType">
      <!-- todo: switch types -->
    </template>
    <div v-else>
      <!-- todo: icon type selection -->
    </div>
  </div>
</template>

<style scoped></style>

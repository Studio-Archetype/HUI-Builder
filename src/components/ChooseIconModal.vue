<script setup lang="ts">
import { ref } from "vue";
import type { IconType } from "@/schema";
import { faImage, faFont } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/components/modal/Modal.vue";
import ModalToolbar from "@/components/modal/ModalToolbar.vue";
import ModalBody from "@/components/modal/ModalBody.vue";

const iconType = ref<IconType | null>(null);

const emit = defineEmits(["cancel", "selected"]);
defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <modal :open="open" @backgroundClick="close" width="35%" height="75%">
    <modal-toolbar>
      <template #title>About Application</template>
      <template #actions>
        <button class="button icon faint" @click="close">
          <font-awesome-icon fixed-width icon="close"></font-awesome-icon>
        </button>
      </template>
    </modal-toolbar>
    <modal-body>
      <div class="flex flex-col">
        <template v-if="iconType">
          <!-- todo: switch types -->
        </template>
        <div v-else>
          <div class="flex flex-row items-center p-4">
            <font-awesome-icon :icon="faImage" class="mr-4"></font-awesome-icon>
            Image
          </div>
          <div class="flex flex-row items-center p-4">
            <font-awesome-icon :icon="faFont" class="mr-4"></font-awesome-icon>
            Text
          </div>
        </div>
      </div>
    </modal-body>
  </modal>
</template>

<style scoped lang="scss"></style>

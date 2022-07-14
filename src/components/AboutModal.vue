<script setup lang="ts">
import Modal from "@/components/modal/Modal.vue";
import ModalToolbar from "@/components/modal/ModalToolbar.vue";
import ModalFooter from "@/components/modal/ModalFooter.vue";
import ModalBody from "@/components/modal/ModalBody.vue";
import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";

export interface AboutModalProps {
  open?: boolean;
}

const emit = defineEmits(["close"]);
const props = withDefaults(defineProps<AboutModalProps>(), {
  open: false,
});

function close() {
  emit("close");
}

const buildNumber = 1;
</script>

<template>
  <modal :open="props.open" @backgroundClick="close" width="35%" height="75%">
    <modal-toolbar>
      <template #title>About Application</template>
      <template #actions>
        <button class="button icon faint" @click="close">
          <font-awesome-icon fixed-width icon="close"></font-awesome-icon>
        </button>
      </template>
    </modal-toolbar>
    <modal-body>
      <div class="page topology">
        <h2>HUI Builder</h2>
        <p>
          &copy; {{ new Date().getFullYear() }} Studio Archetype, All Rights
          Reserved.
        </p>

        <div class="buttons">
          <a
            class="button"
            href="https://github.com/Studio-Archetype/HUI-Builder"
          >
            <font-awesome-icon fixed-width :icon="faGithub"></font-awesome-icon>
            Github
          </a>

          <a
            class="button"
            href="https://github.com/Studio-Archetype/HUI-Builder"
          >
            <font-awesome-icon
              fixed-width
              :icon="faDiscord"
            ></font-awesome-icon>
            Support
          </a>

          <a class="button" href="https://studioarchetype.net/hologui">
            <font-awesome-icon
              fixed-width
              icon="dollar-sign"
            ></font-awesome-icon>
            Buy
          </a>
          <a
            class="button"
            href="https://docs.studioarchetype.net/en/utilities/hui"
          >
            <font-awesome-icon fixed-width icon="book"></font-awesome-icon>
            Docs
          </a>
        </div>
      </div>

      <modal-footer>
        <span class="text-neutral-500"> Build {{ buildNumber }} </span>
      </modal-footer>
    </modal-body>
  </modal>
</template>

<style scoped lang="scss">
.page {
  @apply flex flex-grow p-16 flex-col items-center;

  h2 {
    @apply font-light text-6xl;
  }

  p {
    @apply text-lg mt-8;
  }

  .buttons {
    @apply grid grid-cols-2 w-full mt-8 gap-2;

    .button {
      @apply text-center;
    }
  }
}
</style>

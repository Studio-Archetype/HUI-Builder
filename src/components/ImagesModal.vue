<script setup lang="ts">
import { useImageStore } from "@/stores/images";
import type { ImageDef } from "@/stores/images";
import { ref } from "vue";
import ImageList from "@/components/ImageList/ImageList.vue";

enum ModalPage {
  UPLOAD = "Upload",
  LIST = "List",
  EDIT_IMAGE = "Edit Image",
  DELETE_CONFIRM = "Confirm Deletion",
}

const imageStore = useImageStore();
const emit = defineEmits(["close"]);
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  selectionMode: {
    type: Boolean,
    default: false,
  },
});

let page = ref<ModalPage>(ModalPage.LIST);
let chooseImagePath = ref<string>("");
let chooseImageContent = ref<string>("");
let editDeleteImage = ref<ImageDef>();
let editImageOldPath = ref<string>("");
let editImagePath = ref<string>("");

function close() {
  emit("close");
}

function chooseImage() {
  const element = document.createElement("input");
  element.type = "file";
  element.accept = "png";
  element.onchange = async (fileEvt: Event) => {
    const reader = new FileReader();
    reader.onload = (readerEvt: Event) => {
      chooseImageContent.value = (readerEvt.target as FileReader)
        .result as string;
    };

    const file = (fileEvt.target as HTMLInputElement)?.files?.[0];
    if (file) reader.readAsDataURL(file);
    else {
      // todo: warn the user
    }

    document.body.removeChild(element);
  };
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
}

function confirmAddImage() {
  if (!imageStore.imageByPath(chooseImagePath.value)) {
    imageStore.addImage({
      path: chooseImagePath.value,
      content: chooseImageContent.value,
    });
  } else {
    console.log(`Path taken: ${chooseImagePath.value}`);
    // todo: warn user
  }

  page.value = ModalPage.LIST;
}

function confirmEditImage() {
  if (!imageStore.imageByPath(editImagePath.value)) {
    imageStore.editImage(editImageOldPath.value, {
      path: editImagePath.value,
    });
  } else {
    console.log(`Path taken: ${editImagePath.value}`);
    // todo: warn user
  }

  page.value = ModalPage.LIST;
}

function confirmDeleteImage() {
  if (editDeleteImage.value) imageStore.deleteImage(editDeleteImage.value.path);
  page.value = ModalPage.LIST;
}

function editImage(image: ImageDef) {
  editImageOldPath.value = image.path;
  editImagePath.value = image.path;
  editDeleteImage.value = image;
  page.value = ModalPage.EDIT_IMAGE;
}

function deleteImage(image: ImageDef) {
  editDeleteImage.value = image;
  page.value = ModalPage.DELETE_CONFIRM;
}
</script>

<template>
  <div class="imageManagementModalContainer" :class="{ open }">
    <section class="imageManagementModal">
      <div class="toolbar">
        <div class="title">
          Image Management {{ page !== ModalPage.LIST ? `// ${page}` : "" }}
        </div>
        <div class="spacer" />
        <div class="actions">
          <button class="action" @click="page = ModalPage.UPLOAD">
            <font-awesome-icon fixed-width icon="plus"></font-awesome-icon>
          </button>
          <div class="divider" />
          <button
            v-if="page !== ModalPage.LIST"
            class="action"
            @click="page = ModalPage.LIST"
          >
            <font-awesome-icon
              fixed-width
              icon="arrow-left"
            ></font-awesome-icon>
          </button>
          <button class="action" @click="close">
            <font-awesome-icon fixed-width icon="close"></font-awesome-icon>
          </button>
        </div>
      </div>
      <div class="body">
        <template v-if="page === ModalPage.LIST">
          <div class="page listPage">
            <image-list
              :images="imageStore.allImages"
              :selectable="selectionMode"
              @edit="editImage"
              @delete="deleteImage"
            />
          </div>
        </template>
        <template v-else-if="page === ModalPage.UPLOAD">
          <div class="page uploadPage">
            <section class="form">
              <label for="pathInputUpload">Path</label>
              <input
                id="pathInputUpload"
                type="text"
                v-model="chooseImagePath"
                placeholder="/image.png"
              />
              <label for="uploadButton">Image</label>
              <div>
                <button
                  class="faintButton noFill"
                  id="uploadButton"
                  @click="chooseImage"
                >
                  Upload Image
                </button>
              </div>
            </section>
            <aside class="imagePreview">
              <img
                v-if="chooseImageContent !== ''"
                :src="chooseImageContent"
                alt="Selected Image"
              />
              <span v-else>No Image Selected</span>
            </aside>
          </div>

          <div class="bottomBar">
            <button class="faintButton" @click="confirmAddImage">
              Confirm
            </button>
          </div>
        </template>
        <template v-else-if="page === ModalPage.EDIT_IMAGE">
          <div class="page editImagePage">
            <section class="form">
              <label for="pathInputEdit">Path</label>
              <input
                id="pathInputEdit"
                type="text"
                v-model="editImagePath"
                placeholder="/image.png"
              />
            </section>
            <aside class="imagePreview">
              <img :src="editDeleteImage.content" alt="Selected Image" />
            </aside>
          </div>

          <div class="bottomBar">
            <button
              class="faintButton"
              :disabled="editImagePath === editImageOldPath"
              @click="confirmEditImage"
            >
              Confirm
            </button>
          </div>
        </template>
        <template v-else-if="page === ModalPage.DELETE_CONFIRM">
          <div class="page confirmDeletePage">
            <h3 class="heading">
              Confirm Deletion?
            </h3>
            <p class="subHeading">The image will be gone <b>forever</b></p>
          </div>

          <div class="bottomBar">
            <button
                class="faintButton"
                @click="confirmDeleteImage"
            >
              Confirm
            </button>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.imageManagementModalContainer {
  @apply absolute bottom-0 top-0 left-0 right-0 bg-neutral-800 bg-opacity-80 hidden items-center justify-center;
  z-index: 2000;

  &.open {
    @apply flex;
  }

  .imageManagementModal {
    @apply rounded-lg bg-neutral-900 w-[75%] h-[75%] flex flex-col shadow-2xl;

    .toolbar {
      @apply rounded-t-lg flex items-center p-2 flex-grow-0;
      background-color: lighten(#000, 4);

      .title {
        @apply font-bold flex-grow-0 p-2 leading-none;
      }

      .spacer {
        @apply flex-grow;
      }

      .actions {
        @apply flex-grow-0 flex flex-row items-center;

        *:not(:first-child) {
          @apply ml-2;
        }

        .divider {
          @apply border-neutral-700 border-[1px] rounded-sm self-stretch bg-neutral-700;
        }

        .action {
          @apply p-2 bg-white bg-opacity-0 rounded leading-5 transition ease-in-out flex items-center;

          &:hover {
            @apply bg-opacity-25;
          }
        }
      }
    }

    .body {
      @apply flex flex-grow flex-col divide-y-[1px] divide-neutral-600;

      > *:last-child {
        @apply rounded-b-lg;
      }

      .page {
        @apply flex flex-grow;

        &.uploadPage,
        &.editImagePage {
          @apply divide-x-[1px] divide-neutral-600;

          .form {
            @apply p-4 grid grid-cols-[auto_1fr] gap-4 w-[65%] self-start;

            label {
              @apply my-auto text-right;
            }

            .noFill {
              @apply w-auto;
            }
          }

          .imagePreview {
            @apply flex items-center justify-center w-[35%] text-neutral-400;
          }
        }

        &.listPage {
          @apply items-start;
        }

        &.confirmDeletePage {
          @apply flex-col items-center justify-center;

          .heading {
            @apply font-light text-7xl;
          }
          .subHeading {
            @apply font-light text-2xl text-red-600 mt-8;

            b {
              @apply font-semibold;
            }
          }
        }
      }

      .bottomBar {
        @apply flex flex-grow-0 justify-end p-2;
      }
    }
  }
}

.faintButton {
  @apply bg-opacity-10 bg-white text-white leading-none py-2 px-3 rounded transition text-base;

  &:hover {
    @apply bg-opacity-25;
  }
}

input {
  @apply bg-opacity-10 bg-white text-white py-1.5 px-3 rounded transition text-base leading-none align-middle;

  &:focus {
    @apply bg-opacity-25 outline-0;
  }
}

::placeholder {
  @apply text-white text-opacity-50 text-base align-middle;
}
</style>

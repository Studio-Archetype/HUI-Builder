<script setup lang="ts">
import { onMounted, onUpdated, reactive, ref, watch } from "vue";
import type {
  Button,
  Deco,
  HuiData,
  Icon,
  TextIcon,
  TextImageIcon,
  Toggle,
} from "@/schema";
import { useImageStore } from "@/stores/images";
import {getComponentDisplay} from "@/schema";

const ICON_PX_GAP = 2;
const ICON_PX_SIZE = 6;

const imageStore = useImageStore();
const emit = defineEmits(["changeData"]);
const props = defineProps({
  data: {
    type: Object as () => HuiData,
    required: true,
  },
  backdrop: {
    type: String,
    required: true,
  },
  showBounds: {
    type: Boolean,
    default: false,
  },
});

let data = reactive<HuiData>(props.data);
let canvas = ref<HTMLCanvasElement>();
let ctx = ref<CanvasRenderingContext2D>();
let width = ref(1280);
let height = ref(720);

function callUpdateData() {
  emit("changeData", data);
}

interface Vector4 {
  r: number;
  g: number;
  b: number;
  a: number;
}

function imageToColorMap(src: string): Promise<Vector4[][]> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const image = new Image();
  return new Promise<Vector4[][]>((resolve) => {
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      ctx?.drawImage(image, 0, 0);
      const { data } = ctx!.getImageData(0, 0, canvas.width, canvas.height);

      const imageOut: Vector4[][] = [];
      let cursorX = 0,
        cursorY = 0,
        cursorTotal = 0;

      while (cursorY < image.width) {
        const row: Vector4[] = [];
        while (cursorX < image.width) {
          row.push({
            r: data[cursorTotal],
            g: data[cursorTotal + 1],
            b: data[cursorTotal + 2],
            a: data[cursorTotal + 3],
          });

          cursorTotal += 4;
          cursorX++;
        }

        imageOut.push(row);
        cursorX = 0;
        cursorY++;
      }

      resolve(imageOut);
    };
    image.src = src;
  });
}

function drawBackdrop(): Promise<void> {
  const img = new Image();
  return new Promise<void>((resolve) => {
    img.onload = () => {
      if (canvas.value && ctx.value) {
        ctx.value.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          0,
          0,
          canvas.value.width,
          canvas.value.height
        );
      }

      resolve();
    };
    img.src = props.backdrop;
  });
}

async function drawIcon(icon: Icon, offsetX: number, offsetY: number) {
  if (canvas.value && ctx.value) {
    switch (icon.type) {
      case "text": {
        const textIcon = icon as TextIcon;

        ctx.value.font = "48px sans-serif";
        ctx.value.textBaseline = "top";
        ctx.value?.fillText(textIcon.text, offsetX, offsetY);
        break;
      }
      case "textImage": {
        const textImageIcon = icon as TextImageIcon;
        const imageDef = imageStore.imageByPath(textImageIcon.path);
        if (imageDef) {
          const imageData = await imageToColorMap(imageDef.content);
          const dimX = imageData[0].length;
          const dimY = imageData.length;
          const boundX = dimX * ICON_PX_SIZE + (dimX - 1) * ICON_PX_GAP;
          const boundY = dimY * ICON_PX_SIZE + (dimY - 1) * ICON_PX_GAP;

          let cursorY = offsetY;
          for (const row of imageData) {
            let cursorX = offsetX;
            for (const pixel of row) {
              ctx.value.fillStyle = `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a})`;
              ctx.value?.fillRect(cursorX, cursorY, ICON_PX_SIZE, ICON_PX_SIZE);
              cursorX += ICON_PX_SIZE + ICON_PX_GAP;
            }

            cursorY += ICON_PX_SIZE + ICON_PX_GAP;
          }

          if (props.showBounds) {
            ctx.value.strokeStyle = "#ff0000";
            ctx.value.lineWidth = 1;
            ctx.value?.strokeRect(offsetX, offsetY, boundX, boundY);
          }
        }
        break;
      }
    }
  }
}

async function redraw() {
  if (canvas.value && ctx.value) {
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    await drawBackdrop();

    const startOffsetX = data.offset[0];
    const startOffsetY = data.offset[1];

    for (const component of data.components) {
      const componentOffsetX = startOffsetX + component.offset[0];
      const componentOffsetY = startOffsetY + component.offset[1];

      switch (component.data.type) {
        case "decoration": {
          const decoData = component.data as Deco;
          await drawIcon(decoData.icon, componentOffsetX, componentOffsetY);
          if (props.showBounds) {
            ctx.value.fillStyle = "#ff0000";
            ctx.value.font = "12px sans-serif";
            ctx.value.textBaseline = "bottom";
            ctx.value?.fillText(
              getComponentDisplay(component),
              componentOffsetX,
              componentOffsetY
            );
          }
          break;
        }
        case "button": {
          const buttonData = component.data as Button;
          // todo: draw logic
          break;
        }
        case "toggle": {
          const toggleData = component.data as Toggle;
          // todo: draw logic
          break;
        }
      }
    }
  }
}

onMounted(() => {
  if (canvas.value) {
    canvas.value.style.width = `${canvas.value?.width}px`;
    canvas.value.style.height = `${canvas.value?.height}px`;
    // This is stupid. Why does it possibly return null? Don't answer that, it
    // was rhetorical; The reason is that if the context identifier ('2d' in
    // this case) isn't recognized, the fucking DOM returns null. JUST THROW AN
    // ERROR!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ctx.value = canvas.value.getContext("2d")!;
    redraw();
  }
});

onUpdated(() => {
  redraw();
});

watch(
  () => data,
  () => {
    redraw();
  },
  { deep: true }
);
</script>

<template>
  <canvas ref="canvas" :width="width" :height="height" />
</template>

<style scoped lang="scss">
canvas {
  width: 1280px;
  height: 720px;
}
</style>

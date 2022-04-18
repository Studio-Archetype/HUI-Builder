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
});

let data = reactive<HuiData>(props.data);
let canvas = ref<HTMLCanvasElement>();
let ctx = ref<CanvasRenderingContext2D>();
const width = ref(1280);
const height = ref(720);

function callUpdateData() {
  emit("changeData", data);
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

function drawIcon(icon: Icon, offsetX: number, offsetY: number) {
  console.log(offsetX, offsetY);
  if (canvas.value && ctx.value) {
    console.log("painting icon");
    switch (icon.type) {
      case "text": {
        const textIcon = icon as TextIcon;

        ctx.value.fillStyle = "#ff0000";
        ctx.value.font = "48px sans-serif";
        ctx.value.textBaseline = "top";
        ctx.value?.fillText(textIcon.text, offsetX, offsetY);
        console.log(ctx);
        break;
      }
      case "textImage": {
        const textImageIcon = icon as TextImageIcon;
        const imageDef = imageStore.imageByPath(textImageIcon.path);
        // todo: draw logic
        break;
      }
    }
  }
}

async function redraw() {
  if (canvas.value && ctx.value) {
    console.log(canvas.value.width, canvas.value.height);
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    await drawBackdrop();

    const startOffsetX = data.offset[0];
    const startOffsetY = data.offset[1];

    for (const component of data.components) {
      console.log("component", component);
      const componentOffsetX = startOffsetX + component.offset[0];
      const componentOffsetY = startOffsetY + component.offset[1];

      switch (component.data.type) {
        case "decoration": {
          console.log("decoration");
          const decoData = component.data as Deco;
          drawIcon(decoData.icon, componentOffsetX, componentOffsetY);
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

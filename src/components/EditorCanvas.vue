<script setup lang="ts">
import { onMounted, onUpdated, reactive, ref, watch } from "vue";
import type {
  Button,
  Component,
  Deco,
  HuiData,
  Icon,
  TextIcon,
  TextImageIcon,
  Toggle,
} from "@/schema";
import { useImageStore } from "@/stores/images";
import type { ImageDef } from "@/stores/images";
import { getComponentDisplay } from "@/schema";
import { useProjectStore } from "@/stores/project";

const ICON_PX_GAP = 2;
const ICON_PX_SIZE = 6;
const ICON_FONT_SIZE = 36;
const ICON_FONT = `${ICON_FONT_SIZE}px sans-serif`;

const imageStore = useImageStore();
const projectStore = useProjectStore();
const emit = defineEmits(["componentSelected"]);
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
  activeComponentId: String,
});

let data = reactive<HuiData>(props.data);
let canvas = ref<HTMLCanvasElement>();
let ctx = ref<CanvasRenderingContext2D>();
let width = ref(1280);
let height = ref(720);
let selectedComponentId = ref<string>("");

interface ComponentPlacement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
let placements = ref<ComponentPlacement[]>([]);

interface Dimension {
  width: number;
  height: number;
}

const imageCache = new Map<string, HTMLImageElement>();

async function getImage(imageDef: ImageDef): Promise<HTMLImageElement> {
  if (imageCache.has(imageDef.path))
    return Promise.resolve(imageCache.get(imageDef.path)!);
  else {
    return new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.onload = () => {
        imageCache.set(imageDef.path, img);
        resolve(img);
      };
      img.src = imageDef.content;
    });
  }
}

async function calculateIconSize(icon: Icon): Promise<Dimension> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  switch (icon.type) {
    case "text": {
      ctx.font = ICON_FONT;
      return {
        width: ctx.measureText((icon as TextIcon).text).width,
        height: ICON_FONT_SIZE,
      };
    }
    case "textImage": {
      const textImageIcon = icon as TextImageIcon;
      const imageDef = imageStore.imageByPath(textImageIcon.path);
      if (imageDef) {
        const imageData = imageToColorMap(await getImage(imageDef));
        const dimX = imageData[0].length;
        const dimY = imageData.length;
        const boundX = dimX * ICON_PX_SIZE + (dimX - 1) * ICON_PX_GAP;
        const boundY = dimY * ICON_PX_SIZE + (dimY - 1) * ICON_PX_GAP;
        return { width: boundX, height: boundY };
      } else return { width: 0, height: 0 };
    }
  }
}

interface Vector4 {
  r: number;
  g: number;
  b: number;
  a: number;
}

function imageToColorMap(image: HTMLImageElement): Vector4[][] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
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
  return imageOut;
}

function fillImage(img: HTMLImageElement) {
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
}

let img: HTMLImageElement;

function drawBackdrop(): Promise<void> {
  if (!img) {
    img = new Image();
    return new Promise<void>((resolve) => {
      img.onload = () => {
        fillImage(img);
        resolve();
      };
      img.src = props.backdrop;
    });
  } else
    return new Promise<void>((resolve) => {
      fillImage(img);
      resolve();
    });
}

async function drawIcon(icon: Icon, offsetX: number, offsetY: number) {
  const bounds = await calculateIconSize(icon);
  if (canvas.value && ctx.value) {
    switch (icon.type) {
      case "text": {
        const textIcon = icon as TextIcon;

        ctx.value.font = ICON_FONT;
        ctx.value.textBaseline = "top";
        ctx.value.fillStyle = "#000000";
        ctx.value?.fillText(textIcon.text, offsetX, offsetY);
        break;
      }
      case "textImage": {
        const textImageIcon = icon as TextImageIcon;
        const imageDef = imageStore.imageByPath(textImageIcon.path);
        if (imageDef) {
          const imageData = imageToColorMap(await getImage(imageDef));

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

    for (const component of data.components.sort(
      (a: Component, b: Component) => a.offset[2] - b.offset[2]
    )) {
      const componentOffsetX = startOffsetX + component.offset[0];
      const componentOffsetY = startOffsetY + component.offset[1];

      switch (component.data.type) {
        case "decoration": {
          const decoData = component.data as Deco;
          await drawIcon(decoData.icon, componentOffsetX, componentOffsetY);
          const iconBounds = await calculateIconSize(decoData.icon);
          placements.value.push({
            id: component.id,
            x: componentOffsetX,
            y: componentOffsetY,
            width: iconBounds.width,
            height: iconBounds.height,
          });

          let boundColor: string;

          if (
            props.activeComponentId &&
            props.activeComponentId === component.id
          ) {
            boundColor = "#efefef";
          } else boundColor = "#ff0000";

          if (
            (props.activeComponentId &&
              props.activeComponentId === component.id) ||
            props.showBounds
          ) {
            ctx.value.strokeStyle = boundColor;
            ctx.value.lineWidth = 1;
            ctx.value?.strokeRect(
              componentOffsetX,
              componentOffsetY,
              iconBounds.width,
              iconBounds.height
            );

            ctx.value.fillStyle = boundColor;
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

function testPlacementHit(x: number, y: number, placement: ComponentPlacement) {
  return (
    x >= placement.x &&
    x <= placement.x + placement.width &&
    y >= placement.y &&
    y <= placement.y + placement.height
  );
}

interface CanvasValues {
  offsetX: number;
  offsetY: number;
  scrollX: number;
  scrollY: number;
}

function getCanvasValues(): CanvasValues {
  if (canvas.value)
    return {
      offsetX: canvas.value.offsetLeft,
      offsetY: canvas.value.offsetTop,
      scrollX: canvas.value.scrollLeft,
      scrollY: canvas.value.scrollTop,
    };
  else
    return {
      offsetX: 0,
      offsetY: 0,
      scrollX: 0,
      scrollY: 0,
    };
}
let startX = ref(0);
let startY = ref(0);

function handleMouseDown(e: MouseEvent) {
  const { offsetX, offsetY } = getCanvasValues();
  e.preventDefault();
  startX.value = parseInt(`${e.clientX - offsetX}`);
  startY.value = parseInt(`${e.clientY - offsetY}`);

  for (const placement of placements.value) {
    if (testPlacementHit(startX.value, startY.value, placement)) {
      selectedComponentId.value = placement.id;
      emit("componentSelected", selectedComponentId.value);
    }
  }
}

function handleMouseUp(e: MouseEvent) {
  e.preventDefault();
  selectedComponentId.value = "";
}

function handleMouseOut(e: MouseEvent) {
  e.preventDefault();
  selectedComponentId.value = "";
}

function handleMouseMove(e: MouseEvent) {
  if (selectedComponentId.value === "") return;
  e.preventDefault();
  const { offsetX, offsetY } = getCanvasValues();
  const mouseX = parseInt(`${e.clientX - offsetX}`);
  const mouseY = parseInt(`${e.clientY - offsetY}`);

  // Put your mousemove stuff here
  const dx = mouseX - startX.value;
  const dy = mouseY - startY.value;
  startX.value = mouseX;
  startY.value = mouseY;

  // holy shit there has to be a better way
  const dataCopy = data;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  dataCopy.components.find(
    (it: Component) => it.id === selectedComponentId.value
  )!.offset[0] += dx;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  dataCopy.components.find(
    (it: Component) => it.id === selectedComponentId.value
  )!.offset[1] += dy;
  projectStore.setProject(dataCopy);
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
  <canvas
    ref="canvas"
    :width="width"
    :height="height"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseout="handleMouseOut"
    @mousemove="handleMouseMove"
  />
</template>

<style scoped lang="scss">
canvas {
  width: 1280px;
  height: 720px;
}
</style>

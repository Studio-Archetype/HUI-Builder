<script setup lang="ts">
import { computed, onMounted, onUpdated, reactive, ref, watch } from 'vue';
import type {
  AnimatedTextImageIcon,
  Button,
  Component,
  Deco,
  HuiData,
  Icon,
  TextIcon,
  TextImageIcon,
  Toggle,
} from '@/schema';
import { getComponentDisplay } from '@/schema';
import type { ImageDef } from '@/stores/images';
import { useImageStore } from '@/stores/images';
import { useItemImageCacheStore } from '@/stores/itemImageCache';
import { useProjectStore } from '@/stores/project';
import type { Dimension } from '@/lib/image';
import { getImage, imageToColorMap } from '@/lib/image';
import { computedAsync } from '@vueuse/core';

const fixedWidth = 1280;
const fixedHeight = 720;
const ICON_PX_GAP = 1;
const ICON_PX_SIZE = 6;
const ICON_FONT_SIZE = 36;
// const ICON_FONT_SHIFT = -62;
// const ICON_FONT = `${ICON_FONT_SIZE}px Minecraftia`;
const ICON_FONT_SHIFT = 0;
const ICON_FONT = `${ICON_FONT_SIZE}px sans-serif`;
const ITEM_SIZE = ICON_PX_SIZE * 16 + ICON_PX_GAP * 15;

const imageStore = useImageStore();
const itemImageCache = useItemImageCacheStore();
const projectStore = useProjectStore();
const emit = defineEmits(['componentSelected', 'deselect']);
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

const data = reactive<HuiData>(projectStore.project);
const canvas = ref<OffscreenCanvas>(
  new OffscreenCanvas(fixedWidth, fixedHeight)
);
const displayCanvas = ref<HTMLCanvasElement>();
const ctx = ref<OffscreenCanvasRenderingContext2D>();
const displayCtx = ref<CanvasRenderingContext2D>();
const selectedComponentId = ref<string>('');
const mousePlacement = ref<{ x: number; y: number; clicking: boolean } | null>(
  null
);

interface ComponentPlacement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

async function convertPlacements(): Promise<ComponentPlacement[]> {
  return await Promise.all(
    projectStore.project.components.map(async (it: Component) => {
      switch (it.data.type) {
        case 'decoration': {
          const size = await calculateIconSize((it.data as Deco).icon);
          return {
            id: it.id,
            x: it.offset[0],
            y:
              (it.data as Deco).icon.type === 'text'
                ? it.offset[1] + ICON_FONT_SHIFT
                : it.offset[1],
            width: Math.round(size.width),
            height: Math.round(size.height),
          };
        }
        case 'button': {
          const size = await calculateIconSize((it.data as Button).icon);
          return {
            id: it.id,
            x: it.offset[0],
            y:
              (it.data as Button).icon.type === 'text'
                ? it.offset[1] + ICON_FONT_SHIFT
                : it.offset[1],
            width: Math.round(size.width),
            height: Math.round(size.height),
          };
        }
        case 'toggle': {
          const size = await calculateIconSize((it.data as Toggle).trueIcon);
          return {
            id: it.id,
            x: it.offset[0],
            y:
              (it.data as Toggle).trueIcon.type === 'text'
                ? it.offset[1] + ICON_FONT_SHIFT
                : it.offset[1],
            width: Math.round(size.width),
            height: Math.round(size.height),
          };
        }
        default:
          return {
            id: '',
            x: 0,
            y: 0,
            width: 0,
            height: 0,
          };
      }
    })
  );
}

const placements = computedAsync<ComponentPlacement[]>(
  async () => await convertPlacements()
);

watch(
  () => data,
  async () => {
    placements.value = await convertPlacements();
  },
  { deep: true }
);

async function calculateImageSize(imageDef: ImageDef): Promise<Dimension> {
  const imageData = imageToColorMap(await getImage(imageDef));
  const dimX = imageData[0].length;
  const dimY = imageData.length;
  const boundX = dimX * ICON_PX_SIZE + (dimX - 1) * ICON_PX_GAP;
  const boundY = dimY * ICON_PX_SIZE + (dimY - 1) * ICON_PX_GAP;
  return { width: boundX, height: boundY };
}

async function calculateIconSize(icon: Icon): Promise<Dimension> {
  const canvas = document.createElement('canvas');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ctx = canvas.getContext('2d')!;

  switch (icon.type) {
    case 'text': {
      ctx.font = ICON_FONT;
      const metrics = ctx.measureText(icon.text);
      return {
        width: metrics.width,
        height:
          metrics.actualBoundingBoxAscent +
          metrics.actualBoundingBoxDescent +
          2,
      };
    }
    case 'textImage': {
      const imageDef = imageStore.imageByPath(icon.path);
      if (imageDef) return calculateImageSize(imageDef);
      else return { width: 0, height: 0 };
    }
    case 'animatedTextImage': {
      const animatedTextImageIcon = icon as AnimatedTextImageIcon;
      const imageDef = imageStore.imageByPath(
        Array.isArray(animatedTextImageIcon.path)
          ? animatedTextImageIcon.path[0]
          : animatedTextImageIcon.path
      );
      if (imageDef) return calculateImageSize(imageDef);
      else return { width: 0, height: 0 };
    }
    case 'item': {
      return {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
      };
    }
  }
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

async function drawImage(imageDef: ImageDef, offsetX: number, offsetY: number) {
  if (ctx.value) {
    const imageData = imageToColorMap(await getImage(imageDef));

    let cursorY = offsetY;
    for (const row of imageData) {
      if (cursorY > canvas.value.height) break;

      let cursorX = offsetX;
      if (!(cursorY + ICON_PX_SIZE < 0))
        for (const pixel of row) {
          if (cursorX > canvas.value.width) break;
          if (!(cursorX + ICON_PX_SIZE < 0)) {
            ctx.value.fillStyle = `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a})`;
            ctx.value?.fillRect(cursorX, cursorY, ICON_PX_SIZE, ICON_PX_SIZE);
          }

          cursorX += ICON_PX_SIZE + ICON_PX_GAP;
        }

      cursorY += ICON_PX_SIZE + ICON_PX_GAP;
    }
  }
}

async function drawIcon(icon: Icon, offsetX: number, offsetY: number) {
  if (canvas.value && ctx.value) {
    switch (icon.type) {
      case 'text': {
        ctx.value.font = ICON_FONT;
        ctx.value.textBaseline = 'top';
        ctx.value.fillStyle = '#ffffff';
        ctx.value?.fillText(icon.text, offsetX, offsetY);
        break;
      }
      case 'textImage': {
        const imageDef = imageStore.imageByPath(icon.path);
        if (imageDef) await drawImage(imageDef, offsetX, offsetY);
        break;
      }
      case 'animatedTextImage': {
        const imageDef = imageStore.imageByPath(
          Array.isArray(icon.path) ? icon.path[0] : icon.path
        );
        if (imageDef) await drawImage(imageDef, offsetX, offsetY);
        break;
      }
      case 'item': {
        const imageDef = await itemImageCache.getItemImage(icon.item);
        const img = new Image();
        img.onload = () => {
          ctx.value?.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            offsetX,
            offsetY,
            ITEM_SIZE,
            ITEM_SIZE
          );
        };
        img.src = imageDef.content;
        break;
      }
    }
  }
}

async function drawIconBounds(
  icon: Icon,
  component: Component,
  componentOffsetX: number,
  componentOffsetY: number
) {
  if (ctx.value) {
    const iconBounds = await calculateIconSize(icon);

    let boundColor = '#efefef';
    let doBox = false;

    if (props.showBounds) {
      boundColor = 'red';
      doBox = true;
    }

    if (props.activeComponentId && props.activeComponentId === component.id)
      doBox = true;

    if (icon.type === 'textImage') {
      const imgDef = imageStore.imageByPath((icon as TextImageIcon).path);
      if (imgDef) {
        const image = await getImage(imgDef);
        const imageData = imageToColorMap(image);

        if (imageData.length > 16 || imageData[0].length > 16) {
          doBox = true;
          boundColor = '#dc2626';
        }
      }
    }

    if (doBox) {
      ctx.value.strokeStyle = boundColor;
      ctx.value.lineWidth = 1;
      ctx.value?.strokeRect(
        componentOffsetX,
        icon.type === 'text'
          ? componentOffsetY + ICON_FONT_SHIFT
          : componentOffsetY,
        iconBounds.width,
        iconBounds.height
      );

      ctx.value.fillStyle = boundColor;
      ctx.value.font = '12px sans-serif';
      ctx.value.textBaseline = 'bottom';
      ctx.value?.fillText(
        getComponentDisplay(component),
        componentOffsetX,
        icon.type === 'text'
          ? componentOffsetY + ICON_FONT_SHIFT
          : componentOffsetY
      );
    }
  }
}

async function redraw() {
  if (canvas.value && ctx.value) {
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    await drawBackdrop();

    const startOffsetX = data.offset[0];
    const startOffsetY = data.offset[1];

    if (props.showBounds) {
      // console.log(mousePlacement.value);
      if (mousePlacement.value !== null) {
        ctx.value.beginPath();
        ctx.value.arc(
          mousePlacement.value.x,
          mousePlacement.value.y,
          3,
          0,
          2 * Math.PI,
          false
        );
        ctx.value.fillStyle = mousePlacement.value.clicking
          ? 'green'
          : 'yellow';
        ctx.value.fill();
      }

      placements.value?.forEach((placement: ComponentPlacement) => {
        if (canvas.value && ctx.value) {
          ctx.value.strokeStyle = '#0000ff';
          ctx.value?.strokeRect(
            placement.x,
            placement.y,
            placement.width,
            placement.height
          );
        }
      });
    }

    for (const component of data.components.sort(
      (a: Component, b: Component) => a.offset[2] - b.offset[2]
    )) {
      const componentOffsetX = startOffsetX + component.offset[0];
      const componentOffsetY = startOffsetY + component.offset[1];

      switch (component.data.type) {
        case 'decoration': {
          const decoData = component.data as Deco;
          await drawIcon(decoData.icon, componentOffsetX, componentOffsetY);
          await drawIconBounds(
            decoData.icon,
            component,
            componentOffsetX,
            componentOffsetY
          );
          break;
        }
        case 'button': {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const buttonData = component.data as Button;
          await drawIcon(buttonData.icon, componentOffsetX, componentOffsetY);
          await drawIconBounds(
            buttonData.icon,
            component,
            componentOffsetX,
            componentOffsetY
          );
          break;
        }
        case 'toggle': {
          const toggleData = component.data as Toggle;
          await drawIcon(
            toggleData.trueIcon,
            componentOffsetX,
            componentOffsetY
          );
          await drawIconBounds(
            toggleData.trueIcon,
            component,
            componentOffsetX,
            componentOffsetY
          );
          break;
        }
      }
    }

    if (displayCanvas.value && displayCtx.value) {
      displayCtx.value?.drawImage(
        canvas.value,
        0,
        0,
        canvas.value?.width,
        canvas.value?.height,
        0,
        0,
        displayCanvas.value?.width,
        displayCanvas.value?.height
      );
    }
  }
}

function testPlacementHit(x: number, y: number, placement: ComponentPlacement) {
  return (
    x > placement.x &&
    x < placement.x + placement.width &&
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
  if (displayCanvas.value) {
    const rect = displayCanvas.value.getBoundingClientRect();
    return {
      offsetX: rect.left,
      offsetY: rect.top,
      scrollX: displayCanvas.value.scrollLeft,
      scrollY: displayCanvas.value.scrollTop,
    };
  } else
    return {
      offsetX: 0,
      offsetY: 0,
      scrollX: 0,
      scrollY: 0,
    };
}
const startX = ref(0);
const startY = ref(0);

interface Vector2 {
  x: number;
  y: number;
}

function convertCoordinateViaNormalization(
  x: number,
  y: number,
  originWidth: number,
  originHeight: number
): Vector2 {
  const normalizedStartX = x / originWidth;
  const normalizedStartY = y / originHeight;
  // console.log('normalized', normalizedStartX, normalizedStartY);

  const fixedStartX = normalizedStartX * (canvas.value?.width ?? 0);
  const fixedStartY = normalizedStartY * (canvas.value?.height ?? 0);
  // console.log('fixed', fixedStartX, fixedStartY);

  return {
    x: fixedStartX,
    y: fixedStartY,
  };
}

function handleMouseDown(e: MouseEvent) {
  const { offsetX, offsetY } = getCanvasValues();
  e.preventDefault();
  const displayCanvasStartX = parseInt(`${e.clientX - offsetX}`);
  const displayCanvasStartY = parseInt(`${e.clientY - offsetY}`);

  const resVector = convertCoordinateViaNormalization(
    displayCanvasStartX,
    displayCanvasStartY,
    (e.target as HTMLCanvasElement).width,
    (e.target as HTMLCanvasElement).height
  );

  startX.value = resVector.x;
  startY.value = resVector.y;

  if (mousePlacement.value !== null)
    mousePlacement.value = {
      ...mousePlacement.value,
      clicking: true,
    };

  // console.log(placements.value);
  placements.value?.forEach((placement: ComponentPlacement) => {
    // console.log(startX.value, startY.value, placement);
    if (testPlacementHit(startX.value, startY.value, placement)) {
      selectedComponentId.value = placement.id;
      emit('componentSelected', selectedComponentId.value);
    }
  });
  redraw();
}

function handleMouseUp(e: MouseEvent) {
  e.preventDefault();
  selectedComponentId.value = '';

  if (mousePlacement.value !== null)
    mousePlacement.value = {
      ...mousePlacement.value,
      clicking: false,
    };
  redraw();
}

function handleMouseOut(e: MouseEvent) {
  e.preventDefault();
  selectedComponentId.value = '';
  mousePlacement.value = null;
  redraw();
}

function handleMouseMove(e: MouseEvent) {
  if (selectedComponentId.value === '') return;
  e.preventDefault();
  const { offsetX, offsetY } = getCanvasValues();
  const displayCanvasMouseX = parseInt(`${e.clientX - offsetX}`);
  const displayCanvasMouseY = parseInt(`${e.clientY - offsetY}`);

  const resVector = convertCoordinateViaNormalization(
    displayCanvasMouseX,
    displayCanvasMouseY,
    (e.target as HTMLCanvasElement).width,
    (e.target as HTMLCanvasElement).height
  );

  mousePlacement.value = {
    x: resVector.x,
    y: resVector.y,
    clicking:
      mousePlacement.value === null ? false : mousePlacement.value.clicking,
  };

  const dx = resVector.x - startX.value;
  const dy = resVector.y - startY.value;
  startX.value = resVector.x;
  startY.value = resVector.y;

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
  redraw();
}

function resizeDisplayCanvas() {
  if (displayCanvas.value) {
    displayCanvas.value.width = displayCanvas.value?.offsetWidth;
    displayCanvas.value.height = displayCanvas.value?.offsetHeight;
    redraw();
  }
}

onMounted(() => {
  window.addEventListener('resize', () => {
    resizeDisplayCanvas();
  });

  if (canvas.value) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ctx.value = canvas.value.getContext('2d')!;
    redraw();
  }

  if (displayCanvas.value) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    displayCtx.value = displayCanvas.value.getContext('2d')!;
  }

  resizeDisplayCanvas();
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
    class="display"
    ref="displayCanvas"
    @resize="resizeDisplayCanvas()"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseout="handleMouseOut"
    @mousemove="handleMouseMove"
  />
</template>

<style scoped lang="scss">
canvas.display {
  height: 100%;
  aspect-ratio: 16 / 9;
}

canvas.contain {
  width: 1280px;
  height: 720px;
  visibility: hidden;
  //opacity: 0.5;
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
}
</style>

import type { HuiData } from '@/schema';

function convertRange(
  oldValue: number,
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number
): number {
  return ((oldValue - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
}

export function toMappedMinecraft(
  xInput: number,
  yInput: number
): { x: number; y: number } {
  const newXValue = convertRange(xInput, 0, 1280, 7, -7);
  const newYValue = convertRange(yInput, 0, 720, 5, -5);

  return {
    x: newXValue,
    y: newYValue,
  };
}

export function fromMappedMinecraft(
  xInput: number,
  yInput: number
): { x: number; y: number } {
  const newXValue = convertRange(xInput, 7, -7, 0, 1280);
  const newYValue = convertRange(yInput, 5, -5, 0, 720);

  return {
    x: newXValue,
    y: newYValue,
  };
}

export function projectFromMappedMinecraft(data: HuiData): HuiData {
  const copyData = data;
  copyData.components = data.components.map((component) => {
    const copyComponent = component;
    copyComponent.offset[0] = fromMappedMinecraft(component.offset[0], 0).x;
    copyComponent.offset[1] = fromMappedMinecraft(0, component.offset[1]).y;
    return copyComponent;
  });
  copyData.offset[0] = fromMappedMinecraft(data.offset[0], 0).x;
  copyData.offset[1] = fromMappedMinecraft(0, data.offset[1]).y;
  return copyData;
}

export function projectToMappedMinecraft(data: HuiData): HuiData {
  const copyData = data;
  copyData.components = data.components.map((component) => {
    const copyComponent = component;
    copyComponent.offset[0] = toMappedMinecraft(component.offset[0], 0).x;
    copyComponent.offset[1] = toMappedMinecraft(0, component.offset[1]).y;
    return copyComponent;
  });
  copyData.offset[0] = toMappedMinecraft(data.offset[0], 0).x;
  copyData.offset[1] = toMappedMinecraft(0, data.offset[1]).y;
  return copyData;
}

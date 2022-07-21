import type { JSONSchemaType } from 'ajv';

export type Vector3 = [number, number, number];

export interface _ComponentData {
  type: 'button' | 'decoration' | 'toggle';
}

export interface Button extends _ComponentData {
  type: 'button';
  actions: Action[];
  highlightModifier: number;
  icon: Icon;
}

export interface Deco extends _ComponentData {
  type: 'decoration';
  icon: Icon;
}

export interface Toggle extends _ComponentData {
  type: 'toggle';
  highlightModifier: number;
  condition: string;
  expectedValue: string;
  trueActions: Action[];
  falseActions: Action[];
  trueIcon: Icon;
  falseIcon: Icon;
}

export type ComponentData = Deco | Button | Toggle;

export type IconType = 'text' | 'textImage' | 'animatedTextImage' | 'item';

export interface _Icon {
  type: IconType;
}

export interface TextImageIcon extends _Icon {
  type: 'textImage';
  path: string;
}

export interface AnimatedTextImageIcon extends _Icon {
  type: 'animatedTextImage'
  path: string | string[];
}

export interface ItemIcon extends _Icon {
  type: 'item';
  item: string;
  count: number;
  customModelData: number;
}

export interface TextIcon extends _Icon {
  type: 'text';
  text: string;
}

export type Icon = TextImageIcon | TextIcon | AnimatedTextImageIcon | ItemIcon;

export type ActionType = 'command' | 'sound';

export interface _Action {
  type: ActionType;
}

export interface CommandAction extends _Action {
  type: 'command';
  command: string;
  source: 'server' | 'player';
}
export interface SoundAction extends _Action {
  type: 'sound';
  sound: string;
  source:
    | 'master'
    | 'music'
    | 'record'
    | 'weather'
    | 'block'
    | 'hostile'
    | 'neutral'
    | 'player'
    | 'ambient'
    | 'voice';
  volume: number;
  pitch: number;
}

export type Action = CommandAction | SoundAction;

export interface Component {
  id: string;
  offset: Vector3;
  data: ComponentData;
}

export interface HuiData {
  offset: Vector3;
  components: Component[];
  lockPosition: boolean;
}

export async function downloadSchema(
  url = 'https://cdn.studioarchetype.net/holoui.schema.json'
): Promise<JSONSchemaType<HuiData>> {
  const resp = await fetch(url);
  return await resp.json();
}

export function getIconDisplayDetail(icon: Icon): string {
  let ret: string;
  switch (icon.type) {
    case 'text':
      ret = 'Text';
      break;
    case 'textImage':
      ret = 'Image';
      break;
    case 'animatedTextImage':
      ret = 'Animated';
      break;
    case 'item':
      ret = 'Item';
      break;
  }
  return ret;
}

export function getComponentDisplay(
  component: Component,
  detail = false
): string {
  let detailText = component.id;
  let name: string;

  switch (component.data.type) {
    case 'decoration': {
      switch ((component.data as Deco).icon.type) {
        case 'text':
          detailText = `(${((component.data as Deco).icon as TextIcon).text})`;
          name = 'Text';
          break;
        case 'textImage':
          name = 'Image';
          break;
        case 'animatedTextImage':
          name = 'Animation';
          break;
        case 'item':
          detailText = `(${((component.data as Deco).icon as ItemIcon).item})`;
          name = 'Item';
          break;
        default:
          name = 'Decoration';
      }

      break;
    }
    case 'button': {
      name = 'Button';
      const button = component.data as Button;
      detailText = `(${getIconDisplayDetail(button.icon)})`;
      break;
    }
    case 'toggle': {
      name = 'Toggle';
      const toggle = component.data as Toggle;
      const trueHalf = getIconDisplayDetail(toggle.trueIcon);
      const falseHalf = getIconDisplayDetail(toggle.falseIcon);

      if (toggle.trueIcon.type === toggle.falseIcon.type)
        detailText = `(${trueHalf})`;
      else detailText = `(${trueHalf} / ${falseHalf})`;
      break;
    }
    default:
      name = 'Unknown Component';
  }

  return `${name}${detail ? ` ${detailText}` : ''}`;
}
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
  type: 'animatedTextImage';
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

export type SoundSource =
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

export interface SoundAction extends _Action {
  type: 'sound';
  sound: string;
  source: SoundSource;
  volume: number;
  pitch: number;
}

export const soundSources: SoundSource[] = [
  'master',
  'music',
  'record',
  'weather',
  'block',
  'hostile',
  'neutral',
  'player',
  'ambient',
  'voice',
];

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

export function getIconDisplayName(icon: Icon): string {
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

export function getIconDetailText(icon: Icon): string {
  let ret: string;
  switch (icon.type) {
    case 'text':
      ret = `(${(icon as TextIcon).text})`;
      break;
    case 'textImage':
      ret = `(${(icon as TextImageIcon).path})`;
      break;
    case 'animatedTextImage': {
      const anim = icon as AnimatedTextImageIcon;
      if (Array.isArray(anim.path)) ret = `(${anim.path[0]})`;
      else ret = `(${anim.path})`;
      break;
    }
    case 'item':
      ret = `(${(icon as ItemIcon).item})`;
      break;
  }
  return ret;
}

export function getIconDisplay(icon: Icon, detail = false): string {
  return `${getIconDisplayName(icon)}${
    detail ? ` ${getIconDetailText(icon)}` : ''
  }`;
}

export function getComponentDisplay(
  component: Component,
  detail = false
): string {
  let detailText = component.id;
  let name: string;

  switch (component.data.type) {
    case 'decoration': {
      const deco = component.data as Deco;
      name = getIconDisplayName(deco.icon);
      detailText = getIconDetailText(deco.icon);
      break;
    }
    case 'button': {
      const button = component.data as Button;
      name = 'Button';
      detailText = `(${getIconDisplayName(button.icon)})`;
      break;
    }
    case 'toggle': {
      const toggle = component.data as Toggle;
      name = 'Toggle';

      const trueHalf = getIconDisplayName(toggle.trueIcon);
      const falseHalf = getIconDisplayName(toggle.falseIcon);
      if (toggle.trueIcon.type === toggle.falseIcon.type)
        detailText = `(${trueHalf})`;
      else detailText = `(${trueHalf} / ${falseHalf})`;
      break;
    }
  }

  return `${name}${detail ? ` ${detailText}` : ''}`;
}

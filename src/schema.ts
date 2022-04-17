import type { JSONSchemaType } from "ajv";

export type Vector3 = [number, number, number];

export interface _ComponentData {
  type: "button" | "decoration" | "toggle";
}

export interface Button extends _ComponentData {
  actions: Action[];
  highlightModifier: number;
  icon: Icon;
}

export interface Deco extends _ComponentData {
  icon: Icon;
}

export interface Toggle extends _ComponentData {
  highlightModifier: number;
  condition: string;
  expectedValue: string;
  trueActions: Action[];
  falseActions: Action[];
  trueIcon: Icon;
  falseIcon: Icon;
}

export type ComponentData = Deco | Button | Toggle;

export interface _Icon {
  type: "text" | "textImage";
}

export interface TextImageIcon extends _Icon {
  path: string;
}

export interface TextIcon extends _Icon {
  text: string;
}

export type Icon = TextImageIcon | TextIcon;

export interface _Action {
  type: "command" | "sound";
}

export interface CommandAction extends _Action {
  command: string;
  source: "server" | "player";
}
export interface SoundAction extends _Action {
  sound: string;
  source:
    | "master"
    | "music"
    | "record"
    | "weather"
    | "block"
    | "hostile"
    | "neutral"
    | "player"
    | "ambient"
    | "voice";
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
  url = "https://cdn.studioarchetype.net/holoui.schema.json"
): Promise<JSONSchemaType<HuiData>> {
  const resp = await fetch(url);
  return await resp.json();
}

/* eslint-disable one-var */
declare module "svg-piano" {
  export interface SvgPianoOptions {
    scaleX: number;
    scaleY: number;
    lowerWidth: number;
    palette: [string, string];
    stroke: string;
    strokeWidth: number;
    offsetY: number;
    offsetX: number;
    upperHeight: number;
    lowerHeight: number;
    keyCount: number;
    range: [string, string];
    topLabels: boolean;
    labels: Record<string, string>;
    colorize: { keys: string[]; color: string }[];
    visibleKeys: string[];
  }
  export const _defaultOptions: SvgPianoOptions;
  export const defaultOptions: (options: SvgPianoOptions) => SvgPianoOptions;
  interface Pitches {
    pitches: string[];
    upperOffset: number;
    upperWidth: number;
  }
  export const keyboard: Pitches[];
  export const accidentals: number[];
  export const rangeOptions: (
    range: any[]
  ) => { keyCount: number; keyOffset: number };

  interface KeySize {
    upperHeight: number;
    lowerHeight: number;
    lowerWidth: number;
    fill: string;
    contrast: string;
    stroke: string;
    strokeWidth: number;
  }
  interface RenderKey {
    index: number;
    notes: string;
    scaleX: string;
    scaleY: string;
    fill: string;
    contrast: string;
    strokeWidth: number;
    stroke: string;
    upperHeight: number;
    lowerHeight: number;
    upperWidth: number;
    lowerWidth: number;
    upperOffset: number;
    visible: boolean;
    offsetX: number;
  }
  export const getKeySizes: (options: SvgPianoOptions) => KeySize[];
  export const renderKeys: (options: SvgPianoOptions) => RenderKey[];
  export const renderSVG: (
    options: SvgPianoOptions
  ) => {
    svg: {
      width: number;
      height: number;
    };
    children: {
      key: RenderKey;
      polygon: React.SVGProps<SVGPolygonElement>;
      circle: Circle;
      text: TextCircle;
    }[];
  };
  export const getOctave: (index, range, keyOffset) => number;
  export const totalDimensions: (options: SvgPianoOptions) => number[];
  export const getColorization: (notes, colorize) => string | number;
  export const upperWidth: (key, index, offset, keyCount) => number;
  export const upperOffset: (key, index, keyOffset, keyCount) => number;
  export const getKeyOffset: (index, keys, lowerWidth, keyOffset) => number;
  export const whiteIndex: (index) => number;
  export const getPoints: (key, round) => number[];
  export interface Circle {
    cx: number;
    cy: number;
    r: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
  }
  export interface CircleText {
    x: number;
    y: number;
    textAnchor: string;
    fontSize: radius;
    fontFamily: string;
  }
  export const getTextElements: (
    key,
    top,
    fill
  ) => {
    circle: Circle;
    text: CircleText;
  };
}

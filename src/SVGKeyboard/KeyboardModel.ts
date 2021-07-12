export interface KeyBasics {
  sharp: boolean;
  pitches: [string, string] | [string];
  upperOffset: number;
  upperWidth: number;
}

export interface KeyDetails {
  upperHeight: number;
  lowerHeight: number;
  lowerWidth: number;
  fill: string;
  contrast: string;
  stroke: string;
  strokeWidth: number;
  index: number;
  scaleX: number;
  scaleY: number;
  offsetX: number;
  notes: string[];
}

export type Key = KeyBasics & KeyDetails;

export interface TextOptions {
  top?: boolean;
  fill?: string;
  fontFamily?: string;
}

export interface Polygon {
  points: string;
  style: {
    fill: string;
    stroke: string;
    strokeWidth: number;
  };
}

export interface KeyboardOptions {
  fontFamily: string;
  scaleX: number;
  scaleY: number;
  lowerWidth: number;
  palette: string[];
  stroke: string;
  strokeWidth: number;
  offsetY: number;
  offsetX: number;
  upperOffset: number;
  upperWidth: number;
  upperHeight: number;
  lowerHeight: number;
  keyCount: number;
  keyOffset: number;
  range: string[];
  leftHandKeysColor: string;
  rightHandKeysColor: string;
}

export interface RenderActiveText {
  x: number;
  y: number;
  textAnchor: string;
  fontSize: string;
  fill: string | undefined;
  fontWeight: number;
  fontFamily: string | undefined;
  value: string;
}

export interface RenderActiveKey {
  activeKey: {
    style: {
      fill: string;
      strokeWidth: number;
    };
    points: string;
  };
  text1: RenderActiveText;
  text2: RenderActiveText;
}

// https://de.wikipedia.org/wiki/Datei:Pianoteilung.svg
export const keyboard: KeyBasics[] = [
  {
    sharp: false,
    pitches: ["C", "B#"],
    upperOffset: 0,
    upperWidth: 15.05,
  },
  {
    sharp: true,
    pitches: ["Db", "C#"],
    upperOffset: 0,
    upperWidth: 12.7,
  },
  {
    sharp: false,
    pitches: ["D"],
    upperOffset: 4.15,
    upperWidth: 15.3,
  },
  {
    sharp: true,
    pitches: ["Eb", "D#"],
    upperOffset: 0,
    upperWidth: 12.7,
  },
  {
    sharp: false,
    pitches: ["E"],
    upperOffset: 8.55,
    upperWidth: 15.05,
  },
  {
    sharp: false,
    pitches: ["F", "E#"],
    upperOffset: 0,
    upperWidth: 13.95,
  },
  {
    sharp: true,
    pitches: ["Gb", "F#"],
    upperOffset: 0,
    upperWidth: 12.7,
  },
  {
    sharp: false,
    pitches: ["G"],
    upperOffset: 3.05,
    upperWidth: 14.2,
  },
  {
    sharp: true,
    pitches: ["Ab", "G#"],
    upperOffset: 0,
    upperWidth: 12.7,
  },
  {
    sharp: false,
    pitches: ["A"],
    upperOffset: 6.35,
    upperWidth: 14.2,
  },
  {
    sharp: true,
    pitches: ["Bb", "A#"],
    upperOffset: 0,
    upperWidth: 12.7,
  },
  {
    sharp: false,
    pitches: ["B", "Cb"],
    upperOffset: 9.65,
    upperWidth: 13.95,
  },
];

export const accidentals = [1, 3, 6, 8, 10];

export function whiteIndex(index: number) {
  return (
    Array(index % 12)
      .fill(0)
      .filter((_, i) => !accidentals.includes(i)).length +
    Math.floor(index / 12) * 7
  );
}

export function rangeOptions(range: string[]) {
  const pitches = range.map((note) => note.slice(0, -1));
  const first = keyboard.find((key) => key.pitches.includes(pitches[0]));
  const last = keyboard.find((key) => key.pitches.includes(pitches[1]));
  const offsetLeft = first ? keyboard.indexOf(first) : 0;
  const offsetRight = last ? 12 - keyboard.indexOf(last) : 0;
  const octaves = range.map((note) =>
    parseInt(note.slice(note.length - 1), 10)
  );
  const keyCount =
    (octaves[1] - octaves[0] + 1) * 12 - offsetLeft - offsetRight + 1;
  return { keyCount, keyOffset: offsetLeft };
}

export function getPoints(key: Key, offsetY: number) {
  const {
    upperOffset,
    offsetX,
    upperHeight,
    lowerHeight,
    upperWidth,
    lowerWidth,
  } = key;
  const totalHeight = lowerHeight + upperHeight;
  return [
    [upperOffset + offsetX, offsetY],
    [upperOffset + offsetX, upperHeight + offsetY],
    [offsetX, upperHeight + offsetY],
    [offsetX, totalHeight + offsetY],
    [lowerWidth + offsetX, totalHeight + offsetY],
    [lowerWidth + offsetX, upperHeight + offsetY],
    [upperWidth + upperOffset + offsetX, upperHeight + offsetY],
    [upperWidth + upperOffset + offsetX, offsetY],
  ];
}

export function getKeySizes(options: KeyboardOptions) {
  const {
    lowerHeight,
    upperHeight,
    lowerWidth,
    strokeWidth,
    palette,
    stroke,
  } = options;
  return keyboard.map<Key>((key, index) =>
    Object.assign(key, {
      // add black/white specific props > black keys have no lower part
      upperHeight,
      lowerHeight: accidentals.includes(index) ? 0 : lowerHeight,
      lowerWidth: accidentals.includes(index) ? key.upperWidth : lowerWidth,
      fill: accidentals.includes(index) ? palette[0] : palette[1],
      contrast: accidentals.includes(index) ? palette[1] : palette[0],
      stroke,
      strokeWidth,
    } as KeyDetails)
  );
}

export function getOctave(index: number, range: string[]) {
  const overflow = Math.floor(index / 12);
  const octaves = range.map((note) =>
    parseInt(note.slice(note.length - 1), 10)
  );
  const octave = overflow + octaves[0];
  return octave;
}

export function upperWidth(
  key: Key,
  index: number,
  offset: number,
  keyCount: number
) {
  const isFirst = (index: number) => index === offset;
  const isLast = (index: number) => index === keyCount + offset - 1;
  if (isFirst(index)) {
    return key.upperWidth + key.upperOffset;
  }
  if (isLast(index)) {
    return key.lowerWidth - key.upperOffset;
  }
  return key.upperWidth;
}

export function upperOffset(key: Key, index: number, keyOffset: number) {
  const isFirst = (index: number) => index === keyOffset;
  if (isFirst(index)) {
    return 0;
  }
  return key.upperOffset;
}

export function getKeyOffset(
  index: number,
  keys: Key[],
  lowerWidth: number,
  keyOffset = 0
) {
  const wi = whiteIndex(index);
  const oi = whiteIndex(keyOffset);
  let firstOffset = keys[keyOffset].upperOffset;
  if (accidentals.includes(keyOffset % 12)) {
    const whiteKeyBefore = keyboard[(keyOffset + 12 - 1) % 12];
    firstOffset -=
      lowerWidth - (whiteKeyBefore.upperWidth + whiteKeyBefore.upperOffset);
  }
  return !accidentals.includes(index % 12)
    ? wi * lowerWidth - oi * lowerWidth
    : keys
        .slice(keyOffset, index)
        .reduce((sum, _key, _index) => sum + _key.upperWidth, 0) + firstOffset;
}

export function getTextElements(
  key: Key,
  options: TextOptions = {
    top: false,
    fill: "white",
    fontFamily: "helvetica",
  }
): { text1: RenderActiveText; text2: RenderActiveText } {
  const {
    offsetX,
    upperHeight,
    lowerHeight,
    upperOffset,
    strokeWidth,
    upperWidth,
  } = key;

  const { top, fill, fontFamily } = options;
  const magic = 14.5;
  const radius = (key.scaleX * (magic - strokeWidth * 2)) / 2;
  const w = key.lowerWidth || key.upperWidth;
  const x = top ? offsetX + upperWidth / 2 + upperOffset : offsetX + w / 2;
  const y = top ? radius * 2 : upperHeight + lowerHeight - 4;

  const baseText = {
    textAnchor: "middle",
    fontSize: "10px",
    fill,
    fontWeight: 600,
    fontFamily,
    value: "",
  };

  const text1 = {
    ...baseText,
    x,
    y: y - radius,
  };

  const text2 = {
    ...baseText,
    fontSize: "12px",
    x,
    y,
  };

  return {
    text1,
    text2,
  };
}

export class KeyboardModel {
  private _options: KeyboardOptions = {
    fontFamily: "helvetica",
    scaleX: 1,
    scaleY: 1,
    lowerWidth: 23.6,
    palette: ["#39383D", "#F2F2EF"],
    stroke: "#39383D",
    strokeWidth: 1,
    offsetY: 2,
    offsetX: 0,
    upperOffset: 0,
    upperWidth: 0,
    upperHeight: 100,
    lowerHeight: 45,
    keyCount: 88,
    keyOffset: 0,
    range: ["A0", "C8"],
    leftHandKeysColor: "red",
    rightHandKeysColor: "blue",
  };

  private _keysMap: Record<
    string,
    {
      key: Key;
      polygon: Polygon;
    }
  >;

  private _keys: {
    key: Key;
    polygon: Polygon;
  }[];

  constructor(options?: Partial<KeyboardOptions>) {
    options = options || this._options;
    if (options?.range) {
      options = {
        ...options,
        ...rangeOptions(options.range),
      };
    }
    this._options = { ...this._options, ...options } || this._options;

    this._keysMap = {};
    const keySizes = getKeySizes(this._options);
    const {
      keyCount,
      scaleY,
      scaleX,
      lowerWidth,
      strokeWidth,
      keyOffset,
    } = this._options;
    this._keys = Array(keyCount + keyOffset)
      .fill(0)
      .map((_, index, _keys) => keySizes[index % 12])
      .map<Key>((key, index, _keys) => {
        const octave = getOctave(index, this._options.range);
        const notes = key.pitches.map((pitch) => pitch + octave);
        const renderedKey: Key = {
          pitches: key.pitches,
          index,
          notes,
          scaleX,
          scaleY,
          fill: key.fill,
          contrast: key.contrast,
          strokeWidth: key.strokeWidth,
          stroke: key.stroke,
          sharp: key.sharp,
          upperHeight: key.upperHeight * scaleY,
          lowerHeight: key.lowerHeight * scaleY,
          upperWidth: upperWidth(key, index, keyOffset, keyCount) * scaleX,
          lowerWidth: key.lowerWidth * scaleX,
          upperOffset: upperOffset(key, index, keyOffset) * scaleX,
          offsetX:
            getKeyOffset(index, _keys, lowerWidth, keyOffset) * scaleX +
            Math.ceil(strokeWidth / 2),
        };
        return renderedKey;
      })
      .filter((key) => key.index >= keyOffset)
      .map((key) => {
        const obj = {
          key,
          polygon: {
            points: getPoints(key, this._options.offsetY)
              .map((p) => p.join(","))
              .join(" "),
            style: {
              fill: key.fill,
              stroke: key.stroke,
              strokeWidth: key.strokeWidth,
            },
          },
        };
        this._keysMap[key.notes[0]] = obj;
        this._keysMap[key.notes[1]] = obj;
        return {
          key,
          polygon: {
            points: getPoints(key, this._options.offsetY)
              .map((p) => p.join(","))
              .join(" "),
            style: {
              fill: key.fill,
              stroke: key.stroke,
              strokeWidth: key.strokeWidth,
            },
          },
        };
      });
  }
  getOptions() {
    return this._options;
  }

  getPolygons() {
    return this._keys;
  }

  getLeftHandkeys(keys: Partial<KeyboardOptions>, options: TextOptions = {}) {
    return this._getLabels(keys, options);
  }

  getRightHandKeys(keys: Partial<KeyboardOptions>, options: TextOptions = {}) {
    return this._getLabels(keys, options);
  }

  getSVGDimensions() {
    const {
      scaleX,
      scaleY,
      lowerWidth,
      keyCount,
      lowerHeight,
      upperHeight,
      strokeWidth,
    } = this._options;
    return [
      scaleX * lowerWidth * whiteIndex(keyCount + 1),
      (lowerHeight + upperHeight) * scaleY,
    ].map((c) => Math.round(c + strokeWidth * 2)); // >svg adds stroke around actual widths
  }
  private _getLabels(
    keys: Partial<KeyboardOptions>,
    options: TextOptions = {}
  ): RenderActiveKey[] {
    return Object.keys(keys).map((keyName) => {
      const key = this._keysMap[keyName].key; //?
      let fill = options?.fill;

      if (!fill) {
        if (key.sharp) {
          fill = this._options.palette[1];
        } else {
          fill = this._options.palette[1];
        }
        options.fill = fill;
      }
      const textElements = getTextElements(key, options); //?
      const value = keys[keyName as keyof KeyboardOptions];
      if (value) {
        textElements.text1.value = keyName;
        textElements.text2.value = value as string;
      }
      const polygon = this._keysMap[keyName].polygon;
      return {
        ...textElements,
        activeKey: {
          ...polygon,
          style: { fill: "blue", strokeWidth: 0 },
        },
      };
    });
  }
}

// const k = new KeyboardModel({ range: ["C3", "C6"] });

// const leftHandLabels = { B3: "P1" }; //?
// const rightHandLabels = { "D#4": "M3", "F#4": "P5", "A#4": "M7", "C#5": "M9" }; //?

// console.log(k.getOptions());
// console.log(k.getSVGDimensions());
// console.log(k.getPolygons());
// console.log(k.getLeftHandLabels(leftHandLabels));
// console.log(k.getRightHandLabels(rightHandLabels));
// console.log(k.getLeftHandKeys(leftHandLabels));

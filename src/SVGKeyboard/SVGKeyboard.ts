export interface DefaultOptions {
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
  range: string[];
  topLabels: boolean;
  visibleKeys: string[];
  keyOffset: number;
  colorize: Colorize;
  labels: Record<string, string>;
}

export interface TextElement {
  circle1: TextCircle;
  circle2: TextCircle;
  text1: Text;
  text2: Text;
}

export interface TextCircle {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface Text {
  x: number;
  y: number;
  textAnchor: TextAnchorVariant;
  fontSize: string | number;
  fontFamily: string;
  value: string;
}

export type TextAnchorVariant = "start" | "middle" | "end";

export type Colorize = { keys: string[]; color: string }[];

export type Key = KeyBasics & KeyDetails;

export interface RenderedKey extends Key {
  notes: string[];
}

export interface KeyBasics {
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
  visible: boolean;
  offsetX: number;
  notes: string[];
}

// https://de.wikipedia.org/wiki/Datei:Pianoteilung.svg
export const keyboard: KeyBasics[] = [
  {
    pitches: ["C", "B#"],
    upperOffset: 0,
    upperWidth: 15.05,
  },
  {
    pitches: ["Db", "C#"],
    upperOffset: 0,
    upperWidth: 12.7,
  },
  {
    pitches: ["D"],
    upperOffset: 4.15,
    upperWidth: 15.3,
  },
  {
    pitches: ["Eb", "D#"],
    upperOffset: 0,
    upperWidth: 12.7,
  },
  {
    pitches: ["E"],
    upperOffset: 8.55,
    upperWidth: 15.05,
  },
  {
    pitches: ["F", "E#"],
    upperOffset: 0,
    upperWidth: 13.95,
  },
  {
    pitches: ["Gb", "F#"],
    upperOffset: 0,
    upperWidth: 12.7,
  },
  {
    pitches: ["G"],
    upperOffset: 3.05,
    upperWidth: 14.2,
  },
  {
    pitches: ["Ab", "G#"],
    upperOffset: 0,
    upperWidth: 12.7,
  },
  {
    pitches: ["A"],
    upperOffset: 6.35,
    upperWidth: 14.2,
  },
  {
    pitches: ["Bb", "A#"],
    upperOffset: 0,
    upperWidth: 12.7,
  },
  {
    pitches: ["B", "Cb"],
    upperOffset: 9.65,
    upperWidth: 13.95,
  },
];

export const accidentals = [1, 3, 6, 8, 10];

export const _defaultOptions: DefaultOptions = {
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
  range: ["A0", "C8"],
  topLabels: false,
  keyOffset: 0,
  colorize: [],
  labels: {},
  visibleKeys: [],
};

/** computes keyCount and keyOffset from range array ([SPN,SPN]) */
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

export function defaultOptions(options: Partial<DefaultOptions>) {
  if (options.range) {
    options = {
      ...options,
      ...rangeOptions(options.range),
    };
  }
  return { ..._defaultOptions, ...options };
}

export function getOctave(index: number, range: string[]) {
  const overflow = Math.floor(index / 12);
  const octaves = range.map((note) =>
    parseInt(note.slice(note.length - 1), 10)
  );
  const octave = overflow + octaves[0];
  return octave;
}

export function getColorization(notes: string[], colorize: Colorize) {
  if (!colorize) {
    return null;
  }
  const match = colorize.find(
    (color) => !!color.keys.find((key) => notes.includes(key))
  );
  return match ? match.color : null;
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

function upperOffset(key: Key, index: number, keyOffset: number) {
  const isFirst = (index: number) => index === keyOffset;
  if (isFirst(index)) {
    return 0;
  }
  return key.upperOffset;
}

export function whiteIndex(index: number) {
  return (
    Array(index % 12)
      .fill(0)
      .filter((_, i) => !accidentals.includes(i)).length +
    Math.floor(index / 12) * 7
  );
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
  top = false,
  fill = "white",
  fontFamily = "helvetica"
): TextElement {
  const {
    offsetX,
    upperHeight,
    lowerHeight,
    upperOffset,
    strokeWidth,
    upperWidth,
  } = defaultOptions(key);
  const magic = 14.5;
  const radius = (key.scaleX * (magic - strokeWidth * 2)) / 2;
  const w = key.lowerWidth || key.upperWidth;
  const x = top ? offsetX + upperWidth / 2 + upperOffset : offsetX + w / 2;
  const y = top ? radius * 2 : upperHeight + lowerHeight - 4;

  const baseCircle = {
    r: radius,
    fill,
    stroke: key.stroke,
    strokeWidth: key.strokeWidth,
  };

  const circle1 = {
    ...baseCircle,
    cx: x,
    cy: y - radius / 3,
  };

  const circle2 = {
    ...baseCircle,
    cx: x,
    cy: y - radius / 3 - radius * 2 - 2,
  };

  const baseText = {
    textAnchor: "middle" as TextAnchorVariant,
    fontSize: "12px",
    fill: "white",
    fontWeight: 600,
    fontFamily,
    value: "",
  };

  const text1: Text = {
    ...baseText,
    x,
    y: y - radius,
  };

  const text2: Text = {
    ...baseText,
    fontSize: "10px",
    x,
    y,
  };

  return {
    circle1,
    circle2,
    text1,
    text2,
  };
}

export function getKeySizes(options: DefaultOptions) {
  const {
    lowerHeight,
    upperHeight,
    lowerWidth,
    strokeWidth,
    palette,
    stroke,
  } = defaultOptions(options);
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

export function renderKeys(options: DefaultOptions) {
  options = defaultOptions(options);
  const keySizes = getKeySizes(options);
  const {
    keyCount,
    scaleY,
    scaleX,
    visibleKeys,
    lowerWidth,
    strokeWidth,
    keyOffset,
    colorize,
  } = options;

  return Array(keyCount + keyOffset)
    .fill(0)
    .map((_, index, _keys) => keySizes[index % 12])
    .map<Key>((key, index, _keys) => {
      const octave = getOctave(index, options.range);
      const notes = key.pitches.map((pitch) => pitch + octave);
      const renderedKey: Key = {
        pitches: key.pitches,
        index,
        notes,
        scaleX,
        scaleY,
        fill: getColorization(notes, colorize) || key.fill,
        contrast: key.contrast,
        strokeWidth: key.strokeWidth,
        stroke: key.stroke,
        upperHeight: key.upperHeight * scaleY,
        lowerHeight: key.lowerHeight * scaleY,
        upperWidth: upperWidth(key, index, keyOffset, keyCount) * scaleX,
        lowerWidth: key.lowerWidth * scaleX,
        upperOffset: upperOffset(key, index, keyOffset) * scaleX,
        visible:
          !visibleKeys ||
          visibleKeys.length === 0 ||
          !!key.pitches.find((pitch) => visibleKeys.includes(pitch)),
        offsetX:
          getKeyOffset(index, _keys, lowerWidth, keyOffset) * scaleX +
          Math.ceil(strokeWidth / 2),
      };
      return renderedKey;
    })
    .filter((key) => key.index >= keyOffset);
}

export function totalDimensions(options: DefaultOptions) {
  const {
    scaleX,
    scaleY,
    lowerWidth,
    keyCount,
    lowerHeight,
    upperHeight,
    strokeWidth,
  } = defaultOptions(options);

  return [
    scaleX * lowerWidth * whiteIndex(keyCount + 1),
    (lowerHeight + upperHeight) * scaleY,
  ].map((c) => Math.round(c + strokeWidth * 2)); // >svg adds stroke around actual widths
}

export function getPoints(key: Key) {
  const {
    upperOffset,
    offsetX,
    offsetY,
    upperHeight,
    lowerHeight,
    upperWidth,
    lowerWidth,
  } = defaultOptions(key);
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

export function renderSVG(options: DefaultOptions) {
  const labels: Record<string, string> = {};
  // eslint-disable-next-line prefer-const
  for (let [key, value] of Object.entries(options.labels)) {
    if (key === "B#4") {
      key = "B#5";
    }
    labels[key] = value;
  }

  options.labels = labels;

  options = defaultOptions(options);

  const colorize = options.colorize.map((keyObj) => {
    const keys = keyObj.keys.map((key) => {
      if (key === "B#4") {
        return "B#5";
      } else {
        return key;
      }
    });
    keyObj.keys = keys;
    return keyObj;
  });

  options.colorize = colorize;

  const keys = renderKeys(options);
  const dimensions = totalDimensions(options);
  return {
    svg: {
      width: dimensions[0],
      height: dimensions[1],
    },
    children: keys.map((key) => {
      if (!key.visible) {
        return undefined;
      }
      let circle1, circle2, text1, text2;

      const label = options.labels
        ? key.notes.find((n) => {
            return !!Object.keys(options.labels).includes(n);
          })
        : "";

      if (label) {
        const textElements = getTextElements(
          key,
          options.topLabels,
          "white",
          options.fontFamily
        );
        circle1 = textElements.circle1;
        circle2 = textElements.circle2;
        text1 = textElements.text1;
        text1.value = options.labels[label];
        text2 = textElements.text2;
        text2.value = label;
      }
      const points = getPoints(key);
      return {
        key,
        polygon: {
          points: points.map((p) => p.join(",")).join(" "),
          style: {
            fill: key.fill,
            stroke: key.stroke,
            strokeWidth: key.strokeWidth,
          },
        },
        circle1,
        circle2,
        text1,
        text2,
      };
    }),
  };
}
// const options = {
//   fontFamily: "Arial",
//   rightHandKeysColor: "blue",
//   leftHandKeysColor: "red",
// };
// const leftChord = chord("B", 3, ["P1"]);
// const rightChord = chord("B", 3, ["M3", "P5", "M7", "M9"]);

// const rightHandKeys = getKeyboardLabels(leftChord);
// const leftHandKeys = getKeyboardLabels(rightChord);
// const labels = { ...leftHandKeys, ...rightHandKeys };

// const svgPianoOptions = defaultOptions({
//   ..._defaultOptions,
//   range: ["C3", "C6"],
//   scaleX: 2,
//   scaleY: 2,
//   strokeWidth: 1,
//   labels,
//   fontFamily: options?.fontFamily || "helvetica",
//   colorize: [
//     {
//       keys: rightHandKeys ? Object.keys(rightHandKeys) : [],
//       color: options?.rightHandKeysColor || "lightblue",
//     },
//     {
//       keys: leftHandKeys ? Object.keys(leftHandKeys) : [],
//       color: options?.leftHandKeysColor || "lightblue",
//     },
//   ],
// });

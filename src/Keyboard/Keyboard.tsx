/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState, useRef } from "react";
import {
  KeyboardModel,
  KeyboardOptions,
  RenderActiveKey,
} from "../SVGKeyboard/KeyboardModel";

export interface KeyboardProps {
  leftHandKeys?: Partial<KeyboardOptions>;
  rightHandKeys?: Partial<KeyboardOptions>;
  options?: Partial<KeyboardOptions>;
}

function usePrevious(value: string) {
  const ref = useRef<string>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
//TODO create state for dimensions
//TODO error handling for out of range keys
export const Keyboard = ({
  rightHandKeys,
  leftHandKeys,
  options = {},
}: KeyboardProps) => {
  const [keyboardModel, setKeyboardModel] = useState<KeyboardModel>(
    new KeyboardModel(options)
  );
  const [lhk, setLeftHandKeys] = useState<RenderActiveKey[] | undefined>();
  const [rhk, setRightHandKeys] = useState<RenderActiveKey[] | undefined>();

  const prevOptions = usePrevious(JSON.stringify(options));
  const prevLeftHandKeys = usePrevious(JSON.stringify(leftHandKeys));
  const prevRightHandKeys = usePrevious(JSON.stringify(rightHandKeys));

  useEffect(() => {
    const optionsChanged = prevOptions !== JSON.stringify(options);
    if (optionsChanged) {
      const km = new KeyboardModel(options);
      setKeyboardModel(km);
      setLeftHandKeys(km.getLeftHandkeys(leftHandKeys || {}));
      setRightHandKeys(km.getRightHandKeys(rightHandKeys || {}));
    }

    if (prevLeftHandKeys !== JSON.stringify(leftHandKeys) && !optionsChanged) {
      setLeftHandKeys(keyboardModel.getLeftHandkeys(leftHandKeys || {}));
    }

    if (
      prevRightHandKeys !== JSON.stringify(rightHandKeys) &&
      !optionsChanged
    ) {
      setRightHandKeys(keyboardModel.getRightHandKeys(rightHandKeys || {}));
    }
  }, [
    prevOptions,
    options,
    prevLeftHandKeys,
    leftHandKeys,
    prevRightHandKeys,
    rightHandKeys,
    keyboardModel,
  ]);

  const dimensions = keyboardModel.getSVGDimensions();
  const keyboardOptions = keyboardModel.getOptions();
  const polygons = keyboardModel.getPolygons();
  const width = dimensions[0];
  const height = dimensions[1] + keyboardOptions.strokeWidth * 2;
  return (
    <>
      <svg width={width} height={height}>
        <g>
          {polygons &&
            polygons.map(({ polygon }, index) => {
              return [polygon && <polygon {...polygon} key={`p${index}`} />];
            })}
        </g>
        <g>
          {lhk &&
            lhk.map(({ activeKey, text1, text2 }, index: number) => {
              return [
                activeKey && <polygon {...activeKey} key={`lhk${index}`} />,
                text1 && (
                  <text {...text1} key={`lhl1${index}`}>
                    {text1.value}
                  </text>
                ),
                text2 && (
                  <text {...text2} key={`lhl2${index}`}>
                    {text2.value}
                  </text>
                ),
              ];
            })}
          {rhk &&
            rhk.map(({ activeKey, text1, text2 }, index) => {
              return [
                activeKey && <polygon {...activeKey} key={`rhk${index}`} />,
                text1 && (
                  <text {...text1} key={`lhl1${index}`}>
                    {text1.value}
                  </text>
                ),
                text2 && (
                  <text {...text2} key={`lhl2${index}`}>
                    {text2.value}
                  </text>
                ),
              ];
            })}
        </g>
        {/* <g>
          {leftHandLabels.map(({ text1, text2 }, index) => {
            return [
              text1 && (
                <text {...text1} key={`lhl1${index}`}>
                  {text1.value}
                </text>
              ),
              text2 && (
                <text {...text2} key={`lhl2${index}`}>
                  {text2.value}
                </text>
              ),
            ];
          })}
          {rightHandLabels.map(({ text1, text2 }, index) => {
            return [
              text1 && (
                <text {...text1} key={`rhl1${index}`}>
                  {text1.value}
                </text>
              ),
              text2 && (
                <text {...text2} key={`rhl2${index}`}>
                  {text2.value}
                </text>
              ),
            ];
          })}
        </g> */}
      </svg>
    </>
  );
};

Keyboard.displayName = "Keyboard";

Keyboard.defaultProps = {};

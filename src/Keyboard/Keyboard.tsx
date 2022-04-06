/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState, useRef, useCallback } from "react";
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
  const ref = useRef<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement>();

  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [keyboardModel, setKeyboardModel] = useState<KeyboardModel>(
    new KeyboardModel(options)
  );
  const [lhk, setLeftHandKeys] = useState<RenderActiveKey[] | undefined>();
  const [rhk, setRightHandKeys] = useState<RenderActiveKey[] | undefined>();

  const prevOptions = usePrevious(JSON.stringify(options));
  const prevLeftHandKeys = usePrevious(JSON.stringify(leftHandKeys));
  const prevRightHandKeys = usePrevious(JSON.stringify(rightHandKeys));

  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      // Depending on the layout, you may need to swap inlineSize with blockSize
      // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize
      // setWidth(event[0].contentBoxSize[0].inlineSize);
      // setHeight(event[0].contentBoxSize[0].blockSize);
      setContainerWidth(event[0].contentBoxSize[0].inlineSize);

      if (ref && ref.current) {
        ref.current.style.width = `${event[0].contentBoxSize[0].inlineSize}px`;
      }
    });

    if (containerRef && containerRef.current) {
      resizeObserver.observe(containerRef.current);
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, [containerRef, ref]);

  useEffect(() => {
    const optionsChanged = prevOptions !== JSON.stringify(options);
    if (optionsChanged) {
      const km = new KeyboardModel(options);
      setKeyboardModel(km);
      setLeftHandKeys(
        km.getLeftHandkeys(leftHandKeys || {}, { fill: "green" })
      );
      setRightHandKeys(
        km.getRightHandKeys(rightHandKeys || {}, { fill: "blue" })
      );
    }

    if (prevLeftHandKeys !== JSON.stringify(leftHandKeys) && !optionsChanged) {
      setLeftHandKeys(
        keyboardModel.getLeftHandkeys(leftHandKeys || {}, { fill: "green" })
      );
    }

    if (
      prevRightHandKeys !== JSON.stringify(rightHandKeys) &&
      !optionsChanged
    ) {
      setRightHandKeys(
        keyboardModel.getRightHandKeys(rightHandKeys || {}, { fill: "blue" })
      );
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
  const firsRhktKey = rhk && rhk.length > 0 ? rhk[0].x : 0;
  const lastRhkKey =
    rhk && rhk.length > 0
      ? rhk[rhk.length - 1].x + rhk[rhk.length - 1].width
      : 0;
  const rhkXRange = [firsRhktKey, lastRhkKey];
  const div = ref.current;
  if (div) {
    div.scrollLeft = 100;
    const rhkWidth = rhkXRange[1] - rhkXRange[0];
    const space = (containerWidth - rhkWidth) / 2;
    div.scrollLeft = rhkXRange[0] - space;
  }

  // The scroll listener
  const handleScroll = useCallback(() => {}, []);

  // Attach the scroll listener to the div
  useEffect(() => {
    const div = ref.current;
    div && div.addEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div ref={containerRef as any}>
      <div style={{ overflowX: "hidden" }} ref={ref as any}>
        <svg width={width} height={height} aria-label="Keyboard">
          <g aria-label="Keys">
            {polygons &&
              polygons.map(({ polygon }, index) => {
                return polygon && <polygon {...polygon} key={`p${index}`} />;
              })}
          </g>
          <g aria-label="Left hand active keys">
            {lhk &&
              lhk.map(({ activeKey, text1, text2 }, index: number) => {
                return [
                  activeKey && (
                    <polygon
                      data-testid="left hand key"
                      {...activeKey}
                      key={`lhk${index}`}
                    />
                  ),
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
          <g aria-label="Right hand active keys">
            {rhk &&
              rhk.map(({ activeKey, text1, text2 }, index) => {
                return [
                  activeKey && (
                    <polygon
                      data-testid="right hand key"
                      {...activeKey}
                      key={`rhk${index}`}
                    />
                  ),
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
        </svg>
      </div>
    </div>
  );
};

Keyboard.displayName = "Keyboard";

Keyboard.defaultProps = {};

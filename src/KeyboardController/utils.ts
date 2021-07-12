import { Chord } from "../Keyboard/chord";

export const getKeyboardLabels = (c: Chord) => {
  const voicing = c.voicing().toString().split(",");
  const notes = c.simple();
  return notes.reduce<Record<string, string>>(
    (
      previousValue: Record<string, string>,
      currentValue: string,
      currentIndex: number
    ) => {
      return {
        ...previousValue,
        [currentValue]: voicing[currentIndex],
      };
    },
    {}
  );
};

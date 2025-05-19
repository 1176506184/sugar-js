declare const SUGAR: {
  onMounted: (callback: () => void) => void
  useState: <T>(initValue: T) => [T, (value: T) => void]
  useSignal: <T>(initValue: T) => { value: T };
  instance: () => any,
  useEffect: (callback: () => void | (() => void), deps?: any[], run?: boolean) => void;
  makeSugar: (options: any) => any
};

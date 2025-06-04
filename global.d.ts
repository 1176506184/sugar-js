declare const SUGAR: {
  onMounted: (callback: () => void) => void
  useState: <T>(initValue: T) => [T, (value: T) => void]
  ref: <T>(initValue: T) => { value: T };
  makeSugar: (options: any) => any,
  watch: (source: any, callback: (newValue:any,oldValue:any) => void) => void;
};

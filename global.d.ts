declare const SUGAR: {
    onMounted: (callback: () => void) => void
    ref: <T>(initValue: T) => { value: T };
    Component: (options: any) => any,
    reactive: <T>(initValue: T) => T,
    createApp: (options: any) => any,
    watch: (source: any, callback: (newValue: any, oldValue: any) => void) => void;
    nextTick: (callback: () => void) => void
};

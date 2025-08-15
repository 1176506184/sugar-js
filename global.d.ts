declare const SUGAR: {
    onMounted: (callback: () => void) => void
    ref: <T>(initValue: T) => { value: T };
    Component: (options: any) => any,
    reactive: <T>(initValue: T) => T,
    createApp: (options: any) => any,
    watch: (source: any, callback: (newValue: any, oldValue: any) => void) => void;
    nextTick: (callback: () => void) => void
};

export {createApp, onMounted, nextTick, ref, Component, reactive, watch} from './packages/sugar/src/main'
export {sugarCompiler} from '@sugar/sugar-compiler'
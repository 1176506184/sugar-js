import { createApp, onMounted } from '@sugar/sugar-core';
import { nextTick, ref, reactive, watch, defineProps } from '@sugar/sugar-reactive';
import { Component } from '@sugar/sugar-render';
import { sugarCompiler } from '@sugar/sugar-compiler';

if (typeof window !== 'undefined') {
  (function (global: any) {
    global.SUGAR = {
      onMounted,
      createApp,
      nextTick,
      ref,
      Component,
      reactive,
      watch,
      defineProps,
    };
  })(window);
}

export {
  createApp,
  onMounted,
  nextTick,
  ref,
  Component,
  reactive,
  watch,
  sugarCompiler,
  defineProps,
};

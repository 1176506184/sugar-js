import { makeSugar, onMounted } from '@sugar/sugar-core';
import { instance, nextTick, ref, reactive, watch } from '@sugar/sugar-reactive';
import { Component } from '@sugar/sugar-render';

if (typeof window !== 'undefined') {
  (function (global: any) {
    global.SUGAR = {
      onMounted,
      makeSugar,
      instance,
      nextTick,
      ref,
      Component,
      reactive,
      watch
    };
  })(window);
}

export {
  makeSugar,
  onMounted,
  instance,
  nextTick,
  ref,
  Component,
  reactive,
  watch
};

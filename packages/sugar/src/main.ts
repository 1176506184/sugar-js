import { makeSugar, onMounted } from '@sugar/sugar-core';
import { instance, nextTick } from '@sugar/sugar-reactive';
import { useEffect, useSignal } from '@sugar/sugar-hook';

if (typeof window !== 'undefined') {
  (function (global: any) {
    global.SUGAR = {
      onMounted,
      makeSugar,
      instance,
      useEffect,
      nextTick,
      useSignal
    };
  })(window);
}

export {
  makeSugar,
  onMounted,
  instance,
  useEffect,
  nextTick,
  useSignal
};

import { makeSugar, onMounted } from '@sugar/sugar-core';
import { createEffect, reactive, reckon, ref, instance } from '@sugar/sugar-reactive';

(function (global: any) {
  global.SUGAR = {
    createEffect,
    onMounted,
    reactive,
    makeSugar,
    reckon,
    ref,
    instance
  };
})(window);

export {
  makeSugar,
  reactive,
  onMounted,
  createEffect,
  reckon,
  ref,
  instance
};

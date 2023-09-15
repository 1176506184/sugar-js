import { makeSugar, onMounted } from '@sugar/sugar-core';
import { createEffect, reactive, reckon, ref } from '@sugar/sugar-reactive';

(function (global: any) {
  global.SUGAR = {
    createEffect,
    onMounted,
    reactive,
    makeSugar,
    reckon,
    ref
  };
})(window);

export {
  makeSugar,
  reactive,
  onMounted,
  createEffect,
  reckon,
  ref
};

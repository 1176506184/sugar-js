import { makeSugar, onMounted } from '@sugar/sugar-core';
import { createEffect, reactive, reckon, ref, instance, watch } from '@sugar/sugar-reactive';
import { sugarUI } from './sugarUI';

(function (global: any) {
  global.SUGAR = {
    createEffect,
    onMounted,
    reactive,
    makeSugar,
    reckon,
    ref,
    instance,
    watch,
    sugarUI
  };
})(window);

export {
  makeSugar,
  reactive,
  onMounted,
  createEffect,
  reckon,
  ref,
  instance,
  watch,
  sugarUI

};

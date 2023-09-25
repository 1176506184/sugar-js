import { makeSugar, onMounted } from '@sugar/sugar-core';
import { createEffect, reactive, reckon, ref, instance } from '@sugar/sugar-reactive';
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
  sugarUI

};

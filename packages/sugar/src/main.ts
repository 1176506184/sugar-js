import { makeSugar, onMounted } from '@sugar/sugar-core';
import { instance, nextTick } from '@sugar/sugar-reactive';
import { useState, useEffect } from '@sugar/sugar-hook';
import { sugarCompiler } from '@sugar/sugar-compiler';
import { sugarRender } from '@sugar/sugar-render';
import SUGAR_UI from '@sugar/sugar-ui';

if (typeof window !== 'undefined') {
  (function (global: any) {
    global.SUGAR = {
      onMounted,
      makeSugar,
      instance,
      useState,
      useEffect,
      nextTick,
      SUGAR_UI
    };
  })(window);
}

export {
  makeSugar,
  onMounted,
  instance,
  useState,
  useEffect,
  nextTick,
  sugarCompiler,
  sugarRender,
  SUGAR_UI
};

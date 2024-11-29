import { makeSugar, onMounted } from '@sugar/sugar-core';
import { instance, nextTick } from '@sugar/sugar-reactive';
import { useState, useEffect } from '@sugar/sugar-hook';

if (typeof window !== 'undefined') {
  (function (global: any) {
    global.SUGAR = {
      onMounted,
      makeSugar,
      instance,
      useState,
      useEffect,
      nextTick
    };
  })(window);
}

export {
  makeSugar,
  onMounted,
  instance,
  useState,
  useEffect,
  nextTick
};

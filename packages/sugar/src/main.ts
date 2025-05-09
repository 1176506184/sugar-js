import { makeSugar, onMounted } from '@sugar/sugar-core';
import { instance, nextTick } from '@sugar/sugar-reactive';
import { useState, useEffect, useSignal } from '@sugar/sugar-hook';

if (typeof window !== 'undefined') {
  (function (global: any) {
    global.SUGAR = {
      onMounted,
      makeSugar,
      instance,
      useState,
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
  useState,
  useEffect,
  nextTick,
  useSignal
};

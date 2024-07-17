import { makeSugar, onMounted } from '@sugar/sugar-core';
import { instance, nextTick } from '@sugar/sugar-reactive';
import { sugarUI } from './sugarUI';
import { useState, useEffect } from '@sugar/sugar-hook';
import { createSSRApp } from '@sugar/sugar-next';

if (typeof window !== 'undefined') {
  (function (global: any) {
    global.SUGAR = {
      onMounted,
      makeSugar,
      instance,
      sugarUI,
      useState,
      useEffect,
      nextTick,
      createSSRApp
    };
  })(window);
}

export {
  makeSugar,
  onMounted,
  instance,
  sugarUI,
  useState,
  useEffect,
  nextTick,
  createSSRApp
};

import { makeSugar, onMounted } from '@sugar/sugar-core';
import { createEffect, reactive, reckon, ref, instance, watch, nextTick } from '@sugar/sugar-reactive';
import { sugarUI } from './sugarUI';
import { useState, useEffect } from '@sugar/sugar-hook';

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
    sugarUI,
    useState,
    useEffect,
    nextTick
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
  sugarUI,
  useState,
  useEffect,
  nextTick
};

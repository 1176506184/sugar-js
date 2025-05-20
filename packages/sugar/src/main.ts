import { makeSugar, onMounted } from '@sugar/sugar-core';
import { instance, nextTick } from '@sugar/sugar-reactive';
import { useEffect, useSignal, useState } from '@sugar/sugar-hook';
import { Component } from '@sugar/sugar-render';

if (typeof window !== 'undefined') {
  (function (global: any) {
    global.SUGAR = {
      onMounted,
      makeSugar,
      instance,
      useEffect,
      nextTick,
      useSignal,
      useState,
      Component
    };
  })(window);
}

export {
  makeSugar,
  onMounted,
  instance,
  useEffect,
  nextTick,
  useSignal,
  useState,
  Component
};

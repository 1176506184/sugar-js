import { makeSugar, onMounted } from '@sugar/sugar-core';
import { instance, nextTick, useEffect, ref, useState, reactive } from '@sugar/sugar-reactive';
import { Component } from '@sugar/sugar-render';

if (typeof window !== 'undefined') {
  (function (global: any) {
    global.SUGAR = {
      onMounted,
      makeSugar,
      instance,
      useEffect,
      nextTick,
      ref,
      useState,
      Component,
      reactive
    };
  })(window);
}

export {
  makeSugar,
  onMounted,
  instance,
  useEffect,
  nextTick,
  ref,
  useState,
  Component,
  reactive
};

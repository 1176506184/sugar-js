import makeReactive from './reactive';
import reckon from './reckon';
import { ref, instance } from './ref';
import { createEffect } from './signal/createEffect';

const reactive = function (value) {
  if (!value || typeof value !== 'object') {
    console.error('this value is not allow');
  }
  return makeReactive(value);
};

export {
  reactive,
  reckon,
  ref, createEffect, instance

};

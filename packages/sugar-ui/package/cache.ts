export const cache = {

};

export function initCache (key, value) {
  cache[key] = value;
}

export function getCache (key) {
  return cache[key];
}

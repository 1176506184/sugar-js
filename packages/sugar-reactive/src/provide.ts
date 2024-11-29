const provideMap = new Map();
export function provide<T, K = InjectionKey<T> | string | number> (key: K, value: K extends InjectionKey<infer V> ? V : T) {
  if (provideMap.has(key)) {
    return;
  }
  provideMap.set(key, value);
}

export function inject<T, K = InjectionKey<T> | string | number> (key: K, defaultValue?: K extends InjectionKey<infer V> ? V : T) {
  return provideMap.get(key) || defaultValue;
}

type InjectionKey<T> = symbol;

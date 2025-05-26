export const componentCache = {};
export function addComponentCache (sugar: any, key: any) {
  componentCache[key] = sugar;
}
export function getComponentCache (key) {
  return componentCache[key];
}

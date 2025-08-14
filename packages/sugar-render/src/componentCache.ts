export const componentCache: any = {};
export function addComponentCache(sugar: any, key: any) {
  componentCache[key] = sugar;
}
export function getComponentCache(key: string) {
  return componentCache[key];
}

export const isArray = Array.isArray;

export const extend = Object.assign;

export function parseForAlias (str: string): string[] {
  const match = str.match(/^\s*\(([^)]+)\)\s*$/);
  if (match) {
    return match[1].split(',').map(s => s.trim());
  } else {
    return [str.trim()]; // 如果没有括号，就是单变量
  }
}

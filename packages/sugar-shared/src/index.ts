export const isArray = (val) => val instanceof Array;
export const isString = (val: unknown): val is string => typeof val === 'string';

export const enum Namespaces {
  HTML,
}

export const NO = (tag: string) => false;

export function startsWith(source: string, searchString: string): boolean {
  return source.startsWith(searchString);
}

export function startsWithEndTagOpen(source: string, tag: string): boolean {
  return (
    startsWith(source, '</') &&
    source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase() &&
    /[\t\r\n\f />]/.test(source[2 + tag.length] || '>')
  );
}

export const isIntegerKey = (key: unknown) =>
  isString(key) && key !== 'NaN' && key[0] !== '-' && '' + parseInt(key, 10) === key;

const hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwn = (val: object, key: any): key is keyof typeof val =>
  hasOwnProperty.call(val, key);

export const hasChanged = (value: any, oldValue: any): boolean => !Object.is(value, oldValue);

export function isDef(v: any) {
  return v !== undefined && v !== null;
}

export function isUndef(v: any) {
  return v === undefined || v === null;
}

export function escape2Html(str) {
  const arrEntities = {
    lt: '<',
    gt: '>',
    nbsp: ' ',
    amp: '&',
    quot: '"',
  };

  return str
    .replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all: any, t: any) {
      return arrEntities[t];
    })
    .replace(/<[^>]+s-on:([^>]+)>/gi, function (match: any, p1: any) {
      return match.replace(/s-on:/g, '@');
    });
}

export const enum NodeTypes {
  ROOT,
  ELEMENT,
  TEXT,
  COMMENT,
  SIMPLE_EXPRESSION,
  INTERPOLATION,
  ATTRIBUTE,
  DIRECTIVE,
  // containers
  COMPOUND_EXPRESSION,
  IF,
  IF_BRANCH,
  FOR,
  TEXT_CALL,
  // codegen
  VNODE_CALL,
}

const is = {
  Array: Array.isArray,
  Date: (val) => val instanceof Date,
  Set: (val) => Object.prototype.toString.call(val) === '[object Set]',
  Map: (val) => Object.prototype.toString.call(val) === '[object Map]',
  Object: (val) => Object.prototype.toString.call(val) === '[object Object]',
  Symbol: (val) => Object.prototype.toString.call(val) === '[object Symbol]',
  Function: (val) => Object.prototype.toString.call(val) === '[object Function]',
};

export function deepClone(value, weakMap = new WeakMap(), strict = false) {
  // 2.1 函数浅拷贝
  /* if (is.Function(value)) return value */

  // 2.2 函数深拷贝
  if (is.Function(value) && strict) {
    if (/^function/.test(value.toString()) || /^\(\)/.test(value.toString())) {
      return new Function('return ' + value.toString())();
    }

    return new Function('return function ' + value.toString())();
  } else if (is.Function(value)) {
    return value;
  }

  // 3.Date 深拷贝
  if (is.Date(value)) return new Date(value.valueOf());

  // 4.判断如果是Symbol的value, 那么创建一个新的Symbol
  if (is.Symbol(value)) return Symbol(value.description);

  // 5.判断是否是Set类型 进行深拷贝
  if (is.Set(value)) {
    // 5.1 浅拷贝 直接进行解构即可
    // return new Set([...value])

    // 5.2 深拷贝
    const newSet = new Set();
    for (const item of value) {
      // @ts-expect-error
      newSet.add(deepClone(item), weakMap);
    }
    return newSet;
  }

  // 6.判断是否是Map类型
  if (is.Map(value)) {
    // 6.1 浅拷贝 直接进行解构即可
    // return new Map([...value])

    // 6.2 深拷贝
    const newMap = new Map();
    for (const item of value) newMap.set(deepClone(item[0], weakMap), deepClone(item[1], weakMap));
    return newMap;
  }

  // 9.判断weakMap是否有值 有值的情况下就直接将值返回就可以
  if (weakMap.has(value)) return weakMap.get(value);

  // 11.2 判断数组
  if (is.Array(value)) {
    const newArr = [];
    // eslint-disable-next-line @typescript-eslint/no-for-in-array
    for (const item in value) newArr[item] = deepClone(value[item], weakMap);
    return newArr;
  }

  // 1.如果不是对象类型则直接将当前值返回
  if (!is.Object(value)) return value;

  // 7.判断传入的对象是数组, 还是对象
  const newObj = is.Array(value) ? [] : {};

  // 10.当weakMap没有值时，将originValue作为key, newObj作为value
  weakMap.set(value, newObj);

  for (const key in value) {
    // 11.1 判断数组
    if (is.Array(value[key])) deepClone(value[key], weakMap);

    weakMap.set(value, newObj);
    // 8 进行递归调用
    newObj[key] = deepClone(value[key], weakMap);
  }

  // 4.1 对Symbol作为key进行特殊的处理 拿到对象上面的所有Symbol key，以数组形式返回
  const symbolKeys = Object.getOwnPropertySymbols(value);
  for (const sKey of symbolKeys) {
    // 4.2 这里没有必要创建一个新的Symbol
    // const newSKey = Symbol(sKey.description)

    // 4.3 直接将原来的Symbol key 拷贝到新对象上就可以了
    newObj[sKey] = deepClone(value[sKey], weakMap);
  }

  return newObj;
}

export function guid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function addCSS(cssText) {
  const style = document.createElement('style'); // 创建一个style元素
  const head = document.head || document.getElementsByTagName('head')[0]; // 获取head元素
  style.type = 'text/css'; // 这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
  // @ts-expect-error
  if (style.styleSheet) {
    // IE
    const func = function () {
      try {
        // @ts-expect-error
        style.styleSheet.cssText = cssText;
      } catch (e) {}
    };
    // @ts-expect-error
    if (style.styleSheet.disabled) {
      setTimeout(func, 10);
    } else {
      func();
    }
  } else {
    // w3c
    // w3c浏览器中只要创建文本节点插入到style元素中就行了
    const textNode = document.createTextNode(cssText);
    style.appendChild(textNode);
  }
  head.appendChild(style); // 把创建的style元素插入到head中
}

export * from './nodeOps';

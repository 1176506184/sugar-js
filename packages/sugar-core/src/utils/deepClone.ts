function deepClone (obj) {
  const result = typeof obj.splice === 'function' ? [] : {};
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        result[key] = deepClone(obj[key]);// 如果对象的属性值为object的时候，递归调用deepClone,即在吧某个值对象复制一份到新的对象的对应值中。
      } else {
        result[key] = obj[key];// 如果对象的属性值不为object的时候，直接复制参数对象的每一个键值到新的对象对应的键值对中。
      }
    }
    return result;
  }
  return obj;
}

export default deepClone;

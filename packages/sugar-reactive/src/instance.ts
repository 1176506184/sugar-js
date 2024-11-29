function instance () {
  const result = {};
  const data = {
    value: null
  };
  return Object.defineProperty(result, 'value', {
    get () {
      return data.value;
    },
    set (newValue) {
      if (newValue !== data.value) {
        data.value = newValue;
      }
    }
  });
}

export {
  instance
};

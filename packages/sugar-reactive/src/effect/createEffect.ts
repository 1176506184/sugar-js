const observers = [];
const getCurrentObserver = () => {
  return observers[observers.length - 1];
};
const createEffect = (effect) => {
  const execute = () => {
    observers.push(execute);
    try {
      effect();
    } finally {
      observers.pop();
    }
  };
  execute();
};

export { getCurrentObserver, createEffect };

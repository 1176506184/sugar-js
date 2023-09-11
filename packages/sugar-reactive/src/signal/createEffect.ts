const observers = [];
let tempEffect = null as any;
const getCurrentObserver = () => {
  return observers[observers.length - 1];
};
const createEffect = (effect) => {
  const execute = () => {
    tempEffect = effect;
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

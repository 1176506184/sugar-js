const callbacks = [];

const timerFunc = () => {
  setTimeout(flushCallbacks, 0);
};

function flushCallbacks () {
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function nextTick (cb: Function) {
  callbacks.push(() => {
    if (cb) {
      cb();
    }
  });
  timerFunc();
}

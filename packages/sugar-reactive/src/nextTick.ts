const callbacks = [];
let pending = false;

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

export async function nextTick(cb: Function) {
  let _resolve;
  callbacks.push(() => {
    if (cb) {
      cb();
    } else if (_resolve) {
      _resolve();
    }
  });
  if (!pending) {
    pending = true;
    void Promise.resolve().then(flushCallbacks);
  }

  if (!cb) {
    return await new Promise((resolve, reject) => {
      // 保存resolve到callbacks数组中
      _resolve = resolve;
    });
  }
}

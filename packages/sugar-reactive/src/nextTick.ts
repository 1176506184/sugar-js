const callbacks: (() => void)[] = [];
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
  let resolvePromise: any;
  callbacks.push(() => {
    if (cb) {
      cb();
    } else if (resolvePromise) {
      resolvePromise();
    }
  });
  if (!pending) {
    pending = true;
    void Promise.resolve().then(flushCallbacks);
  }

  if (!cb) {
    return await new Promise((resolve) => {
      // 保存resolve到callbacks数组中
      resolvePromise = resolve;
    });
  }
}

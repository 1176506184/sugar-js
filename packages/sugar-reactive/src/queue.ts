// 保留原来的 createQueue
export function createQueue() {
  const queue: Function[] = [];

  function pushQueue(dep: Function) {
    queue.push(dep);
  }

  function flushQueue() {
    if (queue.length > 0) {
      uniqueArray(queue).forEach((dep) => dep());
      queue.length = 0;
    }
  }

  function uniqueArray(arr: Function[]) {
    return [...new Set(arr)];
  }

  return {
    queue,
    pushQueue,
    flushQueue,
  };
}

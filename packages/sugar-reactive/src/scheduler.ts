const jobQueue = new Set<() => void>();
let isFlushing = false;

export function queueJob(job: () => void) {
  jobQueue.add(job);
  if (!isFlushing) {
    isFlushing = true;
    void Promise.resolve().then(() => {
      for (const job of jobQueue) job();
      jobQueue.clear();
      isFlushing = false;
    });
  }
}

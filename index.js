
import { Worker, MessageChannel, receiveMessageOnPort } from 'worker_threads';

/**
 * @param {string} workerPath
 * @return {(...args: any) => any}
 */
export default function build(workerPath) {
  const taskPath = new URL('./task.js', import.meta.url);
  const w = new Worker(taskPath, { workerData: workerPath });
  w.unref();
  let activeCount = 0;

  return (...args) => {
    if (activeCount === 0) {
      w.ref();
      ++activeCount;
    }

    try {
      const shared = new SharedArrayBuffer(4);
      const int32 = new Int32Array(shared);

      const { port1: localPort, port2: workerPort } = new MessageChannel();
      w.postMessage({ port: workerPort, shared, args }, [workerPort]);

      Atomics.wait(int32, 0, 0);

      /** @type {{message: {return?: any, error?: any}}|undefined} */
      const m = receiveMessageOnPort(localPort);
      if (m === undefined) {
        throw new Error(`did not get async reply in time`);
      }

      const { message } = m;
      if ('return' in message) {
        return message.return;
      }
      throw message.error;

    } finally {
      --activeCount;
      if (activeCount === 0) {
        w.unref();
      }
    }
  };
}

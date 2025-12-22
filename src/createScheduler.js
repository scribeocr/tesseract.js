import createJob from './createJob.js';
import getId from './utils/getId.js';

let schedulerCounter = 0;

export default () => {
  const id = getId('Scheduler', schedulerCounter);
  const workers = {};
  const runningWorkers = {};
  let jobQueue = [];

  schedulerCounter += 1;

  const getQueueLen = () => jobQueue.length;
  const getNumWorkers = () => Object.keys(workers).length;

  const dequeue = () => {
    if (jobQueue.length !== 0) {
      const wIds = Object.keys(workers);
      for (let i = 0; i < wIds.length; i += 1) {
        if (typeof runningWorkers[wIds[i]] === 'undefined') {
          jobQueue[0](workers[wIds[i]]);
          break;
        }
      }
    }
  };

  const queue = (action, payload, priorityJob = false) => (
    new Promise((resolve, reject) => {
      const job = createJob({ action, payload, priorityJob });
      const jobFunction = async (w) => {
        jobQueue.shift();
        runningWorkers[w.id] = job;
        try {
          const res1 = await w[action].apply(this, [payload, job.id]);
          resolve(res1);
          // If an array of promises is returned, wait for all promises to resolve before dequeuing.
          // If this did not happen, then every job could be assigned to the same worker.
          if (Array.isArray(res1)) await Promise.allSettled(res1);
        } catch (err) {
          reject(err);
        } finally {
          delete runningWorkers[w.id];
          dequeue();
        }
      };

      jobFunction.priorityJob = priorityJob;

      // Priority jobs cut in line - insert before the first non-priority job
      if (priorityJob) {
        let insertIndex = 0;
        for (let i = 0; i < jobQueue.length; i += 1) {
          if (!jobQueue[i].priorityJob) {
            insertIndex = i;
            break;
          }
          insertIndex = i + 1;
        }
        jobQueue.splice(insertIndex, 0, jobFunction);
      } else {
        jobQueue.push(jobFunction);
      }

      dequeue();
    })
  );

  const addWorker = (w) => {
    workers[w.id] = w;
    dequeue();
    return w.id;
  };

  const addJob = async (action, payload, priorityJob = false) => {
    if (getNumWorkers() === 0) {
      throw Error(`[${id}]: You need to have at least one worker before adding jobs`);
    }

    return queue(action, payload, priorityJob);
  };

  const terminate = async () => {
    Object.keys(workers).forEach(async (wid) => {
      await workers[wid].terminate();
    });
    jobQueue = [];
  };

  return {
    addWorker,
    addJob,
    terminate,
    getQueueLen,
    getNumWorkers,
  };
};

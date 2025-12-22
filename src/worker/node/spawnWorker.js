import { Worker } from 'worker_threads';

/**
 * spawnWorker
 *
 * @name spawnWorker
 * @function fork a new process in node
 * @access public
 */
export default ({ workerPath }) => new Worker(workerPath);

/**
 * terminateWorker
 *
 * @name terminateWorker
 * @function kill worker
 * @access public
 */
export default (worker) => {
  worker.terminate();
};

/**
 * send
 *
 * @name send
 * @function send packet to worker and create a job
 * @access public
 */
export default async (worker, packet) => {
  worker.postMessage(packet);
};

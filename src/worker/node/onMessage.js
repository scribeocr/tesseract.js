export default (worker, handler) => {
  worker.on('message', handler);
};

import createWorker from './createWorker.js';

const recognize = async (image, langs, options) => {
  const worker = await createWorker(langs, 1, options);
  return worker.recognize(image)
    .finally(async () => {
      await worker.terminate();
    });
};

const detect = async (image, options) => {
  const worker = await createWorker('osd', 0, options);
  return worker.detect(image)
    .finally(async () => {
      await worker.terminate();
    });
};

export default {
  recognize,
  detect,
};

export { recognize, detect };

import defaultOptions from '../../constants/defaultOptions.js';

// Version is hardcoded to avoid JSON import issues in bundled browser code
const version = '7.0.1';

/*
 * Default options for browser worker
 */
export default {
  ...defaultOptions,
  workerPath: `https://cdn.jsdelivr.net/npm/tesseract.js@v${version}/dist/worker.min.js`,
};

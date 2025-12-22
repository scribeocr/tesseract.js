import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import defaultOptions from '../../constants/defaultOptions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/*
 * Default options for node worker
 */
export default {
  ...defaultOptions,
  workerPath: path.join(__dirname, '..', '..', 'worker-script', 'node', 'index.js'),
};

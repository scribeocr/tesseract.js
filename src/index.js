/**
 *
 * Entry point for tesseract.js, should be the entry when bundling.
 *
 * @fileoverview entry point for tesseract.js
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
import createScheduler from './createScheduler.js';
import createWorker from './createWorker.js';
import languages from './constants/languages.js';
import OEM from './constants/OEM.js';
import PSM from './constants/PSM.js';
import { setLogging } from './utils/log.js';

export {
  languages,
  OEM,
  PSM,
  createScheduler,
  createWorker,
  setLogging,
};

export default {
  languages,
  OEM,
  PSM,
  createScheduler,
  createWorker,
  setLogging,
};

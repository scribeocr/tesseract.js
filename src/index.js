/**
 *
 * Entry point for tesseract.js, should be the entry when bundling.
 *
 * @fileoverview entry point for tesseract.js
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
import { TessScheduler } from './TessScheduler.js';
import { TessWorker } from './TessWorker.js';
import languages from './constants/languages.js';
import OEM from './constants/OEM.js';
import PSM from './constants/PSM.js';

export {
  languages,
  OEM,
  PSM,
  TessScheduler,
  TessWorker,
};

export default {
  languages,
  OEM,
  PSM,
  TessScheduler,
  TessWorker,
};

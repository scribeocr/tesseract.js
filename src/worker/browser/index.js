/**
 *
 * Tesseract Worker adapter for browser
 *
 * @fileoverview Tesseract Worker adapter for browser
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
import defaultOptions from './defaultOptions.js';
import spawnWorker from './spawnWorker.js';
import terminateWorker from './terminateWorker.js';
import onMessage from './onMessage.js';
import send from './send.js';
import loadImage from './loadImage.js';

export {
  defaultOptions,
  spawnWorker,
  terminateWorker,
  onMessage,
  send,
  loadImage,
};

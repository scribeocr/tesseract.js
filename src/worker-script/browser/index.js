/**
 *
 * Browser worker scripts
 *
 * @fileoverview Browser worker implementation
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */

import * as worker from '../index.js';
import getCore from './getCore.js';
import gunzip from './gunzip.js';
import cache from './cache.js';

/*
 * register message handler
 */
self.addEventListener('message', ({ data }) => {
  worker.dispatchHandlers(data, (obj) => postMessage(obj));
});

/*
 * getCore is a sync function to load and return
 * TesseractCore.
 */
worker.setAdapter({
  getCore,
  gunzip,
  fetch: () => {},
  ...cache,
});

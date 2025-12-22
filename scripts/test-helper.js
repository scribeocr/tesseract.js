import * as constants from '../tests/constants.js';
import expect from 'expect.js';
import fs from 'fs';
import path from 'path';
import * as Tesseract from '../src/index.js';

global.expect = expect;
global.fs = fs;
global.path = path;
global.Tesseract = Tesseract;

Object.keys(constants).forEach((key) => {
  global[key] = constants[key];
});

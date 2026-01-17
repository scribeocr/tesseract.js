import { IMAGE_PATH, TIMEOUT, OPTIONS } from './constants.js';
import Tesseract from '../src/index.js';
import { expect } from '../node_modules/chai/chai.js';

describe('detect()', () => {
  let worker;
  before(async function cb() {
    this.timeout(0);
    worker = await Tesseract.createWorker('osd', 0, OPTIONS);
  });

  it('should detect OSD', async () => {
    const { data: { script: s } } = await worker.detect(`${IMAGE_PATH}/cosmic.png`);
    expect(s).to.equal('Latin');
  }).timeout(TIMEOUT);
});

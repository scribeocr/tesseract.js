import { createWorker } from '../../src/index.js';

// A worker is created once and used every time a user uploads a new file.
const worker = await createWorker('eng', 1, {
  corePath: '../../tesseract.js-core',
  logger(m) { console.log(m); },
});

const recognize = async function (evt) {
  const files = evt.target.files;

  for (let i = 0; i < files.length; i++) {
    const ret = await worker.recognize(files[i]);
    console.log(ret.data.text);
  }
};

const elm = document.getElementById('uploader');
elm.addEventListener('change', recognize);

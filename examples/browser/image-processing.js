import * as Tesseract from '../../src/index.js';

const recognize = async ({ target: { files } }) => {
  document.getElementById('imgInput').src = URL.createObjectURL(files[0]);
  const worker = await Tesseract.createWorker('eng', 1, {
    corePath: '../../tesseract.js-core',
  });
  const ret = await worker.recognize(files[0], { rotateAuto: true }, { imageColor: true, imageGrey: true, imageBinary: true });
  document.getElementById('imgOriginal').src = ret.data.imageColor;
  document.getElementById('imgGrey').src = ret.data.imageGrey;
  document.getElementById('imgBinary').src = ret.data.imageBinary;
};

const elm = document.getElementById('uploader');
elm.addEventListener('change', recognize);

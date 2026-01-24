import * as Tesseract from '../../src/index.js';

const recognize = async () => {
  const element = document.getElementById('imgRow');

  const worker = await Tesseract.TessWorker.create('eng', 0, {
    corePath: '../../tesseract.js-core',
  });

  const fileArr = ['../data/meditations.jpg', '../data/tyger.jpg', '../data/testocr.png'];
  const timeTotal = 0;

  let lastElement = element;

  for (const file of fileArr) {
    for (const rad of [-0.2, -0.1, 0.1, 0.2]) {
      const newElement = element.cloneNode(true);

      // Create the rotated images
      const ret1 = await worker.recognize(file, { rotateRadians: rad }, {
        text: false, blocks: false, hocr: false, tsv: false, imageColor: true,
      });

      newElement.children[0].children[1].src = ret1.data.imageColor;

      // Attempt to remove the rotation using the auto-rotate feature
      const ret2 = await worker.recognize(ret1.data.imageColor, { rotateAuto: true }, {
        text: false, blocks: false, hocr: false, tsv: false, imageColor: true, imageGrey: true, imageBinary: true, debug: true,
      });

      newElement.children[1].children[1].src = ret2.data.imageColor;
      newElement.children[2].children[1].src = ret2.data.imageGrey;
      newElement.children[3].children[1].src = ret2.data.imageBinary;

      lastElement.after(newElement);
      lastElement = newElement;
    }
  }
};

recognize();

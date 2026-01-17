import * as Tesseract from '../../src/index.js';

const { createWorker } = Tesseract;
const worker = await createWorker('eng', 1, {
  corePath: '../../tesseract.js-core',
  logger: (m) => console.log(m),
});

const uploader = document.getElementById('uploader');
const dlBtn = document.getElementById('download-pdf');
let pdf;

const recognize = async ({ target: { files } }) => {
  const res = await worker.recognize(files[0], { pdfTitle: 'Example PDF' }, { pdf: true });
  pdf = res.data.pdf;
  const text = res.data.text;
  const board = document.getElementById('board');
  board.value = text;
  dlBtn.disabled = false;
};

const downloadPDF = async () => {
  const filename = 'tesseract-ocr-result.pdf';
  const blob = new Blob([new Uint8Array(pdf)], { type: 'application/pdf' });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

uploader.addEventListener('change', recognize);
dlBtn.addEventListener('click', downloadPDF);

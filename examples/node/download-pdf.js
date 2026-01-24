#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { TessWorker } from '../../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [,, imagePath] = process.argv;
const image = path.resolve(__dirname, (imagePath || '../../tests/assets/images/cosmic.png'));

console.log(`Recognizing ${image}`);

(async () => {
  const worker = await TessWorker.create();
  const { data: { text, pdf } } = await worker.recognize(image, { pdfTitle: 'Example PDF' }, { pdf: true });
  console.log(text);
  fs.writeFileSync('tesseract-ocr-result.pdf', Buffer.from(pdf));
  console.log('Generate PDF: tesseract-ocr-result.pdf');
  await worker.terminate();
})();

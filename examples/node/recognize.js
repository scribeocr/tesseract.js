#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';
import { TessWorker } from '../../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [,, imagePath] = process.argv;
const image = path.resolve(__dirname, (imagePath || '../../tests/assets/images/cosmic.png'));

console.log(`Recognizing ${image}`);

(async () => {
  const worker = await TessWorker.create('eng', 1, {
    logger: (m) => console.log(m),
  });
  const { data: { text } } = await worker.recognize(image);
  console.log(text);
  await worker.terminate();
})();

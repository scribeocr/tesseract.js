import * as Tesseract from '../../src/index.js';

// This example provides a standardized performance benchmark.
// It does not accept user input.

const { TessWorker } = Tesseract;

(async () => {
  const worker = await TessWorker.create('eng', 1, {
    corePath: '../../tesseract.js-core',
  });

  // The performance.measureUserAgentSpecificMemory function only runs under specific circumstances for security reasons.
  // See: https://developer.mozilla.org/en-US/docs/Web/API/Performance/measureUserAgentSpecificMemory#security_requirements
  // Launching a server using `npm start` and accessing via localhost on the same system should meet these conditions.
  const debugMemory = true;
  if (debugMemory && crossOriginIsolated) {
    const memObj = await performance.measureUserAgentSpecificMemory();
    const memMb = memObj.breakdown.map((x) => { if (x.attribution?.[0]?.scope == 'DedicatedWorkerGlobalScope') return x.bytes; }).reduce((a, b) => (a || 0) + (b || 0), 0) / 1e6;

    console.log(`Worker memory utilization after initialization: ${memMb} MB`);
  } else {
    console.log('Unable to run `performance.measureUserAgentSpecificMemory`: not crossOriginIsolated.');
  }

  const fileArr = ['../data/meditations.jpg', '../data/tyger.jpg', '../data/testocr.png'];
  let timeTotal = 0;
  for (const file of fileArr) {
    const time1 = Date.now();
    for (let i = 0; i < 10; i++) {
      await worker.recognize(file);
    }
    const time2 = Date.now();
    const timeDif = (time2 - time1) / 1e3;
    timeTotal += timeDif;
    document.getElementById('message').innerHTML += `\n${file} [x10] runtime: ${timeDif}s`;
  }

  if (debugMemory && crossOriginIsolated) {
    const memObj = await performance.measureUserAgentSpecificMemory();
    const memMb = memObj.breakdown.map((x) => { if (x.attribution?.[0]?.scope == 'DedicatedWorkerGlobalScope') return x.bytes; }).reduce((a, b) => (a || 0) + (b || 0), 0) / 1e6;

    console.log(`Worker memory utilization after recognition: ${memMb} MB`);
  }

  document.getElementById('message').innerHTML += `\nTotal runtime: ${timeTotal}s`;
})();

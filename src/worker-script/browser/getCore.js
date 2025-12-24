import { simd, relaxedSimd } from '../../utils/wasmFeatureDetect.js';

// Version is hardcoded to avoid JSON import issues in bundled browser code
const coreVersion = '^7.0.1';

export default async (lstmOnly, corePath, res) => {
  if (typeof globalThis.TesseractCore === 'undefined') {
    const statusText = 'loading tesseract core';

    res.progress({ status: statusText, progress: 0 });

    // If the user specifies a core path, we use that
    // Otherwise, default to CDN
    const corePathImport = corePath || `https://cdn.jsdelivr.net/npm/@scribe.js/tesseract.js-core@v${coreVersion.substring(1)}`;

    // If a user specifies a specific JavaScript file, load that file.
    // Otherwise, assume a directory has been provided, and load either
    // tesseract-core.wasm.js or tesseract-core-simd.wasm.js depending
    // on whether this device has SIMD support.
    let corePathImportFile;
    if (corePathImport.slice(-2) === 'js') {
      corePathImportFile = corePathImport;
    } else {
      const simdSupport = await simd();
      const relaxedSimdSupport = await relaxedSimd();
      if (relaxedSimdSupport) {
        if (lstmOnly) {
          corePathImportFile = `${corePathImport.replace(/\/$/, '')}/tesseract-core-relaxedsimd-lstm.wasm.js`;
        } else {
          corePathImportFile = `${corePathImport.replace(/\/$/, '')}/tesseract-core-relaxedsimd.wasm.js`;
        }
      } else if (simdSupport) {
        if (lstmOnly) {
          corePathImportFile = `${corePathImport.replace(/\/$/, '')}/tesseract-core-simd-lstm.wasm.js`;
        } else {
          corePathImportFile = `${corePathImport.replace(/\/$/, '')}/tesseract-core-simd.wasm.js`;
        }
      } else {
        throw Error('This runtime is not supported (WASM SIMD required).');
      }
    }

    // Create a module named `globalThis.TesseractCore`
    globalThis.importScripts(corePathImportFile);

    if (typeof globalThis.TesseractCore === 'undefined') {
      throw Error('Failed to load TesseractCore');
    }
    res.progress({ status: statusText, progress: 1 });
  }
  return globalThis.TesseractCore;
};

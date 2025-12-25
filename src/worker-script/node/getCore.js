import { simd, relaxedSimd } from '../../utils/wasmFeatureDetect.js';
import OEM from '../../constants/OEM.js';

let TesseractCore = null;
/*
 * getCore is a sync function to load and return
 * TesseractCore.
 */
export default async (oem, _, res) => {
  if (TesseractCore === null) {
    const statusText = 'loading tesseract core';

    const simdSupport = await simd();
    const relaxedSimdSupport = await relaxedSimd();
    res.progress({ status: statusText, progress: 0 });
    if (relaxedSimdSupport) {
      if ([OEM.DEFAULT, OEM.LSTM_ONLY].includes(oem)) {
        TesseractCore = (await import('../../../tesseract.js-core/tesseract-core-relaxedsimd-lstm.js')).default;
      } else {
        TesseractCore = (await import('../../../tesseract.js-core/tesseract-core-relaxedsimd.js')).default;
      }
    } else if (simdSupport) {
      if ([OEM.DEFAULT, OEM.LSTM_ONLY].includes(oem)) {
        TesseractCore = (await import('../../../tesseract.js-core/tesseract-core-simd-lstm.js')).default;
      } else {
        TesseractCore = (await import('../../../tesseract.js-core/tesseract-core-simd.js')).default;
      }
    } else {
      throw Error('This runtime is not supported (WASM SIMD required).');
    }
    res.progress({ status: statusText, progress: 1 });
  }
  return TesseractCore;
};

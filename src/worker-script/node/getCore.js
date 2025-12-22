import { simd, relaxedSimd } from 'wasm-feature-detect';
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
        TesseractCore = (await import('@scribe.js/tesseract.js-core/tesseract-core-relaxedsimd-lstm.js')).default;
      } else {
        TesseractCore = (await import('@scribe.js/tesseract.js-core/tesseract-core-relaxedsimd.js')).default;
      }
    } else if (simdSupport) {
      if ([OEM.DEFAULT, OEM.LSTM_ONLY].includes(oem)) {
        TesseractCore = (await import('@scribe.js/tesseract.js-core/tesseract-core-simd-lstm.js')).default;
      } else {
        TesseractCore = (await import('@scribe.js/tesseract.js-core/tesseract-core-simd.js')).default;
      }
    } else if ([OEM.DEFAULT, OEM.LSTM_ONLY].includes(oem)) {
      TesseractCore = (await import('@scribe.js/tesseract.js-core/tesseract-core-lstm.js')).default;
    } else {
      TesseractCore = (await import('@scribe.js/tesseract.js-core/tesseract-core.js')).default;
    }
    res.progress({ status: statusText, progress: 1 });
  }
  return TesseractCore;
};

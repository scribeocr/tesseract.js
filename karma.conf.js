export default function (config) {
  config.set({
    frameworks: ['mocha'],
    files: [
      { pattern: 'dist/tesseract.min.js', included: true },
      { pattern: 'dist/worker.min.js', included: false, served: true },
      { pattern: 'tesseract.js-core/tesseract-core-simd-lstm.wasm.js', included: false, served: true },
      { pattern: 'tesseract.js-core/tesseract-core-simd.wasm.js', included: false, served: true },
      { pattern: 'tesseract.js-core/tesseract-core-relaxedsimd-lstm.wasm.js', included: false, served: true },
      { pattern: 'tesseract.js-core/tesseract-core-relaxedsimd.wasm.js', included: false, served: true },
      { pattern: 'tests/constants.js', included: false, served: true },
      { pattern: 'node_modules/expect.js/index.js', included: true },
      { pattern: 'tests/*.test.js', type: 'module' },
      { pattern: 'tests/assets/images/**', included: false, served: true },
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: 1,
    proxies: {
      '/dist/worker.min.js': '/base/dist/worker.min.js',
      '/tesseract.js-core/tesseract-core-simd-lstm.wasm.js': '/base/tesseract.js-core/tesseract-core-simd-lstm.wasm.js',
      '/tesseract.js-core/tesseract-core-simd.wasm.js': '/base/tesseract.js-core/tesseract-core-simd.wasm.js',
      '/tesseract.js-core/tesseract-core-relaxedsimd-lstm.wasm.js': '/base/tesseract.js-core/tesseract-core-relaxedsimd-lstm.wasm.js',
      '/tesseract.js-core/tesseract-core-relaxedsimd.wasm.js': '/base/tesseract.js-core/tesseract-core-relaxedsimd.wasm.js',
      '/tests/assets/images': '/base/tests/assets/images',
    },
  });
}

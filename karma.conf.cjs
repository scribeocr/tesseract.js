module.exports = function (config) {
  config.set({
    frameworks: ['mocha'],
    files: [
      {
        pattern: 'tests/*.test.js', type: 'module',
      },
      { pattern: 'src/**/*.js', included: false, served: true },
      { pattern: 'tesseract.js-core/*.js', included: false, served: true },
      {
        pattern: 'tesseract.js-core/*.wasm', included: false, served: true, type: 'wasm',
      },
      { pattern: 'tests/constants.js', included: false, served: true },
      { pattern: 'node_modules/chai/*.js', included: false, served: true },
      { pattern: 'tests/assets/images/**', included: false, served: true },
      { pattern: 'tests/assets/traineddata/**', included: false, served: true },
    ],
    reporters: ['progress'],
    browserConsoleLogOptions: {
      level: 'debug',
      terminal: true,
    },
    proxies: {
      '/tests/': '/base/tests/',
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: 1,
  });
};

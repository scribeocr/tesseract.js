import createJob from './createJob.js';
import getId from './utils/getId.js';
import OEM from './constants/OEM.js';
import getEnvironment from './utils/getEnvironment.js';

const isBrowser = getEnvironment('type') === 'browser';

let workerCounter = 0;

const send = async (worker, packet) => {
  worker.postMessage(packet);
};

const loadImage = async (image) => {
  let loadImageImp;
  if (typeof process === 'undefined') {
    loadImageImp = (await import('./worker/browser/loadImage.js')).default;
  } else {
    loadImageImp = (await import('./worker/node/loadImage.js')).default;
  }
  return loadImageImp(image);
};

const resolveURL = isBrowser ? s => (new URL(s, window.location.href)).href : s => s; // eslint-disable-line

const resolvePaths = (options) => {
  const opts = { ...options };
  ['corePath', 'langPath'].forEach((key) => {
    if (options[key]) {
      opts[key] = resolveURL(opts[key]);
    }
  });
  return opts;
};

const circularize = (page) => {
  const blocks = [];
  const paragraphs = [];
  const lines = [];
  const words = [];
  const symbols = [];

  if (page.blocks) {
    page.blocks.forEach((block) => {
      block.paragraphs.forEach((paragraph) => {
        paragraph.lines.forEach((line) => {
          line.words.forEach((word) => {
            word.symbols.forEach((sym) => {
              symbols.push({
                ...sym, page, block, paragraph, line, word,
              });
            });
            words.push({
              ...word, page, block, paragraph, line,
            });
          });
          lines.push({
            ...line, page, block, paragraph,
          });
        });
        paragraphs.push({
          ...paragraph, page, block,
        });
      });
      blocks.push({
        ...block, page,
      });
    });
  }

  return {
    ...page, blocks, paragraphs, lines, words, symbols,
  };
};

export default async (langs = 'eng', oem = OEM.LSTM_ONLY, _options = {}, config = {}) => {
  const id = getId('Worker', workerCounter);
  const {
    logger,
    errorHandler,
    ...options
  } = resolvePaths({
    logger: () => {},
    ..._options,
  });

  const promises = {};

  const ready = new Promise((innerResolve, innerReject) => {
    promises['ready-ready'] = { resolve: innerResolve, reject: innerReject, func: 'ready' };
  });

  // Current langs, oem, and config file.
  // Used if the user ever re-initializes the worker using `worker.reinitialize`.
  const currentLangs = typeof langs === 'string' ? langs.split('+') : langs;
  let currentOem = oem;
  let currentConfig = config;
  const lstmOnlyCore = [OEM.DEFAULT, OEM.LSTM_ONLY].includes(oem) && !options.legacyCore;

  let workerResReject;
  let workerResResolve;
  const workerRes = new Promise((resolve, reject) => {
    workerResResolve = resolve;
    workerResReject = reject;
  });
  const workerError = (event) => { workerResReject(event.message); };

  let worker;
  if (typeof process === 'undefined') {
    worker = new Worker(new URL('./worker-script/index.js', import.meta.url), { type: 'module' });
  } else {
    const WorkerNode = (await import('node:worker_threads')).Worker;
    worker = new WorkerNode(new URL('./worker-script/index.js', import.meta.url));
  }

  if (typeof process === 'undefined') {
    // @ts-ignore
    worker.onerror = workerError;
  } else {
    // @ts-ignore
    worker.on('error', workerError);
  }

  const messageHandler = async ({
    jobId, status, action, data,
  }) => {
    const promiseId = `${action}-${jobId}`;
    if (status === 'resolve') {
      let d = data;
      if (action === 'recognize') {
        d = circularize(data);
      }
      promises[promiseId].resolve({ jobId, data: d });
      delete promises[promiseId];
    } else if (status === 'reject') {
      promises[promiseId].reject(data);
      delete promises[promiseId];
      if (action === 'load') workerResReject(data);
      if (errorHandler) {
        errorHandler(data);
      } else {
        throw Error(data);
      }
    } else if (status === 'progress') {
      logger({ ...data, userJobId: jobId });
    }
  };

  if (typeof process === 'undefined') {
    // @ts-ignore
    worker.onmessage = (event) => messageHandler(event.data);
  } else {
    // @ts-ignore
    worker.on('message', messageHandler);
  }

  workerCounter += 1;

  const startJob = ({ id: jobId, action, payload }) => (
    new Promise((resolve, reject) => {
      // Using both `action` and `jobId` in case user provides non-unique `jobId`.
      const promiseId = `${action}-${jobId}`;
      promises[promiseId] = { resolve, reject };
      send(worker, {
        workerId: id,
        jobId,
        action,
        payload,
      });
    })
  );

  const startJob2 = ({ id: jobId, action, payload }) => {
    const promiseB = new Promise((resolve, reject) => {
      // Using both `action` and `jobId` in case user provides non-unique `jobId`.
      const promiseId = `${action}-${jobId}b`;
      promises[promiseId] = { resolve, reject };
    });

    const promiseA = new Promise((resolve, reject) => {
      // Using both `action` and `jobId` in case user provides non-unique `jobId`.
      const promiseId = `${action}-${jobId}`;
      promises[promiseId] = { resolve, reject };
      send(worker, {
        workerId: id,
        jobId,
        action,
        payload,
      });
    });

    return [promiseA, promiseB];
  };

  const load = () => (
    console.warn('`load` is depreciated and should be removed from code (workers now come pre-loaded)')
  );

  const loadInternal = (jobId) => (
    startJob(createJob({
      id: jobId, action: 'load', payload: { options: { lstmOnly: lstmOnlyCore, vanillaEngine: options.vanillaEngine, logging: options.logging } },
    }))
  );

  const writeText = (path, text, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'FS',
      payload: { method: 'writeFile', args: [path, text] },
    }))
  );

  const readText = (path, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'FS',
      payload: { method: 'readFile', args: [path, { encoding: 'utf8' }] },
    }))
  );

  const removeFile = (path, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'FS',
      payload: { method: 'unlink', args: [path] },
    }))
  );

  const FS = (method, args, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'FS',
      payload: { method, args },
    }))
  );

  const loadLanguage = () => (
    console.warn('`loadLanguage` is depreciated and should be removed from code (workers now come with language pre-loaded)')
  );

  const loadLanguageInternal = (_langs, jobId) => startJob(createJob({
    id: jobId,
    action: 'loadLanguage',
    payload: {
      langs: _langs,
      options: {
        langPath: options.langPath,
        dataPath: options.dataPath,
        cachePath: options.cachePath,
        cacheMethod: options.cacheMethod,
        gzip: options.gzip,
        lstmOnly: [OEM.LSTM_ONLY, OEM.TESSERACT_LSTM_COMBINED].includes(currentOem)
          && !options.legacyLang,
      },
    },
  }));

  const initialize = () => (
    console.warn('`initialize` is depreciated and should be removed from code (workers now come pre-initialized)')
  );

  const initializeInternal = (_langs, _oem, _config, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'initialize',
      payload: { langs: _langs, oem: _oem, config: _config },
    }))
  );

  const reinitialize = (langs = 'eng', oem, config, jobId) => { // eslint-disable-line

    if (lstmOnlyCore && [OEM.TESSERACT_ONLY, OEM.TESSERACT_LSTM_COMBINED].includes(oem)) throw Error('Legacy model requested but code missing.');

    const _oem = oem || currentOem;
    currentOem = _oem;

    const _config = config || currentConfig;
    currentConfig = _config;

    // Only load langs that are not already loaded.
    // This logic fails if the user downloaded the LSTM-only English data for a language
    // and then uses `worker.reinitialize` to switch to the Legacy engine.
    // However, the correct data will still be downloaded after initialization fails
    // and this can be avoided entirely if the user loads the correct data ahead of time.
    const langsArr = typeof langs === 'string' ? langs.split('+') : langs;
    const _langs = langsArr.filter((x) => !currentLangs.includes(x));
    currentLangs.push(..._langs);

    if (_langs.length > 0) {
      return loadLanguageInternal(_langs, jobId)
        .then(() => initializeInternal(langs, _oem, _config, jobId));
    }

    return initializeInternal(langs, _oem, _config, jobId);
  };

  const setParameters = (params = {}, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'setParameters',
      payload: { params },
    }))
  );

  const recognize = async (image, opts = {}, output = {
    blocks: true, text: true, hocr: true, tsv: true,
  }, jobId) => (
    startJob(createJob({
      id: jobId,
      action: 'recognize',
      payload: { image: await loadImage(image), options: opts, output },
    }))
  );

  const recognize2 = async (image, opts = {}, output = {
    blocks: true, text: true, hocr: true, tsv: true,
  }, jobId) => (
    startJob2(createJob({
      id: jobId,
      action: 'recognize2',
      payload: { image: await loadImage(image), options: opts, output },
    }))
  );

  const detect = async (image, jobId) => {
    if (lstmOnlyCore) throw Error('`worker.detect` requires Legacy model, which was not loaded.');

    return startJob(createJob({
      id: jobId,
      action: 'detect',
      payload: { image: await loadImage(image) },
    }));
  };

  const terminate = async () => {
    if (worker !== null) {
      /*
      await startJob(createJob({
        id: jobId,
        action: 'terminate',
      }));
      */
      await worker.terminate();
      worker = null;
    }
    return Promise.resolve();
  };

  const resolveObj = {
    id,
    worker,
    load,
    writeText,
    readText,
    removeFile,
    FS,
    loadLanguage,
    initialize,
    reinitialize,
    setParameters,
    recognize,
    recognize2,
    detect,
    terminate,
  };

  await ready;

  loadInternal()
    .then(() => loadLanguageInternal(langs))
    .then(() => initializeInternal(langs, oem, config))
    .then(() => workerResResolve(resolveObj))
    .catch(() => {});

  return workerRes;
};

// IndexedDB functions copied from the idb-keyval package to avoid adding a dependency.
// https://github.com/jakearchibald/idb-keyval
// Copyright 2016, Jake Archibald
// Licensed under the Apache License, Version 2.0

function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    // @ts-ignore - file size hacks
    request.oncomplete = request.onsuccess = () => resolve(request.result);
    // @ts-ignore - file size hacks
    request.onabort = request.onerror = () => reject(request.error);
  });
}
function createStore(dbName, storeName) {
  let dbp;
  const getDB = () => {
    if (dbp) return dbp;
    const request = indexedDB.open(dbName);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName);
    dbp = promisifyRequest(request);
    dbp.then((db) => {
      // It seems like Safari sometimes likes to just close the connection.
      // It's supposed to fire this event when that happens. Let's hope it does!
      db.onclose = () => (dbp = undefined);
    }, () => { });
    return dbp;
  };
  return (txMode, callback) => getDB()
    .then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
}
let defaultGetStoreFunc;
function defaultGetStore() {
  if (!defaultGetStoreFunc) {
    defaultGetStoreFunc = createStore('keyval-store', 'keyval');
  }
  return defaultGetStoreFunc;
}
/**
 * Get a value by its key.
 *
 * @param key
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function get(key, customStore = defaultGetStore()) {
  return customStore('readonly', (store) => promisifyRequest(store.get(key)));
}
/**
 * Set a value with a key.
 *
 * @param key
 * @param value
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function set(key, value, customStore = defaultGetStore()) {
  return customStore('readwrite', (store) => {
    store.put(value, key);
    return promisifyRequest(store.transaction);
  });
}

/**
 * Delete a particular key from the store.
 *
 * @param key
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function del(key, customStore = defaultGetStore()) {
  return customStore('readwrite', (store) => {
    store.delete(key);
    return promisifyRequest(store.transaction);
  });
}

export default {
  readCache: get,
  writeCache: set,
  deleteCache: del,
  checkCache: (path) => (
    get(path).then((v) => typeof v !== 'undefined')
  ),
};

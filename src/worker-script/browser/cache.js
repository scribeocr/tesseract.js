import { set, get, del } from 'idb-keyval';

export default {
  readCache: get,
  writeCache: set,
  deleteCache: del,
  checkCache: (path) => (
    get(path).then((v) => typeof v !== 'undefined')
  ),
};

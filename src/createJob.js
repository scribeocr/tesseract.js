import getId from './utils/getId.js';

let jobCounter = 0;

export default ({
  id: _id,
  action,
  payload = {},
  priorityJob = false,
}) => {
  let id = _id;
  if (typeof id === 'undefined') {
    id = getId('Job', jobCounter);
    jobCounter += 1;
  }

  return {
    id,
    action,
    payload,
    priorityJob,
  };
};

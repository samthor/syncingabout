

import build from '../index.js';


const runner = build('./test-task.js');

const result = runner(12345);
console.warn('got result', result);



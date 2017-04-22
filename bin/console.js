require('../platform');
const repl = require('repl').start({});
const promisify = require('repl-promised').promisify;
promisify(repl);
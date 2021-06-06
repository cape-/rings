const { parseArgv } = require('./util.js');
console.log(process.argv.length === 2 ?
    "Try with `node parseArgv_test.js camel-case --camel-case --camel case -xy -r 56 --pi 3.14 -t`" :
    parseArgv(process.argv)
);
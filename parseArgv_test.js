/** parseArgv() Demo 
 *  @author Lautaro Capella <laucape@gmail.com>
 */
const { parseArgv } = require('./util.js');
console.log(process.argv.length === 2 ?
    // If no args are provided: Print simple usage example
    "Try with `node parseArgv_test.js camel-case --camel-case --camel case -xy -r 56 --pi 3.14 -t`" :
    // Else run
    parseArgv(process.argv)
);
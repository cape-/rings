// import { v4 as uuidv4 } from 'uuid'; // BACKEND: Enable this
// import { v4 as uuidv4 } from 'https://jspm.dev/uuid'; // FRONTEND: Enable this

/**
 * Limits a string t to l caracters
 * @param {String} t The text string to limit
 * @param {Stringr} l Limit to
 * @returns 
 */
export const limitText = (t, l) => (l = l - 3) && t.length > l ? `${t.substr(0,t.lastIndexOf(' ',l) || l)}...` : t;

/**
 * Hashing function
 * @param {...Any} a String parameters to hash
 * @returns hash    hashed arguments
 */
// export const hashGenerator = function() { return Array.from(arguments).reduce((a, c) => a += c.length, 0); } // Naive version

/**
 * 6-char-long UID generator
 * @param {Int} uidlen UID Length in characters
 * @returns Generated UID
 */
export const uidGenerator = function(n = 6, date) {
    return (date || new Date()).valueOf().toString(36) +
        '-' +
        Array.from(Array(n).keys()).reduce(a => a + ("0" + ((Math.random() * 36) | 0).toString(36)).slice(-1), '');
}

/* function _collisionTest(maxN = 35000, generator) {
    var startNow = performance.now(),
        newhash = generator(),
        arr = [],
        i = 0,
        found;
    do {
        arr.push(newhash);
        newhash = generator();
        found = arr.indexOf(newhash) !== -1;
    } while (!found && ++i !== maxN)

    console.log(`Tested ${i} cases ${ found ? 'Duplicated FOUND!' : 'Did not found duplicated'}. Took ${(performance.now()-startNow)/1000} s.`)
}
_collisionTest(300000, hashGenerator); */
const oget = require('oget');

function arrayIncludes (results, filters) {
  return results.filter(item => {
    // tags:1, tags:2, tags:3
    return Object.keys(filters).some(key => {
      let arr = oget(item, key.replace(/@.*/, '')) || [];
      let hasObjOp = key.includes('@');
      let objPart = key.split('@')[1] || '';

      return arr.some(val => {
        const otherVal = filters[key];
        if (typeof val === 'object' && hasObjOp) {
          return String(oget(val, objPart)) === otherVal;
        } else {
          return String(val) === otherVal;
        }
      });
    });
  });
}

module.exports = arrayIncludes;

function onlyFilter (results, filter = '', prev = {}) {
  let filters = filter.split(',');
  results = results.map(item => {
    return filters.reduce((acc, f) => {
      f = f.split('.'); // tags.id
      let currentProp = f.shift(); // tags
      acc[currentProp] = item[currentProp]; // ret[tags]
      if (f.length) {
        acc[currentProp] = onlyFilter(acc[currentProp], f.join('.'));
      }

      return acc;
    }, {});
  });
  // flatten
  if (!filter.includes(',')) {
    results = results.map(obj => obj[filter]);
  }
  return results;
}

module.exports = onlyFilter;

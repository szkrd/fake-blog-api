function arraySum (results, filter = '', prev = {}) {
  let filters = filter.split(',');
  console.log(filters);
  results = results.map(item => {
    filters.forEach(filter => {
      if (Array.isArray(item[filter])) {
        item[filter] = item[filter].length;
      }
    });
    return item;
  });
  return results;
}

module.exports = arraySum;

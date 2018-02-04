// top-bottom inclusive
const rnd = (min, max) => Math.floor((Math.random() * (max - min + 1)) + min);

function shuffle (arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function uniqueRand (min, max, count) {
  let results = [];
  for (let i = min; i <= max; i++) {
    results.push(i);
  }
  return shuffle(results).slice(0, count);
}

module.exports = {
  uniqueRand
};

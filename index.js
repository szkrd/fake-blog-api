require('dotenv').config();

const fs = require('fs');
const path = require('path');
const oget = require('oget');
const jsonServer = require('json-server');
const includeTable = require('./src/include-table');
const onlyFilter = require('./src/only-filter');
const arraySum = require('./src/array-sum');
const arrayIncludes = require('./src/array-includes');

const port = +(process.env.PORT || 3000);
const sleepTimeout = (process.env.SLEEP || '0-0').split('-').map(x => ~~x);
if (sleepTimeout.length === 1) {
  sleepTimeout.push(sleepTimeout[0]);
}

const dbFile = 'db.json';
if (!fs.existsSync(dbFile)) {
  console.error(`No "${dbFile}" found.`);
  process.exit(1);
}

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, dbFile));
const middlewares = jsonServer.defaults();

server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

// store original query and route params, so that we
// can pick it up in the hijacked renderer
server.use('/:resource/:id*?', (req, res, next) => {
  req._saved = {
    query: Object.assign({}, req.query),
    params: Object.assign({}, req.params)
  };
  next();
});

router.render = (req, res) => {
  let results = res.locals.data;
  let savedQuery = oget(req, '_saved.query') || {};
  let includeText = oget(req, '_saved.query._include');
  let onlyText = oget(req, '_saved.query._only');
  let countText = oget(req, '_saved.query._count');
  let resource = oget(req, '_saved.params.resource');
  let hasResults = typeof results === 'object';
  let hasArrayIncludes = Object.keys(savedQuery).some(key => key.endsWith('_includes'));

  if (hasResults) {
    let multiple = Array.isArray(results);
    results = multiple ? results : [results];
    // many to many
    if (includeText) {
      results.forEach(result => includeTable(router.db, result, resource, includeText));
    }
    // shallow pick
    if (onlyText) {
      results = onlyFilter(results, onlyText);
    }
    // aggregate sum
    if (countText) {
      results = arraySum(results, countText);
    }
    // array includes
    if (hasArrayIncludes) {
      const filters = Object.keys(savedQuery)
        .filter(key => key.endsWith('_includes'))
        .reduce((acc, key) => {
          acc[key.replace(/_includes$/, '')] = savedQuery[key];
          return acc;
        }, {});
      results = arrayIncludes(results, filters);
    }
    if (!multiple) {
      results = results[0];
    }
  }

  if (!sleepTimeout) {
    res.jsonp(results);
  } else {
    const sDiff = sleepTimeout[1] - sleepTimeout[0];
    const to = sleepTimeout[0] + Math.floor(Math.random() * sDiff);
    setTimeout(() => res.jsonp(results), to);
  }
};

server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is listening on port ${port}`);
  if (sleepTimeout && !sleepTimeout.every(x => !x)) {
    const single = sleepTimeout[0] === sleepTimeout[1];
    const s0 = sleepTimeout[0] / 1000;
    const s1 = sleepTimeout[1] / 1000;
    if (single) {
      console.log(`Responses will be held back for ${s0}s`);
    } else {
      console.log(`Responses will be held back for ${s0}-${s1}s`);
    }
  }
});

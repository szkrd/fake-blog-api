require('dotenv').config();

const fs = require('fs');
const path = require('path');
const oget = require('oget');
const jsonServer = require('json-server');
const includeTable = require('./src/include-table');

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
  let includeText = oget(req, '_saved.query._include');
  let resource = oget(req, '_saved.params.resource');
  if (includeText && typeof results === 'object') {
    let multiple = Array.isArray(results);
    results = multiple ? results : [results];
    results.forEach(result => includeTable(router.db, result, resource, includeText));
    if (!multiple) {
      results = results[0];
    }
  }
  res.jsonp(results);
};

server.use(router);

const port = +(process.env.PORT || 3000);
server.listen(port, () => {
  console.log(`JSON Server is listening on port ${port}`);
});

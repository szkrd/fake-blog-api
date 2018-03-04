// copied here from json-server (sans the lodash chain wrapper)
const url = require('url');

function getPage (array, page, perPage) {
  let obj = {};
  let start = (page - 1) * perPage;
  let end = page * perPage;

  obj.items = array.slice(start, end);
  if (obj.items.length === 0) {
    return obj;
  }

  if (page > 1) {
    obj.prev = page - 1;
  }

  if (end < array.length) {
    obj.next = page + 1;
  }

  if (obj.items.length !== array.length) {
    obj.current = page;
    obj.first = 1;
    obj.last = Math.ceil(array.length / perPage);
  }

  return obj;
}

function getFullURL (req) {
  let root = url.format({
    protocol: req.protocol,
    host: req.get('host')
  });

  return `${root}${req.originalUrl}`;
}

function repaginate (req, res, chain, _start, _page, _end, _limit) {
  res.setHeader('X-Total-Count', chain.length);
  res.setHeader('Access-Control-Expose-Headers', `X-Total-Count${_page ? ', Link' : ''}`);

  if (_page) {
    _page = parseInt(_page, 10);
    _page = _page >= 1 ? _page : 1;
    _limit = parseInt(_limit, 10) || 10;
    let page = getPage(chain, _page, _limit);
    let links = {};
    let fullURL = getFullURL(req);

    if (page.first) {
      links.first = fullURL.replace(`page=${page.current}`, `page=${page.first}`);
    }

    if (page.prev) {
      links.prev = fullURL.replace(`page=${page.current}`, `page=${page.prev}`);
    }

    if (page.next) {
      links.next = fullURL.replace(`page=${page.current}`, `page=${page.next}`);
    }

    if (page.last) {
      links.last = fullURL.replace(`page=${page.current}`, `page=${page.last}`);
    }

    res.links(links);
    chain = page.items;
  } else if (_end) {
    _start = parseInt(_start, 10) || 0;
    _end = parseInt(_end, 10);
    chain = chain.slice(_start, _end);
  } else if (_limit) {
    _start = parseInt(_start, 10) || 0;
    _limit = parseInt(_limit, 10);
    chain = chain.slice(_start, _start + _limit);
  }
  return chain;
}

module.exports = repaginate;

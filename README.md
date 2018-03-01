# Fake blog API

So far this is a mix between two repositories:

1. [Blog Fake API](https://github.com/matheusazzi/blog-fake-api) - fixture generation
2. [JSON server many to many](https://github.com/jimschubert/json-server-many-to-many) -
   a wrapper around json-server to let it handle many to many relations

I'm using [json-server](https://github.com/typicode/json-server) now,
but this may change in the future. Probably graphql would be more logical.

## Usage

- `npm run create-fixtures` - generate random data, save to db.json
- `npm run dev` - run server, watch for changes
- `npm start` - fire up the wrapped json server

## .env

- `PORT` - port number, default is 3000
- `SLEEP` - sleep time in millisec before responding, default is 0
  - `SLEEP=2000` wait for 2s
  - `SLEEP=1000-3000` random timeout between 1s and 3s

## API examples

- users with paging -
  [/users?_limit=5&_page=1](http://localhost:3000/users?_limit=5&_page=1)
- posts with paging -
  [/posts?_page=1&_limit=5](http://localhost:3000/posts?_page=1&_limit=5)
- posts with date range -
  [/posts?createdAt_gte=1388302275352&createdAt_lte=1398302275352](http://localhost:3000/posts?createdAt_gte=1388302275352&createdAt_lte=1398302275352)
- all tags -
  [/tags](http://localhost:3000/tags)
- posts with tags included (junction table) -
  [/posts?_limit=5&_page=1&_include=tags](http://localhost:3000/posts?_limit=5&_page=1&_include=tags)
- categories -
  [/categories](http://localhost:3000/categories)
- profile -
  [/profile](http://localhost:3000/profile)
- post with category and user expanded -
  [/posts/1?_expand=category&_expand=user](http://localhost:3000/posts/1?_expand=category&_expand=user)
- posts' dates and ids only (shallow pick) -
  [/posts?_only=createdAt,id](http://localhost:3000/posts?_only=createdAt,id)
- posts' dates as an array -
  [/posts?_only=createdAt](http://localhost:3000/posts?_only=createdAt)
- tags with post count (cheap sum) -
  [/tags?_include=posts&_count=posts](http://localhost:3000/tags?_include=posts&_count=posts)
- posts that has the tag id#3 (object separator is @)
  [/posts?_limit=5&_page=1&tags@id_includes=2](http://localhost:3000/posts?_limit=5&_page=1&tags@id_includes=2)
  - tags is an array of objects (`[{id: 1, name: 'foo'}, {id: 2, name: 'bar'}]`)
  - for simple arrays omit the @: `tagIds: [1, 2, 3]` -> `&tagIds_includes=2`

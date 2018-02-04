# Fake blog API

So far this is a mix between two repositories:

1. [Blog Fake API](https://github.com/matheusazzi/blog-fake-api) - fixture generation
2. [JSON server many to many](https://github.com/jimschubert/json-server-many-to-many) -
   a wrapper around json-server to let it handle many to many relations

I'm using [json-server](https://github.com/typicode/json-server) now,
but this may change in the future.

## Usage

- `npm run create-fixtures` - generate random data, save to db.json
- `npm run dev` - run server, watch for changes
- `npm start` - fire up the wrapped json server

## API examples

- users with paging - `http://localhost:3000/users?_limit=5&_page=1`
- posts with paging - `http://localhost:3000/posts?_page=1&_limit=5`
- all tags - `http://localhost:3000/tags`
- posts with tags included - `http://localhost:3000/posts?_limit=5&_page=1&_include=tags` (no granularity, so tags.name will not work)
- categories - `http://localhost:3000/categories`
- profile - `http://localhost:3000/profile`
- post with category and user expanded - `http://localhost:3000/posts/1?_expand=category&_expand=user`

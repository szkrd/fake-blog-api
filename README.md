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
- posts with date range - `http://localhost:3000/posts?createdAt_gte=1388302275352&createdAt_lte=1398302275352`
- all tags - `http://localhost:3000/tags`
- posts with tags included (junction table) - `http://localhost:3000/posts?_limit=5&_page=1&_include=tags`
- categories - `http://localhost:3000/categories`
- profile - `http://localhost:3000/profile`
- post with category and user expanded - `http://localhost:3000/posts/1?_expand=category&_expand=user`
- posts' dates and ids only (shallow pick) `http://localhost:3000/posts?_only=createdAt,id`
- posts' dates as an array `http://localhost:3000/posts?_only=createdAt`

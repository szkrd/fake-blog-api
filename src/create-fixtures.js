const fs = require('fs');
const faker = require('faker');
const {uniqueRand} = require('./utils');

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
const rand = (min = 1, max = 5) => faker.random.number({min, max});

function seedUsers (quantity, data) {
  for (let i = 1; i <= quantity; i++) {
    let gender = faker.random.number({min: 1, max: 2});
    let firstName = faker.name.firstName(gender);
    let lastName = faker.name.lastName(gender);

    data.users.push({
      id: i,
      isAdmin: false,
      name: faker.name.findName(firstName, lastName, gender),
      username: faker.internet.userName(firstName, lastName),
      email: faker.internet.email(firstName, lastName).toLowerCase(),
      gender: gender,
      dateOfBirth: faker.date.past(55, new Date()),
      occupation: faker.name.jobTitle(),
      avatar: faker.internet.avatar()
    });
  }
}

function addAdmins (quantity, data) {
  uniqueRand(1, data.users.length - 1, quantity).forEach(i => {
    data.users[i].isAdmin = true;
  });
}

function seedCategories (quantity, data) {
  for (let i = 1; i <= quantity; i++) {
    data.categories.push({
      id: i,
      name: capitalize(faker.lorem.words(
        faker.random.number({min: 1, max: 2})
      ))
    });
  }
}

function seedTags (quantity, data) {
  let nouns = [];
  for (let i = 1; i <= quantity; i++) {
    nouns.push(faker.hacker.noun());
  }
  // probably less than required quantity
  [...new Set(nouns)].forEach((name, id) => data.tags.push({
    id,
    name,
    slug: name.replace(/\s/g, '-')
  }));
}

function seedPosts (quantity, data) {
  let admins = data.users.filter(u => u.isAdmin);
  for (let i = 1; i <= quantity; i++) {
    let title = capitalize(faker.lorem.words(rand(4, 8)));

    data.posts.push({
      id: i,
      title: title,
      createdAt: faker.date.past(5),
      body: faker.lorem.paragraphs(faker.random.number({min: 2, max: 12})),
      image: faker.image.image(),
      views: faker.random.number(1500),
      recommends: faker.random.number(50),
      userId: faker.random.number({min: 1, max: admins.length}),
      categoryId: faker.random.number({min: 1, max: data.categories.length})
    });
  }
}

function seedComments (quantity, data) {
  for (let i = 1; i <= quantity; i++) {
    data.comments.push({
      id: i,
      body: faker.lorem.sentences(faker.random.number({min: 1, max: 5})),
      userId: faker.random.number({min: 1, max: data.users.length}),
      postId: faker.random.number({min: 1, max: data.posts.length})
    });
  }
}

function seedProfile (data) {
  let bool = faker.random.boolean;
  data.profile = Object.assign({}, faker.random.arrayElement(data.users));
  Object.assign(data.profile, {
    shareProfile: bool(),
    showEmailAddress: bool(),
    homepageUrl: faker.internet.url(),
    introduction: faker.lorem.paragraph(),
    language: 'en',
    notificationsWeb: {
      mentions: bool(),
      likes: bool(),
      promotions: bool()
    },
    notificationsEmail: {
      mentions: bool(),
      likes: bool(),
      promotions: bool()
    }
  })
}

function connectPostsAndTags (maxTagsPerPost, data) {
  let posts = data.posts.map(p => ({
    id: p.id,
    tags: uniqueRand(1, data.tags.length, maxTagsPerPost)
  }));
  let id = 1;
  posts.forEach(p => {
    p.tags.forEach(t => {
      data.posts_tags.push({id: id++, postId: p.id, tagId: t});
    });
  });
}

function db () {
  let data = {
    users: [],
    categories: [],
    tags: [],
    posts: [],
    posts_tags: [],
    comments: [],
    profile: {}
  };

  seedUsers(50, data);
  addAdmins(5, data);
  seedCategories(10, data);
  seedPosts(150, data);
  seedTags(30, data);
  seedComments(300, data);
  seedProfile(data);
  connectPostsAndTags(7, data);

  return data;
}

module.exports = db;

if (require.main === module) {
  let result = db();
  fs.writeFileSync('./db.json', JSON.stringify(result, null, '  '), 'utf-8');
}

export default {
  users(parent, args, { db }) {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  posts(parent, args, { db }) {
    if (!args.query) {
      return db.posts;
    }
    return db.posts.filter((post) => {
      return post.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  comments(parent, args, { db }) {
    if (!args.query) {
      return db.comments;
    }
    return db.comments.filter((comment) => {
      return comment.text.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  add(parent, args, ctx, info) {
    if (args.numbers.length === 0) {
      return null;
    }
    return args.numbers.reduce((acc, currentValue) => {
      return acc + currentValue;
    });
  },
  grades(parent, args, ctx, info) {
    return [1, 2];
  },
};

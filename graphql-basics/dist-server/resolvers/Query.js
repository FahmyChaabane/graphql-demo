"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  users: function users(parent, args, _ref) {
    var db = _ref.db;

    if (!args.query) {
      return db.users;
    }

    return db.users.filter(function (user) {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  posts: function posts(parent, args, _ref2) {
    var db = _ref2.db;

    if (!args.query) {
      return db.posts;
    }

    return db.posts.filter(function (post) {
      return post.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  comments: function comments(parent, args, _ref3) {
    var db = _ref3.db;

    if (!args.query) {
      return db.comments;
    }

    return db.comments.filter(function (comment) {
      return comment.text.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  add: function add(parent, args, ctx, info) {
    if (args.numbers.length === 0) {
      return null;
    }

    return args.numbers.reduce(function (acc, currentValue) {
      return acc + currentValue;
    });
  },
  grades: function grades(parent, args, ctx, info) {
    return [1, 2];
  }
};
exports["default"] = _default;
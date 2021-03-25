"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  author: function author(parent, args, _ref) {
    var db = _ref.db;
    return db.users.find(function (user) {
      return user.id === parent.author;
    });
  },
  post: function post(parent, args, _ref2) {
    var db = _ref2.db;
    return db.posts.find(function (post) {
      return post.id === parent.post;
    });
  }
};
exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  author: function author(parent, args, _ref, info) {
    var db = _ref.db;
    return db.users.find(function (user) {
      return user.id === parent.author;
    });
  },
  comments: function comments(parent, args, _ref2) {
    var db = _ref2.db;
    return db.comments.filter(function (comment) {
      return comment.post === parent.id;
    });
  }
};
exports["default"] = _default;
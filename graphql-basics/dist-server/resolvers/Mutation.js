"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _uuid = require("uuid");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  createUser: function createUser(parent, args, _ref, info) {
    var db = _ref.db;
    var emailTaken = db.users.some(function (user) {
      return user.email === args.data.email;
    });
    if (emailTaken) throw new Error("Email is taken.");

    var user = _objectSpread({
      id: (0, _uuid.v4)()
    }, args.data);

    db.users.push(user);
    return user;
  },
  updateUser: function updateUser(parent, args, _ref2, info) {
    var db = _ref2.db;
    var id = args.id,
        data = args.data;
    var user = db.users.find(function (user) {
      return user.id === id;
    });
    if (!user) throw new Error("user id not found.");

    if (data.name) {
      //if(typeof data.name === "string")
      user.name = data.name;
    }

    if (data.email) {
      //if(typeof data.email === "string")
      var emailTaken = db.users.some(function (user) {
        return user.email === data.email;
      });
      if (emailTaken) throw new Error("Email is already taken.");
      user.email = data.email;
    }

    if (typeof data.age !== "undefined") user.age = data.age;
    return user;
  },
  deleteUser: function deleteUser(parent, args, _ref3, info) {
    var db = _ref3.db;
    // gonna be cleaned later
    var userIndex = db.users.findIndex(function (user) {
      return user.id === args.id;
    });
    if (userIndex === -1) throw Error("User not found");
    var deletedUser = db.users.splice(userIndex, 1);
    db.posts = db.posts.filter(function (post) {
      var match = post.author === args.id;

      if (match) {
        db.comments = db.comments.filter(function (comment) {
          return comment.post !== post.id;
        });
      }

      return !match;
    });
    db.comments = db.comments.filter(function (comment) {
      return comment.author !== args.id;
    });
    return deletedUser[0];
  },
  createPost: function createPost(parent, args, _ref4, info) {
    var db = _ref4.db,
        pubsub = _ref4.pubsub;
    var userFound = db.users.some(function (user) {
      return user.id === args.data.author;
    });
    if (!userFound) throw new Error("User not found.");

    var post = _objectSpread({
      id: (0, _uuid.v4)()
    }, args.data);

    db.posts.push(post);
    pubsub.publish("post", {
      post: {
        mutation: "CREATED",
        data: post
      }
    });
    return post;
  },
  updatePost: function updatePost(parent, args, _ref5, info) {
    var db = _ref5.db,
        pubsub = _ref5.pubsub;
    var id = args.id,
        data = args.data;
    var post = db.posts.find(function (post) {
      return post.id === id;
    });
    if (!post) throw new Error("Post id not found.");
    if (data.name) post.name = data.name;
    pubsub.publish("post", {
      post: {
        mutation: "UPDATED",
        data: post
      }
    });
    return post;
  },
  deletePost: function deletePost(parent, args, _ref6, info) {
    var db = _ref6.db,
        pubsub = _ref6.pubsub;
    var postIndex = db.posts.findIndex(function (post) {
      return post.id === args.id;
    });
    if (postIndex === -1) throw new Error("post not found");

    var _db$posts$splice = db.posts.splice(postIndex, 1),
        _db$posts$splice2 = _slicedToArray(_db$posts$splice, 1),
        deletedPost = _db$posts$splice2[0];

    db.comments = db.comments.filter(function (comment) {
      pubsub.publish("comment ".concat(deletedPost.id), {
        comment: {
          mutation: "DELETED",
          data: comment
        }
      });
      return comment.post !== args.id;
    });
    pubsub.publish("post", {
      post: {
        mutation: "DELETED",
        data: deletedPost
      }
    });
    return deletedPost;
  },
  createComment: function createComment(parent, args, _ref7, info) {
    var db = _ref7.db,
        pubsub = _ref7.pubsub;
    var userFound = db.users.some(function (user) {
      return user.id === args.data.author;
    });
    if (!userFound) throw new Error("User not found.");
    var postFound = db.posts.some(function (post) {
      return post.id === args.data.post;
    });
    if (!postFound) throw new Error("Post not found.");

    var comment = _objectSpread({
      id: (0, _uuid.v4)()
    }, args.data);

    db.comments.push(comment);
    pubsub.publish("comment ".concat(comment.post), {
      comment: {
        mutation: "CREATED",
        data: comment
      }
    });
    return comment;
  },
  updateComment: function updateComment(parent, args, _ref8, info) {
    var db = _ref8.db,
        pubsub = _ref8.pubsub;
    var id = args.id,
        data = args.data;
    var comment = db.comments.find(function (comment) {
      return comment.id === id;
    });
    if (!comment) throw new Error("Comment id not found.");
    if (data.text) comment.text = data.text;
    pubsub.publish("comment ".concat(comment.post), {
      comment: {
        mutation: "UPDATED",
        data: comment
      }
    });
    return comment;
  },
  deleteComment: function deleteComment(parent, args, _ref9, info) {
    var db = _ref9.db,
        pubsub = _ref9.pubsub;
    var commentIndex = db.comments.findIndex(function (comment) {
      return comment.id === args.id;
    });
    if (commentIndex === -1) throw new Error("comment not found");

    var _db$comments$splice = db.comments.splice(commentIndex, 1),
        _db$comments$splice2 = _slicedToArray(_db$comments$splice, 1),
        deletedComment = _db$comments$splice2[0];

    pubsub.publish("comment ".concat(deletedComment.post), {
      comment: {
        mutation: "DELETED",
        data: deletedComment
      }
    });
    return deletedComment;
  }
};
exports["default"] = _default;
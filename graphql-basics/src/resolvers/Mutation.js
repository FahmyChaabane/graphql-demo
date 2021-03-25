import { v4 as uuidv4 } from "uuid";

export default {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => {
      return user.email === args.data.email;
    });
    if (emailTaken) throw new Error("Email is taken.");
    const user = {
      id: uuidv4(),
      ...args.data,
    };
    db.users.push(user);
    return user;
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find((user) => {
      return user.id === id;
    });
    if (!user) throw new Error("user id not found.");
    if (data.name) {
      //if(typeof data.name === "string")
      user.name = data.name;
    }
    if (data.email) {
      //if(typeof data.email === "string")
      const emailTaken = db.users.some((user) => {
        return user.email === data.email;
      });
      if (emailTaken) throw new Error("Email is already taken.");
      user.email = data.email;
    }
    if (typeof data.age !== "undefined") user.age = data.age;

    return user;
  },
  deleteUser(parent, args, { db }, info) {
    // gonna be cleaned later
    const userIndex = db.users.findIndex((user) => {
      return user.id === args.id;
    });

    if (userIndex === -1) throw Error("User not found");
    const deletedUser = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;
      if (match) {
        db.comments = db.comments.filter((comment) => {
          return comment.post !== post.id;
        });
      }
      return !match;
    });

    db.comments = db.comments.filter((comment) => {
      return comment.author !== args.id;
    });

    return deletedUser[0];
  },
  createPost(parent, args, { db, pubsub }, info) {
    const userFound = db.users.some((user) => {
      return user.id === args.data.author;
    });
    if (!userFound) throw new Error("User not found.");
    const post = {
      id: uuidv4(),
      ...args.data,
    };
    db.posts.push(post);
    pubsub.publish("post", {
      post: {
        mutation: "CREATED",
        data: post,
      },
    });
    return post;
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const post = db.posts.find((post) => {
      return post.id === id;
    });
    if (!post) throw new Error("Post id not found.");
    if (data.name) post.name = data.name;

    pubsub.publish("post", {
      post: {
        mutation: "UPDATED",
        data: post,
      },
    });

    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => {
      return post.id === args.id;
    });
    if (postIndex === -1) throw new Error("post not found");
    const [deletedPost] = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter((comment) => {
      pubsub.publish(`comment ${deletedPost.id}`, {
        comment: {
          mutation: "DELETED",
          data: comment,
        },
      });
      return comment.post !== args.id;
    });

    pubsub.publish("post", {
      post: {
        mutation: "DELETED",
        data: deletedPost,
      },
    });

    return deletedPost;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const userFound = db.users.some((user) => {
      return user.id === args.data.author;
    });
    if (!userFound) throw new Error("User not found.");
    const postFound = db.posts.some((post) => {
      return post.id === args.data.post;
    });
    if (!postFound) throw new Error("Post not found.");
    const comment = {
      id: uuidv4(),
      ...args.data,
    };
    db.comments.push(comment);
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });

    return comment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const comment = db.comments.find((comment) => {
      return comment.id === id;
    });
    if (!comment) throw new Error("Comment id not found.");
    if (data.text) comment.text = data.text;

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment,
      },
    });

    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex((comment) => {
      return comment.id === args.id;
    });
    if (commentIndex === -1) throw new Error("comment not found");
    const [deletedComment] = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment,
      },
    });

    return deletedComment;
  },
};

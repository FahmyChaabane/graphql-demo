export default {
  author(parent, args, { db }, info) {
    return db.users.find((user) => {
      return user.id === parent.author;
    });
  },
  comments(parent, args, { db }) {
    return db.comments.filter((comment) => {
      return comment.post === parent.id;
    });
  },
};

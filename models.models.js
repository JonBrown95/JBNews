const db = require("./db/connection");

exports.getTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => result.rows);
};

exports.getArticle = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 400,
          msg: "ID not found",
        });
      }
      const article = result.rows[0];
      return article;
    });
};

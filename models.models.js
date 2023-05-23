const db = require("./db/connection");
const { checkArticleExists } = require("./db/seeds/utils");

const checkArticleIsValid = (article_id) => {
  return db.query(`SELECT COUNT(*) FROM articles WHERE article_id = $1`, [articleId])
}

exports.getTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => result.rows);
};

exports.getArticles = () => {
  return db
    .query(
      `SELECT 
  articles.author, 
  articles.title, 
  articles.article_id, 
  articles.topic, 
  articles.created_at, 
  articles.votes, 
  articles.article_img_url, 
  COUNT(comments.article_id) AS comment_count 
FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
GROUP BY 
  articles.author, 
  articles.title, 
  articles.article_id, 
  articles.topic, 
  articles.created_at, 
  articles.votes, 
  articles.article_img_url
ORDER BY articles.created_at DESC;`
    )
    .then((result) => result.rows);
};

exports.getArticle = (articleId) => {
  if (articleId < 1 || articleId > 99999999) {
    return Promise.reject({
      status: 400,
      msg: "Invalid input - Invalid article ID value",
    });
  }
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "ID not found",
        });
      }
      const article = result.rows[0];
      return article;
    });
};

exports.getComments = (articleId) => {
  const commentsQuery = db.query(
    `
    SELECT *
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `,
    [articleId]
  );

  const articleExistsQuery = db.query(
    `
    SELECT *
    FROM articles
    WHERE article_id = $1;
    `,
    [articleId]
  );

  return Promise.all([commentsQuery, articleExistsQuery]).then((result) => {
    const commentsRows = result[0];
    const articlesRows = result[1].rows[0];
    if (!articlesRows) {
      return Promise.reject({
        status: 404,
        msg: `Article ${articleId} does not exist`,
      });
    }
    return commentsRows.rows;
  });
};

exports.postComment = (comment) => {
  const { username, body, article_id } = comment;

  const articleExistsQuery = db.query(
    `SELECT * FROM articles WHERE article_id = $1;`,
    [article_id]
  );

  return articleExistsQuery
    .then((result) => {
      const articlesRows = result.rows[0];
      if (!articlesRows) {
        return Promise.reject({
          status: 404,
          msg: `Article ${article_id} does not exist`,
        });
      }

      return db.query(
        `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
        [username, body, article_id]
      );
    })
    .then((result) => result.rows[0]);
};

exports.updateArticle = (articleId, incVotes) => {
  if (articleId < 1 || articleId > 99999999) {
    return Promise.reject({
      status: 400,
      msg: "Invalid input - Invalid article ID value",
    });
  }

  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
      [incVotes, articleId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "ID not found",
        });
      }
      const updatedArticle = result.rows[0];
      return updatedArticle;
    });
};

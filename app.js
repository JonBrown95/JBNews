const express = require("express");

const {
  getAllTopics,
  getAllEndpoints,
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  addComment,
  patchArticleVotes,
} = require("./controllers.controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics);
app.get("/api/", getAllEndpoints);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", addComment);
app.patch("/api/articles/:article_id", patchArticleVotes)

app.use("*", (req, res, next) => {
  res.status(404).send({ msg: "Endpoint not found :(" });
});

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else if (err.code === "22P02") {
      res.status(400).send({ msg: "Bad request" });
    } else {
        console.log(err)
      res.status(500).send({ msg: "Internal server error" });
    }
  });

module.exports = app;

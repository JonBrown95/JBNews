const express = require("express");

const { getAllTopics, getAllEndpoints, getArticleById } = require("./controllers.controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics );
app.get("/api/", getAllEndpoints);
app.get("/api/articles/:article_id", getArticleById)

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    }
      else if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad request" });
      } else {
        res.status(500).send({ msg: 'internal server error'})
      }
    });

module.exports = app;
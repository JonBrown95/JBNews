const {
  getTopics,
  getArticles,
  getArticle,
  getComments,
  postComment,
} = require("./models.models");

const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

exports.getAllTopics = (req, res, next) => {
  getTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getAllEndpoints = (req, res, next) => {
  // Read file instead of inputting variable and outputting as JSON object
  fs.readFile("endpoints.json", (err, data) => {
    if (err) {
      return next(err);
    }
    const endpoints = JSON.parse(data.toString());
    res.status(200).send(endpoints);
  });
};

exports.getAllArticles = (req, res, next) => {
  getArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  getArticle(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  getComments(articleId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addComment = (req, res, next) => {
  const addedComment = req.body;
  const article_id = +req.params.article_id;

  addedComment.article_id = article_id;

  postComment(addedComment)
    .then((newComment) => {
      res.status(201).send({ comment: newComment });
    })
    .catch((err) => {
        next(err);
    });
};

const { getTopics, getArticles } = require("./models.models");
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
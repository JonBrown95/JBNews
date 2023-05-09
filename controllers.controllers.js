const { getTopics } = require("./models.models");
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
  fs.readFile("endpoints.json", (err, data) => {
    if (err) {
      return next(err);
    }
    const endpoints = JSON.parse(data.toString());
    res.status(200).send(endpoints);
  });
};

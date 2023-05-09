const { getTopics } = require("./models.models");

exports.getAllTopics = (req, res, next) => {
  getTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((error) => {
      next(error);
    });
};


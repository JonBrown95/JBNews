const express = require("express");
const { getAllTopics } = require("./controllers.controllers");
const app = express();



app.get("/api/topics", getAllTopics );

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
});

module.exports = app;
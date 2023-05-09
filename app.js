const express = require("express");
const { getAllTopics, getAllEndpoints } = require("./controllers.controllers");
const app = express();
app.use(express.json());



app.get("/api/topics", getAllTopics );
app.get("/api/", getAllEndpoints)

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
});

module.exports = app;
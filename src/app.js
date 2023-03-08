var express = require('express');
require("dotenv").config();
var app = express();

const PORT = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.send(`${process.env.MESSAGE}`);
});
app.listen(PORT, function () {
    console.log(`Example app listening on port ${PORT}!`);
});
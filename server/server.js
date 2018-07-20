const path = require('path');

const publicPath = path.join(__dirname, '../public');

const express = require('express');
const bodyParser = require('body-parser');

let app = express();

app.use(express.static(publicPath));

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.listen(3000, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = {app};
const path = require('path');
const express = require('express');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

// const bodyParser = require('body-parser');

let app = express();

app.use(express.static(publicPath));

// app.use(bodyParser.json());


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = {app};
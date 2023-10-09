//setup the express.js server
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('This is a starter server')
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});
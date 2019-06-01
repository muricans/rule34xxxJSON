const express = require('express');
const rule34 = require('../rule34');

const random = express.Router();

random.get('/', async (req, res) => {
    const info = await rule34(req);
    const randomPost = info.posts[Math.floor(Math.random() * info.posts.length)];
    res.send(randomPost);
});

module.exports = random;
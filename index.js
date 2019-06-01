const express = require('express');
const rule34 = require('./rule34');
const random = require('./route/random');

const app = express();

app.use('/random', random);

app.get('/', async (req, res) => {
    const info = await rule34(req);
    if (info.error) {
        res.status(404);
    }
    res.send(info);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
    setInterval(() => {
        console.log('ping');
    }, (60000 * 10));
});
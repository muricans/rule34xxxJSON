const express = require('express');
const rule34 = require('./rule34');
const random = require('./route/random');

const app = express();

app.use('/random', random);

app.get('/', async (req, res) => {
    const info = await rule34(req);
    res.send(info);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port: ${port}`));
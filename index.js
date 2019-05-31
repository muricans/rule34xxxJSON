const express = require('express');
const xmlParser = require('xml2json');
const snekfetch = require('snekfetch');

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
    if (!req.query.tags) {
        const {
            body,
        } = await snekfetch.get('https://rule34.xxx/index.php?page=dapi&s=post&q=index');
        const parsed = JSON.parse(xmlParser.toJson(body));
        const postArray = {
            postCount: parseInt(parsed.posts.count),
            posts: [],
        };
        for (let i = 0; i < parsed.posts.post.length; i++) {
            postArray.posts.push(parsed.posts.post[i]);
        }
        res.send(postArray);
    } else if (req.query.tags != null) {
        const {
            body,
        } = await snekfetch.get('https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=' + req.query.tags);
        const parsed = JSON.parse(xmlParser.toJson(body));
        const count = parseInt(parsed.posts.count);
        const postArray = {
            postCount: count,
            posts: [],
        };
        if (count === 1) {
            postArray.posts.push(parsed.posts.post);
        } else {
            for (let i = 0; i < parsed.posts.post.length; i++) {
                postArray.posts.push(parsed.posts.post[i]);
            }
        }
        res.send(postArray);
    }
});

app.listen(process.env.PORT || 80);
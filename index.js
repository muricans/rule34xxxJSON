const express = require('express');
const xmlParser = require('xml2json');
const https = require('https');

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
    const tag = req.query.tags ? '&tags=' + req.query.tags : '';
    const id = req.query.id ? '&id=' + req.query.id : '';
    const limit = req.query.limit ? '&limit=' + req.query.limit : '';
    const pid = req.query.pid ? '&pid=' + req.query.pid : '';
    console.log(tag + limit + pid + id);
    const requ = https.get('https://rule34.xxx/index.php?page=dapi&s=post&q=index' + tag + limit + pid + id, (resp) => {
        let chunks = [];
        resp.on('data', (chunk) => {
            chunks.push(chunk);
        });
        resp.on('end', () => {
            const body = Buffer.concat(chunks);
            const parsed = JSON.parse(xmlParser.toJson(body.toString()));
            if (!parsed.posts) {
                return res.send({
                    postCount: 0,
                    posts: [],
                    error: 'No posts were found.',
                });
            }
            const count = parseInt(parsed.posts.count);
            const postArray = {
                postCount: count,
                posts: [],
            };
            if (!parsed.posts.post) {
                return res.send(postArray);
            }
            if (count === 1) {
                postArray.posts.push(parsed.posts.post);
            } else {
                for (let i = 0; i < parsed.posts.post.length; i++) {
                    postArray.posts.push(parsed.posts.post[i]);
                }
            }
            res.send(postArray);
        });
    });
    requ.end();
});

app.listen(process.env.PORT || 3000);
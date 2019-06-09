/**
 * rule34 json data.
 * @typedef {Object} info
 * @property {number} postCount The amount of posts with specified tags.
 * @property {Object[]} posts The actual post data with specified tags.
 */
const https = require('https');
const xmlParser = require('xml2json');

/**
 * 
 * @param {string} tags The string of tags to split.
 * @returns {string} The tags in an array form.
 */
function splitTags(tags) {
    return tags.trim().split(' ');
}

/**
 * Handle requests for rule34
 * 
 * @param {Request} req The request to get queries from.
 * @returns {Promise<info>} JSON Object containing postCount and posts.
 */
async function handle(req) {
    return new Promise(resolve => {
        let query = '';
        query += req.query.tags ? '&tags=' + req.query.tags : '';
        query += req.query.id ? '&id=' + req.query.id : '';
        query += req.query.limit ? '&limit=' + req.query.limit : '';
        query += req.query.pid ? '&pid=' + req.query.pid : '';
        https.get('https://rule34.xxx/index.php?page=dapi&s=post&q=index' + query, (resp) => {
            const chunks = [];
            resp.on('data', (chunk) => {
                chunks.push(chunk);
            });
            resp.on('end', () => {
                const body = Buffer.concat(chunks);
                const parsed = JSON.parse(xmlParser.toJson(body.toString()));
                if (!parsed.posts) {
                    return resolve({
                        postCount: 0,
                        posts: [],
                        error: 'No posts were found. Try checking tags',
                    });
                }
                const count = parseInt(parsed.posts.count);
                const postArray = {
                    postCount: count,
                    posts: [],
                };
                if (!parsed.posts.post) {
                    return resolve(postArray);
                }
                if (count === 1) {
                    parsed.posts.post.tags = splitTags(parsed.posts.post.tags);
                    postArray.posts.push(parsed.posts.post);
                } else {
                    for (let i = 0; i < parsed.posts.post.length; i++) {
                        parsed.posts.post[i].tags = splitTags(parsed.posts.post[i].tags);
                        postArray.posts.push(parsed.posts.post[i]);
                    }
                }
                resolve(postArray);
            });
        }).end();
    });
}

module.exports = handle;
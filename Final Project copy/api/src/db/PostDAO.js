const db = require('./DBConnection.js');
const Post = require('./models/Post.js');

function getPosts() {
    return new Promise((resolve, reject) => {

        db.query('SELECT * FROM user_posts').then(({ results }) => {
            let posts = [];

            results.forEach((result) => {
                const post = new Post(result);
                posts.push(post.toJSON());
            });

            resolve(posts);
        })
            .catch(err => {
                reject({ code: 404, message: "Error Getting Posts: " + err });
            });
    });
}

function createPost(newPost) {
    return new Promise((resolve, reject) => {
        console.log(newPost);
        let userId = newPost.userId;
        let text = newPost.text;
        let date = new Date();

        db.query('INSERT INTO user_posts (user_id, post_datetime, post_text) VALUES (?, ?, ?)', [userId, date, text]).then(({ results }) => {
            if (results.affectedRows == 0) {
                reject("Could not create new post");
            }

            resolve({ id: results.insertId, userId, datetime: date, text });
        }).catch(err => {
            reject({ code: 500, message: "Error creating user: " + err });
        });
    })
}

// function getPostById(id) {
//     return new Promise((resolve, reject) => {

//         db.query('SELECT * FROM user_posts WHERE post_id=?', [id]).then(({ results }) => {
//             const post = new Post(results[0]);
//             if (post) { // we found our user
//                 resolve(post.toJSON());
//             }
//             else { // if no user with provided unityId
//                 reject({ code: 404, message: "Error fetching post" });
//             }
//         })
//             .catch(err => {
//                 reject({ code: 404, message: "No such post" });
//             });
//     });
// }

function deletePost(id) {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM user_posts WHERE post_id=?', [id])
            .then(({ results }) => {
                if (results.affectedRows === 0) {
                    reject({ code: 404, message: "No such post" });
                }
                resolve("Post deleted successfully.");
            }).catch(err => {
                reject({ code: 500, message: "Error deleting post: " + err });
            });
    });
}

module.exports = {
    getPosts,
    createPost, 
    deletePost
};




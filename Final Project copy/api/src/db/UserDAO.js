const db = require('./DBConnection.js');
const User = require('./models/User.js');
const crypto = require('crypto');

function getUsers() {
    return new Promise((resolve, reject) => {

        db.query('SELECT * FROM users').then(({ results }) => {
            let users = [];

            results.forEach((result) => {
                const user = new User(result);
                users.push(user.toJSON());
            });

            resolve(users);
        })
            .catch(err => {
                reject({ code: 404, message: "Error Getting Users: " + err });
            });
    });
}

function getUserByCredentials(username, password) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE usr_username=?', [username]).then(({ results }) => {
            const user = new User(results[0]);
            if (user) { // we found our user
                crypto.pbkdf2(password, user.salt, 100000, 64, 'sha512', (err, derivedKey) => {
                    if (err) { //problem computing digest, like hash function not available
                        reject({ code: 400, message: "Error: " + err });
                    }

                    const digest = derivedKey.toString('hex');
                    if (user.password == digest) {
                        resolve(user.toJSON());
                    }
                    else {
                        reject({ code: 401, message: "Invalid username or password" });
                    }
                });
            }
            else { // if no user with provided unityId
                reject({ code: 404, message: "Error fetching user" });
            }
        })
            .catch(err => {
                reject({ code: 404, message: "No such user" });
            });
    });

}

//Creates a user with the given unityId, admin statis, first name an last name.
function createUser(first_name, last_name, username, email, password, num_parks) {
    return new Promise((resolve, reject) => {
        getUsers().then((users) => {
            const user = users.find(user => user.username == username);

            if (!user) {
                const salt = crypto.randomBytes(32).toString("hex");

                crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
                    if (err) { //problem computing digest, like hash function not available
                        reject({ code: 400, message: "Error: " + err });
                    }

                    const userPass = derivedKey.toString('hex');

                    db.query('INSERT INTO users (usr_first_name, usr_last_name, usr_username, usr_email, usr_salt, usr_password, usr_num_parks) VALUES (?, ?, ?, ?, ?, ?, ?)', [first_name, last_name, username, email, salt, userPass, num_parks]).then(({ results }) => {
                        if (results.affectedRows == 0) {
                            reject("Could not create new account");
                        }

                        resolve({ id: results.insertId, first_name, last_name, username, email, num_parks });
                    }).catch(err => {
                        reject({ code: 500, message: "Error creating user: " + err });
                    });
                });
            }
            else {
                reject({ code: 406, message: "user name already exists" });
            }
        })

    });
}

function getUserByUserName(username) {
    return new Promise((resolve, reject) => {

        db.query('SELECT * FROM users WHERE usr_username=?', [username]).then(({ results }) => {
            const user = new User(results[0]);
            if (user) { // we found our user
                resolve(user.toJSON());
            }
            else { // if no user with provided unityId
                reject({ code: 404, message: "Error fetching user" });
            }
        })
            .catch(err => {
                reject({ code: 404, message: "No such user" });
            });
    });
}

function getUserById(id) {
    return new Promise((resolve, reject) => {

        db.query('SELECT * FROM users WHERE usr_id=?', [id]).then(({ results }) => {
            const user = new User(results[0]);
            if (user) { // we found our user
                resolve(user.toJSON());
            }
            else { // if no user with provided unityId
                reject({ code: 404, message: "Error fetching user" });
            }
        })
            .catch(err => {
                reject({ code: 404, message: "No such user" });
            });
    });
}

function deleteUser(username) {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM users WHERE usr_username=?', [username])
            .then(({ results }) => {
                if (results.affectedRows === 0) {
                    reject({ code: 404, message: "No such user" });
                }
                resolve("User deleted successfully.");
            }).catch(err => {
                reject({ code: 500, message: "Error deleting user: " + err });
            });
    });
}

function followUser(userId, followedId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM followers WHERE follower_id = ? AND followed_id = ?', [userId, followedId]).then((existingFollow) => {
            if (existingFollow.length > 0) {
                reject({ code: 406, message: 'User already followed' });
            }
            else {
                db.query('INSERT INTO followers (follower_id, followed_id) VALUES (?, ?)', [userId, followedId]).then((followData) => {
                    resolve("User followed successfully");
                }).catch((err) => {
                    reject({ code: 500, message: 'Error following user: ' + err });
                });
            }
        }).catch((err) => {
            reject({ code: 500, message: 'Error following user: ' + err });
        });
    });
}

// Unfollow a user
function unfollowUser(userId, followedId) {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM followers WHERE follower_id = ? AND followed_id = ?', [userId, followedId]).then((unfollowData) => {
            resolve("User unfollowed successfully");
        }).catch((err) => {
            reject({ code: 500, message: 'Error unfollowing user: ' + err });
        });
    });
}

function getFollowingList(userId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT u.* FROM users u INNER JOIN followers f ON u.usr_id = f.followed_id WHERE f.follower_id = ?', [userId]).then((followingList) => {
            // console.log(followingList);
            resolve(followingList);
        }).catch((err) => {
            reject({ code: 500, message: 'Error fetching following list: ' + err })
        });
    });
}

// Get the list of users who follow a specific user
function getFollowersList(userId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT u.* FROM users u INNER JOIN followers f ON u.usr_id = f.follower_id WHERE f.followed_id = ?', [userId]).then((followersList) => {
            // console.log(followersList);
            resolve(followersList);
        }).catch((err) => {
            reject({ code: 500, message: 'Error fetching followers list: ' + err })
        });
    });
}

function updateUser(userId, newData) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE users SET usr_first_name=?, usr_last_name=?, usr_username=? WHERE usr_id=?', 
        [newData.firstName, newData.lastName, newData.username, userId])
        .then(({ results }) => {
          if (results.affectedRows === 0) {
            reject({ code: 404, message: "No user found with the provided ID" });
          }
          resolve("User information updated successfully.");
        })
        .catch(err => {
          reject({ code: 500, message: "Error updating user information: " + err });
        });
    });
  }
function incrementParkVisited(userId) {
    return new Promise((resolve, reject) => {
        console.log("Incrementing park visited for user: " + userId);
        db.query('UPDATE users SET usr_num_parks = usr_num_parks + 1 WHERE usr_id = ?', [userId]).then((results) => {
            if (results.affectedRows === 0) {
                reject({ code: 404, message: "No such user" });
            }
            resolve("Park visited incremented successfully.");
        }).catch(err => {
            reject({ code: 500, message: "Error incrementing park visited: " + err });
        });
    });
}

module.exports = {
    getUsers,
    getUserByCredentials,
    createUser,
    getUserByUserName,
    getUserById,
    deleteUser,
    followUser,
    unfollowUser,
    getFollowersList,
    getFollowingList,
    updateUser,
    incrementParkVisited
};




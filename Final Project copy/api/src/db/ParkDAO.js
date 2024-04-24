const db = require('./DBConnection');

function getVisitedParks(userId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT park_id FROM user_visited_parks WHERE user_id = ?', [userId])
            .then(({ results }) => {
                resolve(results);
            })
            .catch(err => {
                reject(new Error("Error fetching visited parks: " + err));
            });
    });
}

function markParkVisited(userId, parkId) {
    console.log(userId);
    return new Promise((resolve, reject) => {
        // Check if the park is already marked as visited by the user
        db.query('SELECT COUNT(*) AS count FROM user_visited_parks WHERE user_id = ? AND park_id = ?', [userId, parkId])
            .then(({ results }) => {
                if (results[0].count > 0) {
                    reject(new Error('Park already marked as visited by the user'));
                } else {
                    // If not visited, insert a record into user_visited_parks table
                    db.query('INSERT INTO user_visited_parks (user_id, park_id) VALUES (?, ?)', [userId, parkId])
                        .then(() => {
                            resolve(true); // Successfully marked as visited
                        })
                        .catch(err => {
                            reject(new Error("Error marking park visited: " + err));
                        });
                }
            })
            .catch(err => {
                reject(new Error("Error checking if park is visited: " + err));
            });
    });
}

module.exports = {
    getVisitedParks,
    markParkVisited
};

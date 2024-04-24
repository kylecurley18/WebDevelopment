const axios = require('axios');
const express = require('express');
const cookieParser = require('cookie-parser');
const API_SECRET_NPS_PARK = process.env.API_SECRET_NPS_PARK;
const apiRouter = express.Router();
apiRouter.use(express.json());
apiRouter.use(cookieParser());

const { TokenMiddleware, generateToken, removeToken } = require('./middleware/TokenMiddleware.js');

const UserDAO = require('./db/UserDAO.js');
const parkDAO = require('./db/ParkDAO.js');
const PostDAO = require('./db/PostDAO.js');

const { users, parks } = require('./db/data/data.js');

const isValidEmail = (email) => {
    // Regular expression for validating email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPassword = (password) => {
    // Regular expression for validating passwords based on length only
    const passwordRegex = /^.{8,}$/;
    return passwordRegex.test(password);
};

const isValidUsername = (username) => {
    // Regular expression for validating usernames
    const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
    return usernameRegex.test(username);
};

const isValidName = (name) => {
    // Regular expression for validating names
    const nameRegex = /^[a-zA-Z\s]{1,50}$/;
    return nameRegex.test(name);
};

// Check if it works
apiRouter.get('/', (req, res) => {
    res.json({ your_api: 'it works' });
});

// Rough draft of what the register route will look like
apiRouter.post('/register', (req, res) => {

    if (req.body.username && req.body.first_name && req.body.last_name && req.body.password && req.body.email) {
        if (!isValidEmail(req.body.email)) {
            return res.status(400).send('Invalid email address.');
        }
        if (!isValidUsername(req.body.username)) {
            return res.status(400).send('Invalid username.');
        }
        if (!isValidName(req.body.first_name)) {
            return res.status(400).send('Invalid first name.');
        }
        if (!isValidName(req.body.last_name)) {
            return res.status(400).send('Invalid last name.');
        }
        if (!isValidPassword(req.body.password)) {
            return res.status(400).send('Invalid password.');
        }
        UserDAO.createUser(req.body.first_name, req.body.last_name, req.body.username, req.body.email, req.body.password, 0).then(user => {
            let result = {
                user: user
            }

            res.json(result);
        }).catch(err => {
            console.log(err);
            res.status(err.code).json(err.message);
        });
    }
    else {
        res.status(500).json({ error: 'Error creating user' });
    }
});

// Rough draft of what the login route will look like
apiRouter.post('/login', (req, res) => {
    //console.log("Login");
    //console.log(req.body);

    if (req.body.username && req.body.password) {
        UserDAO.getUserByCredentials(req.body.username, req.body.password).then(user => {
            let result = {
                user: user
            }

            generateToken(req, res, user);

            res.json(result);
        }).catch(err => {
            console.log(err);
            res.status(err.code).json(err.message);
        });
    }
    else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

apiRouter.post('/logout', (req, res) => {
    removeToken(req, res);

    res.json({ success: true });
});

//get current user
apiRouter.get('/users/current', TokenMiddleware, (req, res) => {
    res.json(req.user);
});

// Get all users
apiRouter.get('/users', TokenMiddleware, (req, res) => {
    UserDAO.getUsers().then((users) => {
        res.json(users);
    }).catch(err => {
        res.status(err.code).json(err.message);
    })
});

//Get specific user by id
apiRouter.get('/users/id/:userId', TokenMiddleware, (req, res) => {
    let id = parseInt(req.params.userId);

    UserDAO.getUserById(id).then((user) => {
        res.json(user);
    }).catch(err => {
        res.status(err.code).json(err.message);
    })
});

apiRouter.put('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { firstName, lastName, username } = req.body;
  
    try {
      // Call the function in UserDAO to update user information
      await UserDAO.updateUser(userId, { firstName, lastName, username });
      res.status(200).send('User information updated successfully');
    } catch (error) {
      res.status(error.code || 500).send(error.message);
    }
  });

apiRouter.post('/users/id/:userId/follow', TokenMiddleware, (req, res) => {
    const userId = req.params.userId;
    const followedId = req.body.userId;

    UserDAO.followUser(userId, followedId).then((followData) => {
        res.status(200).json('User followed successfully');
    }).catch((err) => {
        res.status(500).json(err.message);
    });
});

// Unfollow a user
apiRouter.delete('/users/id/:userId/unfollow/:followedId', TokenMiddleware, (req, res) => {
    const userId = req.params.userId;
    const followedId = req.params.followedId;
    //console.log(req.params)

    UserDAO.unfollowUser(userId, followedId).then((unfollowData) => {
        res.status(200).json('User unfollowed successfully');
    }).catch((err) => {
        res.status(500).json(err.message);
    });
});

// Get the list of users followed by a specific user
apiRouter.get('/users/id/:userId/following', TokenMiddleware, (req, res) => {
    const userId = req.params.userId;

    UserDAO.getFollowingList(userId).then((followingList) => {
        const usernames = followingList.results.map(user => user.usr_username);
        res.status(200).json({ following: usernames });
    }).catch((err) => {
        res.status(500).json(err.message);
    });
});

// Get the list of users who follow a specific user
apiRouter.get('/users/id/:userId/followers', TokenMiddleware, (req, res) => {
    const userId = req.params.userId;

    UserDAO.getFollowersList(userId).then((followersList) => {
        const usernames = followersList.results.map(user => user.usr_username);
        res.status(200).json({ followers: usernames });
    }).catch((err) => {
        res.status(500).json(err.message);
    });
});


// Get a User's Visited Parks
apiRouter.get('/users/id/:userId/visited', TokenMiddleware, (req, res) => {
    const { userId } = req.params;

    // Check if both user and friend exist
    if (!users[userId]) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json({ parksVisited: users[userId].parksVisited });
});

//Get specific user by username
apiRouter.get('/users/usr/:username', TokenMiddleware, (req, res) => {
    let username = req.params.username;

    UserDAO.getUserByUserName(username).then((user) => {
        res.json(user);
    }).catch(err => {
        res.status(err.code).json(err.message);
    })
});


// Get all posts
apiRouter.get('/posts', TokenMiddleware, (req, res) => {
    PostDAO.getPosts().then((posts) => {
        res.json(posts);
    }).catch(err => {
        res.status(err.code).json(err.message);
    })
});

// Create a new post
apiRouter.post('/posts', TokenMiddleware, (req, res) => {
    PostDAO.createPost(req.body).then((post) => {
        res.json(post);
    }).catch(() => {
        res.status(500).json({ error: 'Internal server error' });
    });
});

// Create a new post
apiRouter.delete('/posts/:postId', TokenMiddleware, (req, res) => {
    PostDAO.deletePost(req.params.postId).then((postData) => {
        res.json(postData);
    }).catch(() => {
        res.status(500).json({ error: 'Internal server error' });
    });
});

apiRouter.get('/parks/:parkId', TokenMiddleware, (req, res) => {
    const park = parks[req.params.parkId];
    if (park) {
        res.json(park);
    }
    else {
        res.status(404).json({ error: "Park not found1" });
    }
});

// Get all parks
apiRouter.get('/parks', TokenMiddleware, (req, res) => {
    res.json(Object.values(parks));
});

apiRouter.get('/national-parks', async (req, res) => {
    try {
        const response = await axios.get('https://developer.nps.gov/api/v1/parks', {
            params: {
                api_key: API_SECRET_NPS_PARK
            }
        });
        const parks = response.data.data;
        res.json(parks);
    } catch (error) {
        console.error('Error fetching parks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//getting latitude and longitude for a park
apiRouter.get('/national-parks/lat-long', TokenMiddleware, async (req, res) => {
    try {
        const response = await axios.get('https://developer.nps.gov/api/v1/parks', {
            params: {
                api_key: API_SECRET_NPS_PARK
            }
        });

        const parks = response.data.data;

        // Extracting latitude and longitude from the first park in the array
        const firstPark = parks[0];
        const latitude = firstPark.latitude;
        const longitude = firstPark.longitude;
        res.json({ latitude, longitude });
    } catch (error) {
        console.error('Error fetching latitude and longitude:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// Get a specific park by parkId
http://localhost:3000/api/national-parks/A21F01BC-9E47-4DBE-8655-A1651FC2C1B1
apiRouter.get('/national-parks/:parkId', TokenMiddleware, async (req, res) => {
    const parkId = req.params.parkId;
    try {
        const response = await axios.get(`https://developer.nps.gov/api/v1/parks`, {
            params: {
                api_key: API_SECRET_NPS_PARK
            }
        });

        const parkData = response.data.data;
        // Find the park with the provided parkId
        const park = parkData.find(park => park.id === parkId);
        if (!park) {
            // Park not found
            return res.status(404).json({ error: 'Park not found2' });
        }

        res.json(park);
    } catch (error) {
        // console.error('Error fetching park information:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Get the latitude and longitude from a  specific park by parkId
//http://localhost:3000/api/national-parks/A21F01BC-9E47-4DBE-8655-A1651FC2C1B1/latlong
apiRouter.get('/national-parks/:parkId/latlong', TokenMiddleware, async (req, res) => {
    const parkId = req.params.parkId;
    try {
        const response = await axios.get(`https://developer.nps.gov/api/v1/parks`, {
            params: {
                api_key: API_SECRET_NPS_PARK
            }
        });

        const parkData = response.data.data;
        // Find the park with the provided parkId
        const park = parkData.find(park => park.id === parkId);
        if (!park) {
            // Park not found
            return res.status(404).json({ error: 'Park not found3' });
        }
        const latitude = park.latitude;
        const longitude = park.longitude;
        res.json({ latitude, longitude });
    } catch (error) {
        // console.error('Error fetching park information:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

apiRouter.post('/national-parks/:parkId/track', TokenMiddleware, async (req, res) => {
    const parkId = req.params.parkId;
    const userId = req.body.userId;
    //console.log(req.body);
    //console.log(userId);

    try {
        // Mark park as visited
        await parkDAO.markParkVisited(userId, parkId);
        res.status(200).json({ message: 'Park tracked successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

apiRouter.get('/users/:userId/visited-parks', TokenMiddleware, async (req, res) => {
    const userId = req.params.userId;

    try {
        // Get visited parks for user
        const visitedParks = await parkDAO.getVisitedParks(userId);
        res.status(200).json(visitedParks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//get the list of all national parks
apiRouter.get('/national-parks-list/name', TokenMiddleware, async (req, res) => {
    try {
        const response = await axios.get('https://developer.nps.gov/api/v1/parks', {
            params: {
                api_key: API_SECRET_NPS_PARK
            }
        });

        const parks = response.data.data;

        // Extracting names of all parks
        const parkNames = parks.map(park => park.fullName);

        res.json(parkNames);
    } catch (error) {
        console.error('Error fetching park names:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//gets the list of all national parks with their latitute and longitude
apiRouter.get('/national-parks-list/details', TokenMiddleware, async (req, res) => {
    try {
        const response = await axios.get('https://developer.nps.gov/api/v1/parks', {
            params: {
                api_key: API_SECRET_NPS_PARK

            }
        });

        const parks = response.data.data;
//console.log("parks", parks);
        // Extracting names and coordinates of all parks
        const parkDetails = parks.map(park => ({
            fullName: park.fullName,
            latitude: park.latitude,
            longitude: park.longitude,
            id: park.id
        }));

        res.json(parkDetails);
    } catch (error) {
        console.error('Error fetching park details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Mark a park as visited
apiRouter.post('/national-parks-list/:parkId/visit', async (req, res) => {
    const parkId = req.params.parkId;
    const userId = req.body.userId;
   // console.log("parkId", parkId);
    //console.log("userId", userId);
    try {
        // Mark park as visited
        await parkDAO.markParkVisited(userId, parkId);
        await UserDAO.incrementParkVisited(userId);
        res.status(200).json({ message: 'Park visited successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




module.exports = apiRouter;


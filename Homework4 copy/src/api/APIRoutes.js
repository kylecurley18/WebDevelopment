const express = require('express');
const apiRouter = express.Router();
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const users = require(path.join(__dirname, 'db/data/users.json')); // Correct path for users.json
const howls = require(path.join(__dirname, 'db/data/howls.json'));
const follows = require(path.join(__dirname, 'db/data/follows.json'));

apiRouter.use(express.json());

apiRouter.use(session({
    secret: '123456',
    resave: false,
    saveUninitialized: true
  }));


apiRouter.post('/login', (req, res) => {
    const { username } = req.body;
    const user = Object.values(users).find(user => user.username === username);
    if (user) {
      req.session.userId = user.id;
      res.status(200).json({ redirectUrl: '/home' }); // Redirect to main.html upon successful authentication
    } else {
      res.status(401).json({ message: 'Invalid username' });
    }
  });
  

apiRouter.get('/current-user', (req, res) => {
    const userId = req.session.userId;
    if (userId) {
        const user = Object.values(users).find(user => user.id === userId);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});


apiRouter.post('/howls', (req, res) => {
    const { text, datetime, username, avatar } = req.body;

    // Validate request body
    if (!text ||  !datetime || !username || !avatar) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a new howl object
    const newHowl = {
        id: howls.length + 1,
        text,
        datetime,
        username,
        avatar  
    };

    // Add the new howl to the list of howls
    howls.unshift(newHowl);

    // Respond with the newly created howl
    res.status(201).json(newHowl);
});


// Getting howls posted by a specific user
apiRouter.get('/users/:userId/howls', (req, res) => {
const userId = parseInt(req.params.userId);
const userHowls = howls.filter(howl => howl.userId === userId);
res.json(userHowls);
});

// Getting howls posted by all users followed by the authenticated user
apiRouter.get('/followed-howls', (req, res) => {
const userId = req.session.userId;
const followedUsers = follows[userId].following;
const followedHowls = howls.filter(howl => followedUsers.includes(howl.userId));
res.json(followedHowls);
});

// Getting a specific user's object
apiRouter.get('/users/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = Object.values(users).find(user => user.id === userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});


// Getting the list of users followed by a specific user
apiRouter.get('/users/:userId/following', (req, res) => {
const userId = parseInt(req.params.userId);
const following = follows[userId].following;
res.json(following);
});

// Following a user
apiRouter.post('/users/:userId/follow', (req, res) => {
    const userId = parseInt(req.params.userId);
    const loggedInUserId = req.user.id;

    // Find the entry for the current user in follows.json
    const userFollows = follows[loggedInUserId];
    if (userFollows) {
        // Add userId to the following array
        userFollows.following.push(userId);
        // Save the updated follows.json file
        fs.writeFileSync(path.join(__dirname, 'db/data/follows.json'), JSON.stringify(follows));
        res.json({ message: 'User followed successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Unfollow a user
apiRouter.post('/users/:userId/unfollow', (req, res) => {
    const userId = parseInt(req.params.userId);
    const loggedInUserId = req.user.id;

    // Find the entry for the current user in follows.json
    const userFollows = follows[loggedInUserId];
    if (userFollows) {
        // Remove userId from the following array
        userFollows.following = userFollows.following.filter(id => id !== userId);
        // Save the updated follows.json file
        fs.writeFileSync(path.join(__dirname, 'db/data/follows.json'), JSON.stringify(follows));
        res.json({ message: 'User unfollowed successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = apiRouter;

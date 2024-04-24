const express = require('express');

const frontendRouter = express.Router();

// Designate the static folder as serving static resources
frontendRouter.use(express.static(__dirname + '/static'));
frontendRouter.use(express.urlencoded({ extended: true }));

const html_dir = __dirname + '/templates/';


/** FRONTEND ROUTES */
frontendRouter.get('/', (req, res) => {
    res.sendFile(`${html_dir}home.html`);
});

frontendRouter.get('/login', (req, res) => {
    res.sendFile(`${html_dir}/login.html`);
});

frontendRouter.get('/register', (req, res) => {
    res.sendFile(`${html_dir}/register.html`);
});

frontendRouter.get('/home', (req, res) => {
    res.sendFile(`${html_dir}home.html`);
});


frontendRouter.get('/community', (req, res) => {
    res.sendFile(`${html_dir}community.html`);
});


frontendRouter.get('/social', (req, res) => {
    res.sendFile(`${html_dir}social.html`);
});

frontendRouter.get('/addfriends', (req, res) => {
    res.sendFile(`${html_dir}addfriends.html`);
});


frontendRouter.get('/progress', (req, res) => {
    res.sendFile(`${html_dir}progress.html`);
});

frontendRouter.get('/profile', (req, res) => {
    res.sendFile(`${html_dir}profile.html`);
});

module.exports = frontendRouter;
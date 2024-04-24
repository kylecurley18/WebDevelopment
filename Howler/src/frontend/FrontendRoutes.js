const express = require('express');
const frontendRouter = express.Router();
const path = require('path');

// Designate the static folder as serving static resources
frontendRouter.use('/static' , express.static('static'));

const html_dir = path.join(__dirname, '../../templates/');

frontendRouter.get('/', (req, res) => {
  res.sendFile(`${html_dir}login.html`);
});

frontendRouter.get('/home', (req,  res) => {
  res.sendFile(`${html_dir}home.html`);
});

frontendRouter.get('/profile', (req, res) => {
  res.sendFile(`${html_dir}profile.html`);
});

module.exports = frontendRouter;
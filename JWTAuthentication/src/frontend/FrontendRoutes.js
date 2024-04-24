const express = require('express');
const frontendRouter = express.Router();

const path = require('path');
// Designate the static folder as serving static resources
frontendRouter.use(express.static('static'));
frontendRouter.use(express.urlencoded({extended: true}));
const html_dir = path.join(__dirname, '../../templates/');

/*****************\
* FRONTEND ROUTES *
\*****************/

frontendRouter.get('/', (req, res) => {
  res.sendFile(`${html_dir}index.html`);
});

frontendRouter.get('/park', (req,  res) => {
  res.sendFile(`${html_dir}park.html`);
});


frontendRouter.get('/error', (req, res) => {
  res.sendFile(`${html_dir}error.html`);
});

frontendRouter.get('/login', (req,  res) => {
  res.sendFile(`${html_dir}login.html`);
});

module.exports = frontendRouter;
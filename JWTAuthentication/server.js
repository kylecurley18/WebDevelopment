const express = require('express');

const app = express();
const PORT = 80;

const routes = require('./src/routes');
app.use(routes);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
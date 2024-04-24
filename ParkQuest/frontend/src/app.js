const express = require('express');

const app = express();
const PORT = process.env.PORT || 80;

const frontendRouter = require('./FrontendRoutes.js');
app.use(frontendRouter);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
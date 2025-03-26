/**
 * Entry point of the server application.
 *
 * Sets up the Express server, loads routes, and listens for incoming requests.
 * All API routes are prefixed with /api.
 *
 * Port:
 * - 3000 (default)
 */

const express = require('express');
const app = express();
const routes = require('./routes/admissionsRoutes');

app.use(express.json());
app.use('/api', routes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

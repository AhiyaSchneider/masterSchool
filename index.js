const express = require('express');
const app = express();
const routes = require('./routes/admissionsRoutes');

app.use(express.json());
app.use('/api', routes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

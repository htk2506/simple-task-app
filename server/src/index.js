/**
 * Main entry point for starting up the Express server.
 */

require('dotenv').config();
const app = require('./routes/app');

console.log(`NODE_ENV: ${process.env.NODE_ENV}`)

// Start the server
const serverPort = process.env.SERVER_PORT || 5000;
app.listen(serverPort, () => {
    console.log(`Server started on port ${serverPort}`)
});
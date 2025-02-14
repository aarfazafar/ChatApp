const http = require('http');
const port = process.env.PORT || 3000;
const app = require('./app');

http.createServer(app).listen(port, () => {
    console.log(`Listening on port ${port}`);
});
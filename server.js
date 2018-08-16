const http = require('http');
const app = require('./app');


server  = http.createServer(app);

server.listen(8080);
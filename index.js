const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 3000; 

//Creating server to route all request to app file
const server = http.createServer(app); 

server.listen(PORT, () => { console.log('listening on port 3000');});
// Call the async function

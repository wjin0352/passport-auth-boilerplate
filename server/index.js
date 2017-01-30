// main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// db setup
mongoose.connect('mongodb://localhost:auth/auth');


// app setup (setting up middleware in express)
app.use(morgan('combined')); // loggin incoming requests, use for debugging
app.use(bodyParser.json({ type: '*/*' })); // parses incoming requests, any request will be parsed as json
router(app);


// server setup (getting app to talk to outside world)
const port = process.env.PORT || 3000;
const server = http.createServer(app); // creates an http server that knows how to receive requests and anything that comes in forward to our express application adding functionality over time.
server.listen(port);
console.log('server listening on ', port);

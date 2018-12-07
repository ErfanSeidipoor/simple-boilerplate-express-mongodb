// Main starting point of application


const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const router = require('./router');
const mongoose = require('mongoose');


// DB Setup
mongoose.connect('mongodb://127.0.0.1:27017/auth', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
// App Setup
const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json({ type:'*/*'}));
router(app);

// server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log(' Server listening on -x-:',port)


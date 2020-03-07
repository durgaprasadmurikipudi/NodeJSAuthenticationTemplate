// Main starting up point of the application
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';

import router from './router.js';

// DB Setup
mongoose.connect('mongodb://localhost:27017/auth', { useNewUrlParser: true});

const app = express();

// APP setup
app.use(morgan('combined'));
app.use(bodyParser.json());
router(app);

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);


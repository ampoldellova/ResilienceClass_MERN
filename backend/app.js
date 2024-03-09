const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const auth = require('./routes/auth');
const classRoom = require('./routes/class');
const posts = require('./routes/post');
const classwork = require('./routes/classwork');
const modules = require('./routes/module')

// app.use(cors())
const corsOptions = {
    origin: 'http://localhost:3000', //included origin as true
    credentials: true, //included credentials as true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use('/api/v1', auth);
app.use('/api/v1', classRoom);
app.use('/api/v1', posts);
app.use('/api/v1', classwork);
app.use('/api/v1', modules);

module.exports = app
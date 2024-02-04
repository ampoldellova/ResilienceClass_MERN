const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const auth = require('./routes/auth');
const classRoom = require('./routes/class');

app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use('/api/v1', auth);
app.use('/api/v1', classRoom);

module.exports = app
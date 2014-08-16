var mongoose = require('mongoose');

mongoose.connect('localhost:27017/quiz');

module.exports = mongoose.connection;
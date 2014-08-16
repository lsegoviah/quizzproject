var mongoose = require('mongoose');

mongoose.connect('mongodb://tester:tester123@ds035137.mongolab.com:35137/trendsettr');

module.exports = mongoose.connection;
var monk = require('monk');

var db = monk('localhost:27017/quiz');

module.exports = db;
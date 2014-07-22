var express = require('express');
var router = express.Router();
var http = require('http');
var new_user_meta = {classes:[{value:14},{value:32},{value:47}],
		races:[{value:0},{value:1},{value:2},{value:3}],
		levels:[{value:0}],
		spells:[{value:2},{value:3},{value:4},{value:8},{value:11}],
		upgrades:[{id:1,level:0},{id:2,level:0},{id:3,level:0},
		{id:4,level:0},{id:5,level:0},{id:6,level:0},
		{id:7,level:0},{id:8,level:0},{id:9,level:0},
		{id:10,level:0},{id:11,level:0},{id:12,level:0},
		{id:13,level:0},{id:14,level:0},{id:15,level:0},
		{id:16,level:0},{id:17,level:0}],
		player_assets:[{exp:0,honor:0,gold:0,deaths:0,kills:0}],
		history:[],
		custom_character_items:[],
		current_custom_character:[]};

var text_user_meta = {classes:[{value:14},{value:32},{value:47}],
		races:[{value:0},{value:1},{value:2},{value:3}],
		levels:[{value:0}],
		spells:[{value:2},{value:3},{value:4},{value:8},{value:11}],
		upgrades:[{id:1,level:0},{id:2,level:0},{id:3,level:0},
		{id:4,level:0},{id:5,level:0},{id:6,level:0},
		{id:7,level:0},{id:8,level:0},{id:9,level:0},
		{id:10,level:0},{id:11,level:0},{id:12,level:0},
		{id:13,level:0},{id:14,level:0},{id:15,level:0},
		{id:16,level:0},{id:17,level:0}],
		player_assets:[{exp:10000000,honor:75,gold:10000,deaths:1,kills:31}],
		history:[{completed:true,score:11056,player_class:14,player_level:0}],
		custom_character_items:[],
		current_custom_character:[]};

/* GET users listing. */
router.get('/', function(req, res) {
	var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.param('username');
    var userEmail = req.param('email');

    // Set our collection
    var collection = db.get('user');
    
    collection.find({username: userName,email: userEmail},{},function(e,docs){
        res.render('singleuser', {"userlist" : docs});
    });
});

router.get('/get', function(req, res) {
	
	// Set our collection
	var db = req.db;
    
    var collection = db.get('quest');
    
    var username = req.param('name');
    var useremail = req.param('email');
    
    collection.find({username:username, email:useremail},{},function(e,docs){
    	res.setHeader('Content-Type', 'application/json');
    	var meta = JSON.stringify(docs[0].meta).replace(/"/g, '');
    	res.send(meta);
    });
});

/* POST new meta */
router.post('/post', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var username = req.body.name;
    var useremail = req.body.email;
    var meta = req.body.meta;
    
    // Set our collection
    var collection = db.get('quest');

    // Submit to the DB
    collection.update({"username" : username,"email" : useremail},
        {$set:{"meta" : meta}}, 
        function (err, doc) {
	        if (err) {
	            // If it failed, return error
	            res.send("Error");
	        }
	        else {
	            // If it worked, send back success to the client
	        	res.send("Success");
	        }
        }
    );
});

/* POST to Add User Service */
router.get('/reset', function(req, res) {

	// Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var username = req.param('name');
    var useremail = req.param('email');
    var meta = text_user_meta;
    
    // Set our collection
    var collection = db.get('quest');

    // Submit to the DB
    collection.update({"username" : username,"email" : useremail},
        {$set:{"meta" : meta}}, 
        function (err, doc) {
	        if (err) {
	            // If it failed, return error
	            res.send("Error");
	        }
	        else {
	            // If it worked, send back success to the client
	        	res.send("Success");
	        }
        }
    );
});

/* GET users listing. */
router.get('/delete', function(req, res) {
	  var db = req.db;

	  // Get our form values. These rely on the "name" attributes
	  var userName = req.param('name');
	  var userEmail = req.param('email');

	  // Set our collection
	  var collection = db.get('quest');

	  // Submit to the DB
	  collection.remove({
	      "username" : userName,
	      "email" : userEmail
	  }, function (err, doc) {
	      if (err) {
	          // If it failed, return error
	          res.send("There was a problem adding the information to the database.");
	      }
	      else {
	          // If it worked, set the header so the address bar doesn't still say /adduser
	    	  res.send("User deleted successfully");
	      }
	  });
});

router.get('/add', function(req, res) {
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var username = req.param('name');
  var useremail = req.param('email');
  var meta = new_user_meta;

  // Set our collection
  var collection = db.get('quest');

  collection.count({"username" : username,"email" : useremail}, function (err, count) {
	  console.log(count);
	  if(count==0){
		// Submit to the DB
		  collection.insert({
		      "username" : username,
		      "email" : useremail,
		      "meta" : meta
		  }, function (err, doc) {
		      if (err) {
		          // If it failed, return error
		          res.send("There was a problem adding the information to the database.");
		      }
		      else {
		          // If it worked, set the header so the address bar doesn't still say /adduser
		    	  res.send("User added successfully");
		      }
		  });
	  }else{
		  res.send("User already in database!");
	  }
	});

});

module.exports = router;

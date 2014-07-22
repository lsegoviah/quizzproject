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

var test_module = (function(){

	var module = {};
	
	module.test_text = "Hello Something";
	module.test_words = ["eeny","meeny","miney","moe"];
	module.test_numbers = [0,1,0,2,0,3,0,0,4,5,0,6,6,0];
	module.send_text = function(){
		return "Hello World";
	};
	module.foreach = function(array,action){
		for(var i = 0; i < array.length; i++){
			action(array[i]);
		}
	};
	module.foreach_multiple = function(array,base,action){
		for(var i = 0; i < array.length; i++){
			base = action(base, array[i]);
		}
		return base;
	};
	module.sum = function(a,b){
		return a+b;
	};
	module.zero = function(a){
		return a == 0?1:0;
	};
	
	return module;
}());

//Here are some random testing things. They dont have anything to do with the server
var text = test_module.send_text();
console.log(text);
var combined_text = "";
test_module.foreach(test_module.test_words,function(word){
	combined_text += (" " + word);
});
console.log(combined_text);
var zero_count = test_module.foreach_multiple(test_module.test_numbers, 0, function(a,b){
	return test_module.sum(a, test_module.zero(b));
});
console.log(zero_count);


router.get('/test_output', function(req, res) {
  res.send(test_module.test_text);
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/user_index', function(req, res) {
    res.sendfile(req.abs_path + '/views/user_index.html');
});

router.post('/add_user', function(req, res) {
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var username = req.body.name;
  var useremail = req.body.email;
  
  console.log(username);
  console.log(useremail);
  
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
                          res.send(new Error('Problem adding user'));
                      }
                      else {
                          // If it worked, set the header so the address bar doesn't still say /adduser
                          collection.find({},{},function(e,docs){
						        res.setHeader('Content-Type', 'application/json');
						        res.send(docs);
						    });
                      }
                  });
          }else{
                   res.send(new Error('User in Database!'));
          }
        });

});

router.get('/all', function(req, res) {

    // Set our collection
    var db = req.db;
    var collection = db.get('quest');

    collection.find({},{},function(e,docs){
        res.setHeader('Content-Type', 'application/json');
        //var meta = JSON.stringify(docs).replace(/"/g, '');
        //res.sendfile('./views/user_index.html');
        for(var doc in docs){
        	for(var key in docs[doc]){
        		console.log("key: " + key + " value: " + docs[doc][key]);
        	}
        }
        res.send(docs);
    });
});

/*GET saved meta*/
router.get('/get', function(req, res) {

    // Set our collection
    var db = req.db;
    var collection = db.get('quest');

    var username = req.param('name');
    var useremail = req.param('email');

    collection.find({username:username, email:useremail},{},function(e,docs){
        res.setHeader('Content-Type', 'application/json');
        var meta = JSON.stringify(docs[0].meta).replace(/"/g, '').replace("\\", '');
        res.send(meta);
    });
});

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

router.get('/ledger', function(req, res) {

	console.log("Get Ledger");
	
    // Set our collection
    var db = req.db;
    var collection = db.get('ledger');

    var username = req.param('name');
    var useremail = req.param('email');
    
    console.log("Params: " + username + " Username: " +  useremail);

    collection.find({username:username, email:useremail},{},function(e,docs){
    	console.log("Collection Returned");
        res.setHeader('Content-Type', 'application/json');
        var meta = JSON.stringify(docs).replace(/"/g, '');
        res.send(meta);
    });
});

router.get('/ledger_used', function(req, res) {

	console.log("Get Ledger Used");

    // Set our collection
    var db = req.db;
    var collection = db.get('ledger');

    var username = req.param('name');
    var useremail = req.param('email');
    var purchase_id = req.param('id');


    collection.find({username:username, email:useremail, purchase_id:purchase_id},{},function(e,docs){
    	res.setHeader('Content-Type', 'application/json');
    	if(docs.length > 0){
    		res.send({exists:true});
    	}else{
    		res.send({exists:false});
    	}
    });
});

router.post('/ledger', function(req, res) {

	console.log("Post Ledger");

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var username = req.body.name;
    var useremail = req.body.email;
    var purchase_id = req.body.purchase_id;
    var item_string = req.body.item_string;

    // Set our collection
    var collection = db.get('ledger');

	console.log("Params: " + username + " Username: " +  useremail + " purchase_id: " + purchase_id + " item_string : " + item_string);
	
    // Submit to the DB
    collection.count({"username" : username,"email" : useremail, "purchase_id" : purchase_id, "item_string" : item_string}, function (err, count) {
    	if(count==0){
    		//This is where the meta needs to be updated for the user
    		//This is also where the purchase_id needs to be checked against the google dev api for authenticity
		    collection.insert({"username" : username, "email" : useremail, "purchase_id" : purchase_id, "item_string" : item_string, "consumed": false},
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
		}else{
			res.send("Purchase already in ledger!");
		}
    });
});

/* GET users listing. */
router.get('/delete', function(req, res) {
          var db = req.db;

			console.log(req);
			
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
                  res.send("There was a problem deleting the information from the database.");
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

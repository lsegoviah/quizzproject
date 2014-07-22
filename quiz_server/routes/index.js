var express = require('express');
var router = express.Router();
var http = require('http');


var new_test_meta =  /*{tests:*/[{name:"dmv_test",genre:"education",questions:[{
  	question:"A pre-trip inspection should be completed",
  	answers:["at least once a week","if any problems occurred the last the time the vehicle was operated","before operating the vehicle"],
  	correct:3},
  	{
  	question:"What should you do when you are driving at night?",
  	answers:["Make sure you are driving slow enough so you can stop within the range of your headlights in an emergency",
  	"Roll down your window so that the fresh air will help keep you awake","If you are sleepy, drink coffee or other caffeine products"],
  	correct:1}]
  	}]
  /*}*/;



/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/quiz', function(req, res) {
    res.sendfile(req.abs_path + '/views/user_index.html');
});

/*GET saved meta*/
router.get('/all', function(req, res) {

    // Set our collection
    var db = req.db;
    var collection = db.get('quiz');

    collection.find({},{},function(e,docs){
        res.setHeader('Content-Type', 'application/json');
        //var meta = JSON.stringify(docs[0].meta).replace(/"/g, '').replace("\\", '');
        res.send(docs);
    });
});

router.get('/reset', function(req, res) {
	// Set our internal DB variable
    var db = req.db;
    // Set our collection
    var collection = db.get('quiz');

    collection.remove({}, function(err) { 
    	  console.log('collection removed');
    });
    
    // Submit to the DB
    collection.insert({"tests" : new_test_meta},
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


module.exports = router;

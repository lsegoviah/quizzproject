var express = require('express');
var router = express.Router();
var http = require('http');


var new_test_meta =  {name:"dmv_test",genre:"education",questions:[{
  	question:"A pre-trip inspection should be completed",
  	answers:["at least once a week","if any problems occurred the last the time the vehicle was operated","before operating the vehicle"],
  	correct:3},
  	{
  	question:"What should you do when you are driving at night?",
  	answers:["Make sure you are driving slow enough so you can stop within the range of your headlights in an emergency",
  	"Roll down your window so that the fresh air will help keep you awake","If you are sleepy, drink coffee or other caffeine products"],
  	correct:1}]
  	};



/* GET home page. */
router.get('/', function(req, res) {
  res.sendfile(req.abs_path + '/views/user_index.html');
});

/*GET all meta*/
router.get('/all', function(req, res) {
    var db = req.db;
    var collection = db.get('quiz');
    collection.find({},{},function(e,docs){
        res.setHeader('Content-Type', 'application/json');
        res.send(docs);
    });
});

router.post('/add_quiz', function(req, res) {
    var db = req.db;

	console.log(req.param('test'));
	console.log(req.param('genre'));

    var test_name = req.param('test');
    var test_genre = req.param('genre');
    
    var collection = db.get('quiz');
    collection.insert({name:test_name,genre:test_genre,questions:[]},
    	function (err, doc) {
	        if (err) {
	            res.send("Error");
	        }
	        else {
	            res.send("Success");
	        }
    	}
    );
});

router.post('/add_question', function(req, res) {
      var db = req.db;

	  console.log(req.param('test'));
	  console.log(req.param('question'));

      var test_name = req.param('test');
      var question_correct = req.param('correct');
      var question_name = req.param('question');
      var question_answers = req.param('answers');
      
      var question_object = {
		  question:question_name,
		  answers:question_answers,
		  correct:question_correct
      }
      
      console.log(question_object);

      // Set our collection
      var collection = db.get('quiz');
      
      collection.find({name:test_name},{},function(e,docs){
          	res.setHeader('Content-Type', 'application/json');
          	console.log(docs[0].questions);
          	docs[0].questions.push(question_object);
          	collection.update({name:test_name}, {'$set':{"questions" : docs[0].questions}},function (err, doc) {
                if (err) {
                    res.send("Error");
                }
                else {
                	res.send("Success");
                }
          	});
      });
});

router.post('/delete_question', function(req, res) {
      var db = req.db;

	  console.log(req.param('test'));
	  console.log(req.param('question'));

      var test_name = req.param('test');
      var question_name = req.param('question');

      // Set our collection
      var collection = db.get('quiz');
      
      collection.find({name:test_name},{},function(e,docs){
          	res.setHeader('Content-Type', 'application/json');
          	var new_questions = [];
          	console.log(docs[0]);
          	console.log(docs[0].questions);
          	for(var i = 0; i < docs[0].questions.length;i++){
          		console.log(docs[0].questions[i].question);
          		if(docs[0].questions[i].question != question_name){
          			new_questions.push(docs[0].questions[i]);
          		}
          	}
          	collection.update({name:test_name}, {'$set':{"questions" : new_questions}},function (err, doc) {
                if (err) {
                    res.send("Error");
                }
                else {
                	res.send("Success");
                }
          	});
      });
});

router.get('/reset', function(req, res) {
    var db = req.db;
    var collection = db.get('quiz');
    collection.remove({}, function(err) { 
    	  console.log('collection removed');
    });
    collection.insert(new_test_meta,
    	function (err, doc) {
	        if (err) {
	            res.send("Error");
	        }
	        else {
	            res.send("Success");
	        }
    	}
    );
});


module.exports = router;

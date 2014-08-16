// public/core.js

//Make Hops Website

var quizProject = angular.module('quizProject', []);

function mainController($scope, $http, $compile) {
	var quiz_name = "";
	
	//A holder for the post form data
	$scope.formData = {};
	//All the quizzes
	$scope.quizzes = [];
	//The currently selected quiz
	$scope.quiz_name = "";
	//The currently selected quiz
	$scope.quiz = {};
	//The edit_questions that will be added...
	$scope.editing_answers = [{id: 'choice1'}];

	 $scope.loadData = function () {
		 console.log("Loading Page");
	     $http.get('/all').success(function(data) {
	    	 //console.log("Load returned success!");
	    	 $scope.quizzes = data;
	    	 for(quiz in $scope.quizzes){
	    		 var this_quiz = $scope.quizzes[quiz];
	    		 //console.log("Comparing: " + $scope.quiz['name'] + ":" + this_quiz['name']);
	    		 if($scope.quiz['name'] == this_quiz['name']){
	    			 //console.log("Found Match!!!");
	    			 $scope.quiz = this_quiz;
	    		     $scope.nameClick($scope.quiz,false);
	    		 }
	    	 }
	     });
	  };
	
	$scope.tabClick = function(tab_name){
		console.log(tab_name);
		if(tab_name == "home"){
			$('#home_nav').addClass("active");
			$('#edit_nav').removeClass("active");
			$('#view_nav').removeClass("active");
			
			$('#home_tab').show();
			$('#edit_tab').hide();
			$('#view_tab').hide();
		}else if(tab_name == "edit"){
			$('#home_nav').removeClass("active");
			$('#edit_nav').addClass("active");
			$('#view_nav').removeClass("active");
			
			$('#home_tab').hide();
			$('#edit_tab').show();
			$('#view_tab').hide();
		}else{
			$('#home_nav').removeClass("active");
			$('#edit_nav').removeClass("active");
			$('#view_nav').addClass("active");
			
			$('#edit_tab').hide();
			$('#home_tab').hide();
			$('#view_tab').show();
		}
		$('.meta_child').hide();
	};
	
	$scope.nameClick = function(quiz, clicked/*,genre,questions,event*/){
		console.log("Clicked Something");
		if($scope.quiz == quiz && clicked){
			$scope.quiz = {};
			$('.meta_child').hide();
		}else{
			$scope.quiz = quiz;
			$scope.quiz_name = $scope.quiz['name'];
			$scope.quiz_questions = quiz['questions'];
			var question_string = add_question();
			for(var i = 0; i < quiz['questions'].length; i++){
				question_string += question_formatter(quiz['questions'][i]);
			}
			//question_string += add_question();
			console.log(question_string);
			$('.question_holder').html($compile($(question_string).contents())($scope));
			$('.meta_child').show();
		}
	};

	/*$scope.convertMeta = function(meta){
		console.log(meta);
		var json = JSON.stringify(eval("(" + meta + ")"));
		console.log(json);
	};*/
	
	$scope.addNewChoice = function() {
		var newItemNo = $scope.editing_answers.length+1;
		$scope.editing_answers.push({'id':'choice'+newItemNo});
	};
	
	//This makes sure that the add button only appears next to the last answer in the form
	$scope.showAddChoice = function(choice) {
		return choice.id === $scope.editing_answers[$scope.editing_answers.length-1].id;
	};
	
	$scope.add_test = function(){
		if($('.add_quiz').is(":visible") ){
			$('.add_quiz').hide();
			$('.add_quiz_holder a').addClass('glyphicon-plus');
			$('.add_quiz_holder a').removeClass('glyphicon-remove');
			reload_form_data();
		}else{
			$('.add_quiz').show();
			$('.add_quiz_holder a').removeClass('glyphicon-plus');
			$('.add_quiz_holder a').addClass('glyphicon-remove');
		}
	};
	
	$scope.saveQuiz = function(test){
		console.log("Delete Clicked!");
		$scope.formData = {"genre":test['genre'],"test":test['name']};
		console.log($scope.formData);
		$http.post('/add_quiz', $scope.formData)
			.success(function(data) {
				console.log("Add Quiz Returned Success!!!");
				reload_form_data();
				$scope.loadData();
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	}
	
	$scope.add_question = function(){
		if($('.add_form').is(":visible") ){
			$('.add_form').hide();
			$('.add_div a').addClass('glyphicon-plus');
			$('.add_div a').removeClass('glyphicon-remove');
			reload_form_data();
		}else{
			$('.add_form').show();
			$('.add_div a').removeClass('glyphicon-plus');
			$('.add_div a').addClass('glyphicon-remove');
		}
	};

	$scope.saveQuestion = function(question){
		console.log("New Question Saved!!!");
		console.log(question);
		var answers = [];
		for(answer in $scope.editing_answers){
			answers.push($scope.editing_answers[answer].name);
		}
		if(1 <= question['correct'] && question['correct'] <= answers.length){
			question['answers'] = answers;
			question['test'] = $scope.quiz['name'];
			console.log(question);
	
			$scope.formData = question;
			console.log($scope.formData);
			
			$http.post('/add_question', $scope.formData)
				.success(function(data) {
					console.log("Add returned success!!!");
					reload_form_data();
					$scope.loadData();
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
			$scope.nameClick($scope.quiz,false);
		}else{
			alert("The correct answer must be an answer option!");
		}
	};
	
	$scope.delete_question = function(question){
		console.log("Delete Clicked!");
		$scope.formData = {"question":question,"test":$scope.quiz['name']};
		console.log($scope.formData);
		$http.post('/delete_question', $scope.formData)
			.success(function(data) {
				console.log("Delete Returned Success!!!");
				$scope.loadData();
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	function reload_form_data(){
		$scope.question = {};
		$scope.new_quiz = {};
		$scope.editing_answers = [{id: 'choice1'}];
		$('.add_form').hide();
		$('.add_div a').addClass('glyphicon-plus');
		$('.add_div a').removeClass('glyphicon-remove');
		$('.add_quiz').hide();
		$('.add_quiz_holder a').addClass('glyphicon-plus');
		$('.add_quiz_holder a').removeClass('glyphicon-remove');
	}
	
	function question_formatter(question){
		var answer_string = "";
		for(var i = 0; i < question["answers"].length; i++){
			answer_string += "<p>" + (i+1) + ") " + question["answers"][i] + "</p>";
		}
		return "<div><div class='name_div well'><a class='remove glyphicon glyphicon-remove' href='' ng-click='delete_question(\""+question["question"]+"\")'></a>" +
				"<p class='meta_data label label-info'><b>Question:</b></p><p><p>" + question["question"] + "</p></p>" +
				"<p class='meta_data label label-info'><b>Answers:</b></p><p>" + answer_string + "</p>" +
				"<p class='meta_data label label-info'><b>Correct:</b></p><p><p>" + question["correct"] + "</p></p>" +
				"</div></div>";
	}
	
	function add_question(){
		return "<div><div class='add_div well'>" +
				"<a class='remove glyphicon glyphicon-plus' href='' ng-click='add_question()'></a>" +
				"<div class=add_form style='display: none'><form>" +
				"<p class='meta_data label label-info'><b>Question:</b></p>" +
				"<p><p><input type='text' ng-model='question.question' placeholder='question'/></p></p>" +
				"<p class='meta_data label label-info'><b>Answer:</b></p>" +
				"<div class='form-group' data-ng-repeat='answer in editing_answers'>"+
				  "<label for='answer' ng-show='showChoiceLabel(answer)'>Answer</label>" + 
				  "<input type='text' ng-model='answer.name' name='' placeholder='answer'>" +
				  "<button ng-show='showAddChoice(answer)' ng-click='addNewChoice()'>Add another answer</button>" +
				"</div>" + 
				"<p class='meta_data label label-info'><b>Correct:</b></p><p><p><input type='number' ng-model='question.correct' placeholder='correct answer'/></p></p>" +
				"<input type='submit' value='Save' ng-click='saveQuestion(question)' />" + 
				"</form></div>" +
				"</div></div>";
	}
	
	/*function isEmpty(obj) {
	    for(var prop in obj) {
	        if(obj.hasOwnProperty(prop))
	            return false;
	    }

	    return true;
	}*/
	
	$scope.loadData();
	
}
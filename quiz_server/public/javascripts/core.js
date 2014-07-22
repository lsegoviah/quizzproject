// public/core.js

//Make Hops Website

var pocketQuest = angular.module('pocketQuest', []);

function mainController($scope, $http) {
	$scope.formData = {};
	$scope.quiz_name = {};
	$scope.quiz_genre = "";
	$scope.quiz_questions = "";

	// when landing on the page, get all todos and show them
	$http.get('/all')
		.success(function(data) {
			console.log(data[0]);
			$scope.quizzes = data[0].tests;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	
	$scope.quiz_name.nameClick = function(name,genre,questions,event){
		console.log("Clicked Something");
		$scope.quiz_name = name;
		console.log($scope.quiz_name);
		$scope.quiz_genre = genre;
		console.log($scope.quiz_genre);
		$scope.quiz_questions = questions;
		console.log($scope.quiz_questions);
		$('.meta_child').show();
	};

	$scope.convertMeta = function(meta){
		console.log(meta);
		var json = JSON.stringify(eval("(" + meta + ")"));
		console.log(json);
	};

	// when submitting the add form, send the text to the node API
	$scope.createUser = function() {
		$http.post('/add_user', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.todos = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}
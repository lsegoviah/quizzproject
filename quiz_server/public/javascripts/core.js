// public/core.js

//Make Hops Website

var pocketQuest = angular.module('pocketQuest', []);

function mainController($scope, $http) {
	$scope.formData = {};
	$scope.meta_data = {};
	$scope.meta_email = "";
	$scope.meta_meta = "";

	// when landing on the page, get all todos and show them
	$http.get('/all')
		.success(function(data) {
			console.log(data);
			$scope.todos = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		
	/*$scope.sort = function(item) {
	    return item[$scope.orderProp];
	}*/
	
	$scope.meta_data.nameClick = function(email,meta,event){
		console.log("Clicked Something");
		$scope.meta_email = email;
		console.log($scope.meta_email);
		$scope.meta_meta = meta;
		console.log($scope.meta_meta);
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
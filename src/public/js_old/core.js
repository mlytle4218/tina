var app = angular.module('TinaApp', ['ngRoute', 'ui.bootstrap', 'ngFlash']);

// app.config(function($routeProvider) {
//     $routeProvider

//     // route for the home page
//         .when('/', {
//         templateUrl: 'views/home.html',
//         controller: 'mainController'
//     })

//     // route for the about page
//     .when('/about', {
//         templateUrl: 'views/about.html',
//         controller: 'aboutController'
//     })

//     // route for the contact page
//     .when('/contact', {
//         templateUrl: 'views/contact.html',
//         controller: 'contactController'
//     });
// });

window.routes =
{
    "/": {
        templateUrl: 'views/home.html', 
        controller: 'mainController', 
        requireLogin: false
	},
    "/about": {
        templateUrl: 'views/about.html', 
        controller: 'aboutController', 
        requireLogin: false
    },
    "/con": {
        templateUrl: 'views/con.html', 
        controller: 'conController', 
        requireLogin: true
    },
    "/contact": {
        templateUrl: 'views/contact.html', 
        controller: 'contactController', 
        requireLogin: true
    },
    "/images": {
        templateUrl: 'views/images.html', 
        controller: 'imagesController', 
        requireLogin: true
    },
    "/clips": {
        templateUrl: 'views/clips.html', 
        controller: 'clipsController', 
        requireLogin: true
    },
    "/movies": {
        templateUrl: 'views/movies.html', 
        controller: 'moviesController', 
        requireLogin: true
    },
    "/films": {
        templateUrl: 'views/films.html', 
        controller: 'filmsController', 
        requireLogin: true
    },
    "/theater": {
        templateUrl: 'views/theater.html', 
        controller: 'theaterController', 
        requireLogin: true
    },
    "/contacts": {
        templateUrl: 'views/contacts.html', 
        controller: 'contactsController', 
        requireLogin: true
    }
};






app.service('AuthorizedService', function($window) {
	var isAuthenticated = false;
	var token= '';

	this.endAuthorization = function(){
		console.log("in endAuthorization");
		// token="";
		$window.localStorage.removeItem('token');
		// $window.location.reload();
	};

	this.setIsAuthenticated = function(value){
		// token = value;
		$window.localStorage.setItem('token', value);
	};

	this.getIsAuthorized = function() {
		// if ($window.sessionStorage.token){
		// 	var dateNow = new Date().getTime()/ 1000 | 0 ;
		// 	token_data = JSON.parse(atob($window.sessionStorage.token.split('.')[1]));
		// 	if (token_data.exp > dateNow){
		// 		return true;
		// 	}
		// }
		// return false;

		// if (token){
		// 	var dateNow = new Date().getTime()/1000 | 0;
		// 	token_data = JSON.parse(atob(token.split('.')[1]));
		// 	if (token_data.exp > dateNow){
		// 		return true;
		// 	}
		// }
		// return false;

		if ($window.localStorage.getItem('token')){
			var dateNow = new Date().getTime()/1000 | 0;
			token_data = JSON.parse(atob($window.localStorage.getItem('token').split('.')[1]));
			if (token_data.exp > dateNow){
				return true;
			}
		}
		return false;
	};
});


app.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.localStorage.getItem('token')) {
        config.headers.Authorization = 'Bearer ' + $window.localStorage.getItem('token');
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});



app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider){
	$httpProvider.interceptors.push('authInterceptor');

    //this loads up our routes dynamically from the previous object 
    for(var path in window.routes) {
        $routeProvider.when(path, window.routes[path]);
    }
    $routeProvider.otherwise({redirectTo: '/'});

}]);

app.run([ '$rootScope', 'AuthorizedService', function($rootScope, AuthorizedService){
    $rootScope.$on("$locationChangeStart", function(event, next, current) {
        for(var i in window.routes) {
            if(next.indexOf(i) != -1) {
                if(window.routes[i].requireLogin && !AuthorizedService.getIsAuthorized()) {
                    alert("You need to sign in to see this page!");
                    event.preventDefault();
                }
            }
        }
    });

}]);





// create the controller and inject Angular's $scope
// app.controller('mainController', function($scope, $uibModal) {
// 	$scope.open = function() {
// 		console.log("opening up pop up");
// 		// var modalInstance = $uibModal.open({
// 		// 	templateUrl: 'views/edit.html'
// 		// 	controller: 'PopupCont',
// 		// });
// 	}

// });

// Here is where the magic works
app.directive('date', function (dateFilter) {
    return {
        require:'ngModel',
        link:function (scope, elm, attrs, ctrl) {

            var dateFormat = attrs['date'] || 'yyyy-MM-dd';
           
            ctrl.$formatters.unshift(function (modelValue) {
                return dateFilter(modelValue, dateFormat);
            });
        }
    };
})



app.controller('mainController', ['$scope', '$uibModal', '$window', 'AuthorizedService', '$http', 'Flash', '$timeout', function($scope, $uibModal, $window, AuthorizedService, $http, Flash, $timeout){
	$http.get('/api/pageLoadData')
		.then(function(response){
			$scope.myData = response.data;
		})
		.catch(function(response){
			//console.log('Error', response.status, response.data);
		});



	$scope.add = function(){
		$scope.myData.theater.push({});
	};

	$scope.save = function(array, index, indicator) {
		if (array[index]._id){
			console.log("put");
			$http.put('api/' + indicator +'/' + array[index]._id, array[index])
				.then(function(response){
					if (response.data._id){
						Flash.create('success', 'save(put) worked');
					}
				}).catch(function(response) {
					Flash.create('danger', 'save(put) did not work');
					console.log('Error', response.status, response.data);
				})
		} else {
			console.log("post");

			$http.post('api/' + indicator +'/', array[index])
				.then(function(response){
					if (response.data._id){
						Flash.create('success', 'save(post) worked');
					}
				}).catch(function(response) {
					Flash.create('danger', 'save(post) did not work');
					console.log('Error', response.status, response.data);
				})

		}
	};

	$scope.delete = function(array, index, indicator) {
		$http.delete('api/' + indicator +'/' + array[index]._id)
			.then(function(response){
				// console.log(response.data.message);
				if (response.data.message == "successful") {
					array.splice(index, 1);
				}
			});
		console.log(array[index]._id);
		
	};



	$scope.open = function() {
		console.log("pop up");
		var modalInstance = $uibModal.open({
			templateUrl: 'views/popup.html',
			controller: 'PopupCont'
		})
	}

	$scope.logout = function(){
		AuthorizedService.endAuthorization();
	}

	$scope.isAuthenticated = function(){
		return AuthorizedService.getIsAuthorized();






	}
	// var dateNow = new Date().getTime()/ 1000 | 0 ;
	// if($window.sessionStorage.token) {
	// 	token_data = JSON.parse(atob($window.sessionStorage.token.split('.')[1]));
	// 	$scope.token_present = token_data.exp + " " + ((dateNow )) + " " + (token_data.exp > (dateNow));
	// }
}]);

app.controller('PopupCont', ['$scope','$uibModalInstance', '$http', 'AuthorizedService', function ($scope, $uibModalInstance, $http, AuthorizedService) {
	$scope.close = function () {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.submit = function(){
		
		$http
            .post('/api/user/authenticate', $scope.user)
                .then(function(response){
                    // $window.sessionStorage.token = response.data.token;
                    // $window.sessionStorage.isAuthenticated = true;
                    AuthorizedService.setIsAuthenticated(response.data.token);
                    // console.log($window.sessionStorage.token);
                    $uibModalInstance.dismiss('cancel');
                })
                .catch(function(response){
                	$scope.message = 'User name or password incorrect.';
                    // delete $window.sessionStorage.token;
                    AuthorizedService.endAuthorization();
                    $scope.showLoginAlert = true;
                });
	}
}]);





app.controller('aboutController', function($scope) {
    $scope.message = 'Look! I am an about page.';
});

app.controller('conController', function($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
});





app.controller('imagesController', function($scope) {
    $scope.message = 'list of images';
});

app.controller('clipsController', function($scope) {
    $scope.message = 'list od clips';
});

app.controller('moviesController', function($scope) {
    $scope.message = 'list of movies';
});

app.controller('filmsController', function($scope) {
    $scope.message = 'list of films';
});

app.controller('theaterController', function($scope) {
    $scope.message = 'list of theater roles';
});

app.controller('contactsController', function($scope) {
    $scope.message = 'list of contacts';
});



function ListCtrl($scope, $dialog) {
  
  
}
// the dialog is injected in the specified controller
function EditCtrl($scope, item, dialog){
  

}

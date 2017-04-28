angular.module('inspinia').controller('contentCtrl', function (AuthenticationService, $state, $scope, $localStorage) {
	$scope.user_name = $localStorage.name;
	$scope.profpict = $localStorage.profpict;
	$scope.isAdmin = AuthenticationService.isAdmin;
	
	$scope.isDp = AuthenticationService.isDp;
	
	$scope.isUser = AuthenticationService.isUser;
	
	if (!AuthenticationService.isAuth()){
		$state.go("login");
	}
});


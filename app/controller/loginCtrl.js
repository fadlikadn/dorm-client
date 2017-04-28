angular.module('inspinia').controller('loginCtrl', function ($scope, $http, AuthenticationService, AjaxService, $state, toaster) {
	if (AuthenticationService.isAuth()) {
		$state.go('finddorm.maps');
	}
	
	$scope.login = function() {
		var data = {"username":$scope.username, "password":$scope.password};
		var sendAuth = AjaxService.sendAjax("/login", "POST", data);
		sendAuth.success(function(data, status, headers, config) {
			if (data.status == 'OK') {
				AuthenticationService.setCredentials(data.token,data.role,data.name,$scope.username,data.profpict);
				toaster.pop({
					type: 'success',
					title: 'Login Success',
					body: 'Welcome to the app',
				});
				$state.go('finddorm.maps');
			} else {
				toaster.pop({
					type: 'error',
					title: 'Login Failed',
					body: data.reason,
				});
			}
		}).error(function(data, status, headers, config) {
			toaster.pop({
				type: 'error',
				title: 'Login Failed',
				body: "Cannot load page",
			});
		});
		
	}
	
	
});
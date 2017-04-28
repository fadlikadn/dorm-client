angular.module('inspinia').controller('registerCtrl', function ($scope, AuthenticationService, AjaxService, $state, toaster) {
	
	$scope.userTypes = [];
	$scope.birthdate = {value:""};
	AjaxService.sendAjax("/register/user-type", "GET").success(function(data, status, headers, config) {
		if (data.status == 'OK') {
			usertype = data.data;
			var types = [];
			for (i=0;i<usertype.length;i++) {
				types.push({id:usertype[i].id, name: usertype[i].name});
			}
			$scope.userTypes = types;
		} else {
			toaster.pop({
				type: 'error',
				title: 'Get Data Failed',
				body: data.reason,
			});
		}
	}).error(function(data, status, headers, config) {
		toaster.pop({
			type: 'error',
			title: 'Get Data Failed',
			body: "Cannot load page",
		});
	});
	
	$scope.register = function() {
		if ($scope.password !== $scope.repassword) {
			toaster.pop({
				type: 'error',
				title: 'Register Failed',
				body: "Password n Repeat Password not match",
			});
			$scope.passwordError = true;
			$scope.repasswordError = true;
			return;
		}
		var birthdate = $scope.birthdate.value._d;
		var mm = birthdate.getMonth() + 1;
		mm = (mm < 10) ? '0' + mm : mm;
		var dd = birthdate.getDate();
		dd = (dd < 10) ? '0' + dd : dd;
		var data = {
			"name":$scope.name,
			"username":$scope.username, 
			"password":$scope.password,
			"email":$scope.email,
			"phone":$scope.phone,
			"type":$scope.type,
			"birthdate":[birthdate.getFullYear(),mm,dd].join('-'),
		};
		var registerUser = AjaxService.sendAjax("/register/submit", "POST", data);
		registerUser.success(function(data, status, headers, config) {
			if (data.status == 'OK') {
				toaster.pop({
					type: 'success',
					title: 'Register Success',
					body: data.reason,
				});
				$state.go('login');
			} else {
				toaster.pop({
					type: 'error',
					title: 'Register Failed',
					body: data.reason,
				});
			}
		}).error(function(data, status, headers, config) {
			toaster.pop({
				type: 'error',
				title: 'Register Failed',
				body: "Cannot load page",
			});
		});
		
	}
	
});
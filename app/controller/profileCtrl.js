angular.module('inspinia').controller('profileCtrl', function ($scope, $localStorage, AjaxService, $state, $uibModal, toaster) {
	$scope.user = {};
	$scope.user.profpict = $localStorage.profpict;
	AjaxService.sendAjax("/api/profile/show", "GET").success(function(data, status, headers, config) {
		if (data.status == 'OK') {
			$scope.user.id = data.data.id;
			$scope.user.name = data.data.name;
			$scope.user.username = data.data.username;
			$scope.user.email = data.data.email;
			$scope.user.phone = data.data.phone;
			$scope.user.birthdate = data.data.birthdate;
			$scope.user.user_type = data.data.user_type;
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
	
	$scope.editProfileForm = function (size) {
		var modalInstance = $uibModal.open({
			windowClass: "animated fadeIn",
			templateUrl: 'editProfile',
			controller: function ($scope, $uibModalInstance, $localStorage, AjaxService, user, toaster) {
				$scope.name = user.name;
				$scope.username = user.username;
				$scope.email = user.email;
				$scope.phone = user.phone;
				$scope.birthdate = {value:user.birthdate};
				
				$scope.cancel = function () {
					$uibModalInstance.dismiss('cancel');
				};
				
				$scope.editsave = function () {
					if (typeof $scope.birthdate.value == "string") {
						var birthdate = $scope.birthdate.value;
					} else {
						var mm = $scope.birthdate.value._d.getMonth() + 1;
						mm = (mm < 10) ? '0' + mm : mm;
						var dd = $scope.birthdate.value._d.getDate();
						dd = (dd < 10) ? '0' + dd : dd;
						var yyyy = $scope.birthdate.value._d.getFullYear();
						var birthdate = [yyyy,mm,dd].join('-');
					}
					
					data = {
						'id':user.id,
						'name':$scope.name,
						'email':$scope.email,
						'phone':$scope.phone,
						"birthdate":birthdate,
					};
					AjaxService.sendAjax("/api/profile/editsave", "POST",data).success(function(data, status, headers, config) {
						if (data.status == 'OK') {
							user.name = $scope.name;
							user.email = $scope.email ;
							user.phone = $scope.phone;
							user.birthdate = birthdate;
							$localStorage.name = $scope.name;
							$localStorage.username = $scope.username;
							
							toaster.pop({
								type: 'success',
								title: 'Edit Success',
								body: 'Your profile has been edited successfully',
							});
							
							$uibModalInstance.close();
						} else {
							toaster.pop({
								type: 'error',
								title: 'Edit Failed',
								body: data.reason,
							});
						}
					}).error(function(data, status, headers, config) {
						toaster.pop({
							type: 'error',
							title: 'Edit Failed',
							body: "Cannot load page",
						});
					});
				};
			},
			size: size,
			resolve: {
				user: function () {
					return $scope.user;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		});
	};
	
	
	$scope.changePasswordForm = function (size) {
		var modalInstance = $uibModal.open({
			windowClass: "animated fadeIn",
			templateUrl: 'changePassword',
			controller: function ($scope, $uibModalInstance, $state, AjaxService) {
				$scope.cancel = function () {
					$uibModalInstance.dismiss('cancel');
				};
				
				$scope.changepassword = function () {
					if ($scope.newpassword !== $scope.renewpassword) {
						toaster.pop({
							type: 'error',
							title: 'Change Password Failed',
							body: "Your new password & repeat new password not match",
						});
						$scope.newPasswordError = true;
						$scope.renewPasswordError = true;
						return;
					}
					
					data = {
						'oldpassword':$scope.oldpassword,
						'newpassword':$scope.newpassword,
					};
					AjaxService.sendAjax("/api/profile/changepassword", "POST",data).success(function(data, status, headers, config) {
						if (data.status == 'OK') {
							toaster.pop({
								type: 'success',
								title: 'Change Password Success',
								body: 'Your password has been changed successfully',
							});
							
							$uibModalInstance.close();
							$state.go('logout');
						} else {
							toaster.pop({
								type: 'error',
								title: 'Edit Failed',
								body: data.reason,
							});
						}
					}).error(function(data, status, headers, config) {
						toaster.pop({
							type: 'error',
							title: 'Edit Failed',
							body: "Cannot load page",
						});
					});
				};
			},
			size: size,
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		});
	};
	
	$scope.changeProfpict = function (size) {
		var modalInstance = $uibModal.open({
			windowClass: "animated fadeIn",
			templateUrl: 'changePhoto',
			controller: function ($scope, $state, $uibModalInstance, $localStorage, AjaxService, user, toaster) {
				$scope.uploadPhoto = function() {
					if ($scope.form.file.$valid && $scope.file) {
						data = {
							'file':$scope.file,
						}; 
						
						AjaxService.uploadFile("/api/profile/upload",data).then(function (resp) {
							data = resp.data;
							if (data.status == 'OK') {
								$localStorage.profpict = data.data.profpict;
								user.profpict = data.data.profpict;
								
								toaster.pop({
									type: 'success',
									title: 'Upload  Success',
									body: "Your Photo has been changed successfully",
								});
								
								$uibModalInstance.close();
								$state.reload();
							} else {
								toaster.pop({
									type: 'error',
									title: 'Upload  Failed',
									body: data.reason,
								});
							}
						}, function (resp) {
							toaster.pop({
								type: 'error',
								title: 'Upload Failed',
								body: "Cannot load page",
							});
							//console.log('Error status: ' + resp.status);
						}, function (evt) {
							var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
							console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
						})
					}
				};
				
				$scope.cancel = function () {
					$uibModalInstance.dismiss('cancel');
				};
			},
			size: size,
			resolve: {
				user: function () {
					return $scope.user;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		});
	};
});

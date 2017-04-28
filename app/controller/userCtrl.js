angular.module('inspinia').controller('userCtrl', function ($scope, $uibModal, AjaxService, DTOptionsBuilder, DTColumnDefBuilder, toaster, SweetAlert) {
	$scope.dtOptions = DTOptionsBuilder.newOptions();
	
	$scope.dtColumns = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
		DTColumnDefBuilder.newColumnDef(3),
		DTColumnDefBuilder.newColumnDef(4),
		DTColumnDefBuilder.newColumnDef(5),
		DTColumnDefBuilder.newColumnDef(6),
        DTColumnDefBuilder.newColumnDef(7).notSortable()
    ];

    /**
     * persons - Data used in Tables view for Data Tables plugin
     */
    $scope.datas = [];
	
	AjaxService.sendAjax("/api/admin/user/show", "GET").success(function(data, status, headers, config) {
		if (data.status == 'OK') {
			var users = [];
			for (var i=0;i<data.data.length;i++) {
				if (data.data[i].status) {
					
				}
				users.push({
					id : data.data[i].id,
					name : data.data[i].name,
					username : data.data[i].username,
					email : data.data[i].email,
					phone : data.data[i].phone,
					birthdate : data.data[i].birthdate,
					description : data.data[i].description,
					status : data.data[i].status,
					status_value: (data.data[i].status == 1) ? "Active" : "Not Active"
				});
			}
			$scope.datas = users
			
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
	
	$scope.modifyUser = function (data,size) {
		var modalInstance = $uibModal.open({
			windowClass: "animated fadeIn",
			templateUrl: 'editUser',
			controller: function ($scope, $uibModalInstance, $localStorage, AjaxService, user, toaster) {
				$scope.name = user.name;
				$scope.username = user.username;
				$scope.email = user.email;
				$scope.phone = user.phone;
				$scope.birthdate = {value:user.birthdate};
				$scope.description = user.description;
				$scope.status = user.status.toString();
				$scope.newpassword = "";
				$scope.renewpassword = "";
				
				
				$scope.cancel = function () {
					$uibModalInstance.dismiss('cancel');
				};
				
				$scope.editsave = function () {
					if ($scope.newpassword !== $scope.renewpassword) {
						toaster.pop({
							type: 'error',
							title: 'Edit Failed',
							body: "Your new password & repeat new password not match",
						});
						$scope.newPasswordError = true;
						$scope.renewPasswordError = true;
						return;
					}
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
						"description":$scope.description,
						"status":$scope.status,
						"password":$scope.newpassword,
					};
					AjaxService.sendAjax("/api/admin/user/editsave", "POST",data).success(function(data, status, headers, config) {
						if (data.status == 'OK') {
							user.name = $scope.name;
							user.email = $scope.email ;
							user.phone = $scope.phone;
							user.birthdate = birthdate;
							user.description = $scope.description;
							user.status = $scope.status;
							user.status_value = ($scope.status == 1) ? "Active" : "Not Active";
							
							toaster.pop({
								type: 'success',
								title: 'Edit Success',
								body: 'User has been edited successfully',
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
					return data;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		});
	}
	
	$scope.removeUser = function (data,index) {
		SweetAlert.swal({
			title: "Are you sure?",
			text: "Your will not be able to recover this imaginary file!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "No, cancel plx!",
			closeOnConfirm: false,
			closeOnCancel: false },
		function (isConfirm) {
			if (isConfirm) {
				AjaxService.sendAjax("/api/admin/user/delete/"+data.id, "GET",data).success(function(data, status, headers, config) {
					if (data.status == 'OK') {
						$scope.datas.splice(index, 1);
						SweetAlert.swal("Deleted!", "Your imaginary file has been deleted.", "success");
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
				
			} else {
				SweetAlert.swal("Cancelled", "Your imaginary file is safe :)", "error");
			}
		});
	}
	
});


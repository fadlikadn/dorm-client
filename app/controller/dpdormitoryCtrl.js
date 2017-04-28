angular.module('inspinia').controller('dpdormitoryCtrl', function ($scope, $uibModal, AjaxService, DTOptionsBuilder, DTColumnDefBuilder, toaster, SweetAlert) {
	$scope.dtOptions = DTOptionsBuilder.newOptions();
	
	$scope.dtColumns = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
		DTColumnDefBuilder.newColumnDef(3),
		DTColumnDefBuilder.newColumnDef(4),
		DTColumnDefBuilder.newColumnDef(5),
		DTColumnDefBuilder.newColumnDef(6),
		DTColumnDefBuilder.newColumnDef(7),
		DTColumnDefBuilder.newColumnDef(8),
        DTColumnDefBuilder.newColumnDef(9).notSortable()
    ];

    /**
     * persons - Data used in Tables view for Data Tables plugin
     */
    $scope.datas = [];
	
	AjaxService.sendAjax("/api/dp/dorm/show", "GET").success(function(data, status, headers, config) {
		if (data.status == 'OK') {
			var dorms = [];
			for (var i=0;i<data.data.length;i++) {
				if (data.data[i].status) {
					
				}
				dorms.push({
					id : data.data[i].id,
					name : data.data[i].name,
					longitude : data.data[i].longitude,
					latitude : data.data[i].latitude,
					address : data.data[i].address,
					number_of_room : data.data[i].numberOfRoom,
					price : data.data[i].price,
					description : data.data[i].description,
					dormProvider : data.data[i].dormProvider,
					telp : data.data[i].telp,
					status : data.data[i].status,
					status_value: (data.data[i].status == 1) ? "Available" : "Not Available"
				});
			}
			$scope.datas = dorms;
			
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
	
	$scope.modifyDormitory = function (data,size) {
		var modalInstance = $uibModal.open({
			windowClass: "animated fadeIn",
			templateUrl: 'editDormitory',
			controller: function ($scope, $uibModal, $uibModalInstance, $localStorage, AjaxService, dorm, toaster) {
				$scope.name = dorm.name;
				$scope.longitude = dorm.longitude;
				$scope.latitude = dorm.latitude;
				$scope.address = dorm.address;
				$scope.number_of_room = dorm.number_of_room;
				$scope.price = dorm.price;
				$scope.description = dorm.description;
				$scope.status = dorm.status.toString();
				
				$scope.cancel = function () {
					$uibModalInstance.dismiss('cancel');
				};
				
				$scope.editsave = function () {
					data = {
						'id':dorm.id,
						'name':$scope.name,
						'longitude':$scope.longitude,
						'latitude':$scope.latitude,
						'address':$scope.address,
						'number_of_room':$scope.number_of_room,
						"price":$scope.price,
						"description":$scope.description,
						"status":$scope.status,
					};
					AjaxService.sendAjax("/api/dp/dorm/editsave", "POST",data).success(function(data, status, headers, config) {
						if (data.status == 'OK') {
							dorm.name = $scope.name;
							dorm.longitude = $scope.longitude ;
							dorm.latitude = $scope.latitude;
							dorm.address = $scope.address;
							dorm.price = $scope.price;
							dorm.number_of_room = $scope.number_of_room;
							dorm.description = $scope.description;
							dorm.status = $scope.status;
							dorm.status_value = ($scope.status == 1) ? "Available" : "Not Available";
							
							toaster.pop({
								type: 'success',
								title: 'Edit Success',
								body: 'Dormitory has been edited successfully',
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
				
				$scope.pickFromMap = function (size) {
					var modalInstance = $uibModal.open({
						windowClass: "animated fadeIn",
						templateUrl: 'pickLocation',
						windowClass: 'zindex',
						controller: function ($scope, $uibModalInstance, dd) {
							var pick_lat = dd.latitude;
							var pick_lon = dd.longitude;
							$scope.map = {
								center: { latitude: dd.latitude, longitude: dd.longitude }, 
								zoom: 13, 
								bounds: {},
								events: {
									idle: function (map) {
										map.setCenter({lat: parseFloat(pick_lat), lng: parseFloat(pick_lon)});
										$scope.$apply(function () {
											google.maps.event.trigger(map, "resize");
										});
									},
								},
								control: {},
							};
							
							$scope.marker = {
								id: 0,
								coords: {
									latitude: dd.latitude,
									longitude: dd.longitude
								},
								options: { draggable: true },
								events: {
									dragend: function (marker, eventName, args) {
										var lat = marker.getPosition().lat();
										var lon = marker.getPosition().lng();
										pick_lat = lat;
										pick_lon = lon;

										$scope.marker.options = {
											draggable: true,
											labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
											labelAnchor: "100 0",
											labelClass: "marker-labels"
										};
									}
								}
							};
							
							$scope.saveCoord = function () {
								dd.latitude = pick_lat;
								dd.longitude = pick_lon;
								$uibModalInstance.close();
							};
							
							$scope.cancel = function () {
								$uibModalInstance.dismiss('cancel');
							};
						},
						size: size,
						resolve: {
							dd: function () {
								return $scope;
							}
						}
					});

					modalInstance.result.then(function (selectedItem) {
						$scope.selected = selectedItem;
					});
				}
			},
			size: size,
			resolve: {
				dorm: function () {
					return data;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		});
	}
	
	$scope.addDormitory = function (size) {
		var modalInstance = $uibModal.open({
			windowClass: "animated fadeIn",
			templateUrl: 'addDormitory',
			controller: function ($scope, $uibModal, $uibModalInstance, $localStorage, AjaxService, dorm, toaster) {
				
				$scope.cancel = function () {
					$uibModalInstance.dismiss('cancel');
				};
				
				$scope.addsave = function () {
					data = {
						'name':$scope.name,
						'longitude':$scope.longitude,
						'latitude':$scope.latitude,
						'address':$scope.address,
						'number_of_room':$scope.number_of_room,
						"price":$scope.price,
						"description":$scope.description,
						"status":$scope.status,
					};
					AjaxService.sendAjax("/api/dp/dorm/addsave", "POST",data).success(function(data, status, headers, config) {
						if (data.status == 'OK') {
							dorm.push({
								'id':data.data.id,
								'dormProvider' : data.data.dormProvider,
								'telp' : data.data.telp,
								'name':$scope.name,
								'longitude':$scope.longitude,
								'latitude':$scope.latitude,
								'address':$scope.address,
								'number_of_room':$scope.number_of_room,
								"price":$scope.price,
								"description":$scope.description,
								"status":$scope.status,
								"status_value":($scope.status == 1) ? "Available" : "Not Available"
							});
							
							toaster.pop({
								type: 'success',
								title: 'Edit Success',
								body: 'Dormitory has been edited successfully',
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
				
				$scope.pickFromMap = function (size) {
					var modalInstance = $uibModal.open({
						windowClass: "animated fadeIn",
						templateUrl: 'pickLocation',
						windowClass: 'zindex',
						controller: function ($scope, $uibModalInstance, dd) {
							var pick_lat = -6.915258;
							var pick_lon = 107.622813;
							$scope.map = {
								center: { latitude: -6.915258, longitude: 107.622813 }, 
								zoom: 13, 
								bounds: {},
								events: {
									idle: function (map) {
										map.setCenter({lat: parseFloat(pick_lat), lng: parseFloat(pick_lon)});
										$scope.$apply(function () {
											google.maps.event.trigger(map, "resize");
										});
									},
								},
								control: {},
							};
							
							$scope.marker = {
								id: 0,
								coords: {
									latitude: -6.915258,
									longitude: 107.622813
								},
								options: { draggable: true },
								events: {
									dragend: function (marker, eventName, args) {
										var lat = marker.getPosition().lat();
										var lon = marker.getPosition().lng();
										pick_lat = lat;
										pick_lon = lon;

										$scope.marker.options = {
											draggable: true,
											labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
											labelAnchor: "100 0",
											labelClass: "marker-labels"
										};
									}
								}
							};
							
							$scope.saveCoord = function () {
								dd.latitude = pick_lat;
								dd.longitude = pick_lon;
								$uibModalInstance.close();
							};
							
							$scope.cancel = function () {
								$uibModalInstance.dismiss('cancel');
							};
						},
						size: size,
						resolve: {
							dd: function () {
								return $scope;
							}
						}
					});

					modalInstance.result.then(function (selectedItem) {
						$scope.selected = selectedItem;
					});
				}
			},
			size: size,
			resolve: {
				dorm: function () {
					return $scope.datas;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		});
	}
	
	$scope.removeDormitory = function (data,index) {
		SweetAlert.swal({
			title: "Are you sure?",
			text: "Your will not be able to recover this dormitory!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "No, cancel pls!",
			closeOnConfirm: false,
			closeOnCancel: false },
		function (isConfirm) {
			if (isConfirm) {
				AjaxService.sendAjax("/api/dp/dorm/delete/"+data.id, "GET",data).success(function(data, status, headers, config) {
					if (data.status == 'OK') {
						$scope.datas.splice(index, 1);
						SweetAlert.swal("Deleted!", "Your dormitory has been deleted.", "success");
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
				SweetAlert.swal("Cancelled", "Your dormitory is safe :)", "error");
			}
		});
	}
	
});


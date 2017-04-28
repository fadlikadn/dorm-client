angular.module('inspinia').controller('detailCtrl', function ($scope, $stateParams, $state, $localStorage, $uibModal, AuthenticationService, AjaxService, toaster, SweetAlert) {
	
	id_dorm = $stateParams.dormId;
	
	var my_rate = 0;
	
	$scope.map = {
		center: {latitude:-6.915258, longitude:107.622813}, 
		zoom: 17, 
		bounds: {},
		icon: {url:"/img/icon-300x300.png", scaledSize: new google.maps.Size(20, 20)},
		options: {scrollwheel: false}
	};
	
	$scope.marker = {
		id: 0,
		coords: {},
		options: {draggable: false},
    };
	$scope.carousel = {
		internval:5000
	};
	
	$scope.rate = 0;
	$scope.max = 5;
	$scope.isReadonly = false;
	$scope.currentRate = 0;

	$scope.hoveringOver = function(value) {
		$scope.overStar = value;
		$scope.percent = 100 * (value / $scope.max);
	};
	
	$scope.$watch('rate', function() {
		if ($scope.rate != my_rate) {
			data = {
				'id_dorm':id_dorm,
				'rate':$scope.rate
			};
			AjaxService.sendAjax("/api/dorm/rating", "POST",data).success(function(data, status, headers, config) {
				if (data.status == 'OK') {
					toaster.pop({
						type: 'success',
						title: 'Rating Success',
						body: 'Has been rated this dorm successfully',
					});
					my_rate = $scope.rate;
					checkRating();
				} else {
					toaster.pop({
						type: 'error',
						title: 'Rating Failed',
						body: data.reason,
					});
					my_rate = 0;
					$scope.rate = 0;
				}
			}).error(function(data, status, headers, config) {
				toaster.pop({
					type: 'error',
					title: 'Rating Failed',
					body: "Cannot load page",
				});
				my_rate = 0;
				$scope.rate = 0;
			});
		}
        
    });

	$scope.ratingStates = [
		{stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
		{stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
		{stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
		{stateOn: 'glyphicon-heart'},
		{stateOff: 'glyphicon-off'}
	];
	
	function checkRating () {
		AjaxService.sendAjax("/api/dorm/checkrating/"+id_dorm, "GET").success(function(data, status, headers, config) {
			if (data.status == 'OK') {
				$scope.currentRate = data.data;
			} else {
				toaster.pop({
					type: 'error',
					title: 'Get Rating Failed',
					body: data.reason,
				});
			}
		}).error(function(data, status, headers, config) {
			toaster.pop({
				type: 'error',
				title: 'Get Rating Failed',
				body: "Cannot load page",
			});
		});
	}
	
	$scope.dorm = {};
	checkRating();
	AjaxService.sendAjax("/api/dorm/detail/"+id_dorm, "GET").success(function(data, status, headers, config) {
		if (data.status == 'OK') {
			dorm = {};
			dorm.id = data.data.id; 
			dorm.latitude = data.data.latitude; 
			dorm.longitude = data.data.longitude; 
			dorm.title = data.data.name; 
			dorm.address = data.data.address;
			dorm.price = data.data.price;
			dorm.number_of_room = data.data.numberOfRoom;
			dorm.dormProvider = data.data.dormProvider;
			dorm.usernameDP = data.data.usernameDP;
			dorm.telp = data.data.telp;
			dorm.description = data.data.description;
			dorm.status = data.data.status;
			dorm.status_value = (data.data.status == 1) ? "Available" : "Not Available";
			dorm.photos = [];
			
			my_rate = data.data.myrating;
			$scope.rate = data.data.myrating;
			
			if (data.data.photos.length > 0) {
				var photos = data.data.photos;
				for (i=0;i<photos.length;i++) {
					img_url = AjaxService.getImageUrl(photos[i].url);
					dorm.photos.push({name:img_url,caption:photos[i].caption,status:1,dp_username:photos[i].dp_username,id:photos[i].id});
				}
			} else {
				dorm.photos.push({name:"img/no_image_available_10.png",caption:"No Photo Available",status:0});
			}
			
			$scope.dorm = dorm;
			
			$scope.map.center.latitude = data.data.latitude;
			$scope.map.center.longitude = data.data.longitude;
			$scope.marker.coords.latitude = data.data.latitude;
			$scope.marker.coords.longitude = data.data.longitude;
			
		} else {
			toaster.pop({
				type: 'error',
				title: 'ERROR',
				body: data.reason,
			});
			$state.go('finddorm.maps');
		}
	}).error(function(data, status, headers, config) {
		toaster.pop({
			type: 'error',
			title: 'ERROR',
			body: "Error "+status+" When Load Page",
		});
	});
	
	$scope.checkBook = function (dorm_status) {
		if (AuthenticationService.isUser() && dorm_status == 1) {
			return true;
		} else {
			return false;
		}
	}
	
	$scope.isDormOwner = function (dp_username) {
		if (typeof dp_username == 'undefined') {
			return false;
		} else {
			return (($localStorage.username == dp_username) || (($localStorage.role.indexOf("ROLE_ADMIN") !== -1)));
		}
	}
	
	
	$scope.deletePhoto = function (id,index) {
		SweetAlert.swal({
			title: "Are you sure?",
			text: "You will not be able to recover this photo!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "No, cancel plx!",
			closeOnConfirm: false,
			closeOnCancel: false },
		function (isConfirm) {
			if (isConfirm) {
				AjaxService.sendAjax("/api/dorm/photo/delete/"+id, "GET").success(function(data, status, headers, config) {
					if (data.status == 'OK') {
						$scope.dorm.photos.splice(index, 1);
						SweetAlert.swal("Deleted!", "Your photo has been deleted.", "success");
					} else {
						toaster.pop({
							type: 'error',
							title: 'Delete Failed',
							body: data.reason,
						});
					}
				}).error(function(data, status, headers, config) {
					toaster.pop({
						type: 'error',
						title: 'Delete Failed',
						body: "Cannot load page",
					});
				});
				
			} else {
				SweetAlert.swal("Cancelled", "Your photo is safe :)", "error");
			}
		});
	}
	
	$scope.bookDormForm = function (size) {
		var modalInstance = $uibModal.open({
			windowClass: "animated fadeIn",
			templateUrl: 'bookDorm',
			controller: function ($scope, $state, $uibModalInstance, AjaxService, dorm, toaster) {
				$scope.ajaxLoading = false;
				
				$scope.rooms = [];
				
				$scope.selectRoom = function (room) {
					room.available=!room.available;
					room.selected=!room.selected;
					
				}
				
				for (i=1;i<=dorm.number_of_room;i++) {
					$scope.rooms.push({id:i,title:'Room '+i,booked:false,available:true,selected:false});
				}
				
				$scope.options = {
					eventHandlers: {
						'apply.daterangepicker': function(ev, picker) {
							dateStart = picker.startDate;
							dateEnd = picker.endDate;
							dateCount = dateStart.clone();
							
							if (dateStart.format('YYYY-MM-DD') == dateEnd.format('YYYY-MM-DD')) {
								toaster.pop({
									type: 'error',
									title: 'Choose Period Failed',
									body: "Minimum 1 night",
								});
							} else {
								data = {
									'id_dorm':dorm.id,
									'checkin_date':dateStart.format('YYYY-MM-DD'),
									'checkout_date':dateEnd.format('YYYY-MM-DD'),
								};
								AjaxService.sendAjax("/api/dorm/booking-schedule", "POST",data).success(function(data, status, headers, config) {
									if (data.status == 'OK') {
										var rooms = [];
										for (i=1;i<=dorm.number_of_room;i++) {
											if (data.data.indexOf(i) != -1) {
												rooms.push({id:i,title:'Room '+i,booked:true,available:false,selected:false});
											} else {
												rooms.push({id:i,title:'Room '+i,booked:false,available:true,selected:false});
											}
										}
										$scope.rooms = rooms;
									} else {
										toaster.pop({
											type: 'error',
											title: 'Booking Failed',
											body: data.reason,
										});
									}
								}).error(function(data, status, headers, config) {
									toaster.pop({
										type: 'error',
										title: 'Booking Failed',
										body: "Cannot load page",
									});
								});
							}
							
						},
					},
					minDate: moment(),
					disableDates: [],
					separator:' : '
				};
				$scope.daterange = {startDate: null, endDate: null};
				
				
				$scope.cancel = function () {
					$uibModalInstance.dismiss('cancel');
				};
				
				
				$scope.submitBook = function () {
					checkin = $scope.daterange.startDate.format('YYYY-MM-DD');
					checkout = $scope.daterange.endDate.format('YYYY-MM-DD');
					rooms = $scope.rooms;
					
					room_number = []
					for (i=0;i<rooms.length;i++) {
						if (rooms[i].selected) {
							room_number.push(rooms[i].id);
						}
					}
					data = {
						'id_dorm':dorm.id,
						'checkin_date':checkin,
						'checkout_date':checkout,
						'room_number':room_number.join(','),
						'description':$scope.description
					};
					
					$scope.ajaxLoading = true;
					
					AjaxService.sendAjax("/api/booking/submit", "POST",data).success(function(data, status, headers, config) {
						if (data.status == 'OK') {
							toaster.pop({
								type: 'success',
								title: 'Booking Success',
								body: 'Dorm has been booked successfully',
							});
							$scope.ajaxLoading = false;
							$uibModalInstance.close();
							$state.go('mybooking.booking');
						} else {
							toaster.pop({
								type: 'error',
								title: 'Booking Failed',
								body: data.reason,
							});
							$scope.ajaxLoading = false;
						}
					}).error(function(data, status, headers, config) {
						toaster.pop({
							type: 'error',
							title: 'Booking Failed',
							body: "Cannot load page",
						});
						$scope.ajaxLoading = false;
					});
				};
			},
			size: size,
			resolve: {
				dorm: function () {
					return $scope.dorm;
				}
			}
		});
		
		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		});
		
	}
	
	$scope.uploadForm = function (size) {
		var modalInstance = $uibModal.open({
			windowClass: "animated fadeIn",
			templateUrl: 'uploadPhoto',
			controller: function ($scope, $state, $uibModalInstance, AjaxService, dorm, toaster) {
				$scope.cancel = function () {
					$uibModalInstance.dismiss('cancel');
				};
				$scope.submitFile = function() {
					if ($scope.form.file.$valid && $scope.file) {
						data = {
							'id_dorm':dorm.id,
							'file':$scope.file,
							'caption':$scope.caption,
						}; 
						
						AjaxService.uploadFile("/api/dorm/upload",data).then(function (resp) {
							data = resp.data;
							if (data.status == 'OK') {
								toaster.pop({
									type: 'success',
									title: 'Upload  Success',
									body: "Your Photo has been uploaded successfully",
								});
								if (dorm.photos[0].status == 0) {
									img_url = AjaxService.getImageUrl(data.data.url);
									dorm.photos = [{name:img_url,caption:data.data.caption,status:1,dp_username:data.data.dp_username,id:data.data.id}];
								} else {
									img_url = AjaxService.getImageUrl(data.data.url);
									dorm.photos.push({name:img_url,caption:data.data.caption,status:1,dp_username:data.data.dp_username,id:data.data.id});
								}
								
								$uibModalInstance.close();
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

				
			},
			size: size,
			resolve: {
				dorm: function () {
					return $scope.dorm;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		});
	}
});


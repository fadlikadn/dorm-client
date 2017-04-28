angular.module('inspinia').controller('mybookingCtrl', function ($scope, AjaxService, DTOptionsBuilder, DTColumnDefBuilder, toaster, SweetAlert) {
	$scope.dtOptions = DTOptionsBuilder.newOptions();
	
	$scope.dtColumns = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
		DTColumnDefBuilder.newColumnDef(3),
		DTColumnDefBuilder.newColumnDef(4),
		DTColumnDefBuilder.newColumnDef(5),
        DTColumnDefBuilder.newColumnDef(6).notSortable()
    ];

    
    $scope.datas = [];
	
	AjaxService.sendAjax("/api/booking/mybooking", "GET").success(function(data, status, headers, config) {
		if (data.status == 'OK') {
			var bookings = [];
			for (var i=0;i<data.data.length;i++) {
				if (data.data[i].status == 1) {
					status_value = "Waiting for Approval";
				} else if (data.data[i].status == 2) {
					status_value = "Rejected";
				} else if (data.data[i].status == 3) {
					status_value = "Approved";
				}
				bookings.push({
					id : data.data[i].id,
					dorm_name : data.data[i].dorm_name,
					dorm_id : data.data[i].dorm_id,
					checkin_date : data.data[i].checkin_date,
					checkout_date : data.data[i].checkout_date,
					room_number : data.data[i].room_number,
					dp_name : data.data[i].dp_name,
					description : data.data[i].description,
					status : data.data[i].status,
					status_value: status_value
				});
			}
			$scope.datas = bookings
			
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
	
	$scope.removeBooking = function (data,index) {
		SweetAlert.swal({
			title: "Are you sure?",
			text: "Your booking will be cancelled!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, cancel it!",
			cancelButtonText: "No plx!",
			closeOnConfirm: false,
			closeOnCancel: false },
		function (isConfirm) {
			if (isConfirm) {
				SweetAlert.swal({
					title: "",
					text: "Wait until ajax finished",
					timer: 8000,
					showConfirmButton: false,
					imageUrl: "img/loading.gif"
				});
				AjaxService.sendAjax("/api/booking/deletebooking/"+data.id, "GET").success(function(data, status, headers, config) {
					if (data.status == 'OK') {
						$scope.datas.splice(index, 1);
						SweetAlert.swal("Deleted!", "Your booking has been cancelled.", "success");
					} else {
						toaster.pop({
							type: 'error',
							title: 'Failed',
							body: data.reason,
						});
					}
				}).error(function(data, status, headers, config) {
					toaster.pop({
						type: 'error',
						title: 'Failed',
						body: "Cannot load page",
					});
				});
				
			} else {
				SweetAlert.swal("Booking", "Your booking is safe :)", "error");
			}
		});
	}
	
});


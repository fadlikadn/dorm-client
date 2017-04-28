angular.module('inspinia').controller('adminbookingCtrl', function ($scope, AjaxService, DTOptionsBuilder, DTColumnDefBuilder, toaster, SweetAlert) {
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
	
	AjaxService.sendAjax("/api/admin/booking/show", "GET").success(function(data, status, headers, config) {
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
					user_name : data.data[i].user_name,
					description : data.data[i].description,
					status : data.data[i].status,
					status_value: status_value
				});
			}
			$scope.datas = bookings;
			
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
	
	$scope.removeBooking = function (booking) {
		SweetAlert.swal({
			title: "Are you sure?",
			text: "This booking will be rejected!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, reject it!",
			cancelButtonText: "No cancel plx!",
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
				AjaxService.sendAjax("/api/admin/booking/reject/"+booking.id, "GET").success(function(data, status, headers, config) {
					if (data.status == 'OK') {
						SweetAlert.swal("Rejected!", "This booking has been rejected.", "success");
						booking.status = 2;
						booking.status_value = "Rejected";
					} else {
						toaster.pop({
							type: 'error',
							title: 'Reject Failed',
							body: data.reason,
						});
					}
				}).error(function(data, status, headers, config) {
					toaster.pop({
						type: 'error',
						title: 'Reject Failed',
						body: "Cannot load page",
					});
				});
				
			} else {
				SweetAlert.swal("Cancelled", "This booking is safe :)", "error");
			}
		});
	}
	
});


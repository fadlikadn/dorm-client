angular.module('inspinia').controller('mapsCtrl', function ($scope,$interval, $state, AjaxService, toaster) {
	var cur_lat = -6.915258;
	var cur_lon = 107.622813;
	$scope.map = {
		center: { latitude: cur_lat, longitude: cur_lon }, 
		zoom: 13, 
		bounds: {},
		icon: {url:"/img/icon-300x300.png", scaledSize: new google.maps.Size(20, 20)},
		events: {
			dragend: function(map) {
				//reloadMarker();
			},
			idle: function (map) {
				//reloadMarker(map.bounds);
			}
		}
	};
	
	$scope.address = {
	};
	
	$scope.$watch('address.detail', function() {
		if (typeof $scope.address.lat !== 'undefined' && typeof $scope.address.long !== 'undefined') {
			$scope.map.center.latitude = $scope.address.lat;
			$scope.map.center.longitude = $scope.address.long;
			
			if ($scope.address.detail.address_components[0].types[0] == 'route') {
				$scope.map.zoom = 16;
			} else if ($scope.address.detail.address_components[0].types[0] == "administrative_area_level_4") {
				$scope.map.zoom = 13;
			} else if ($scope.address.detail.address_components[0].types[0] == "administrative_area_level_3") {
				$scope.map.zoom = 12;
			} else if ($scope.address.detail.address_components[0].types[0] == "administrative_area_level_2") {
				$scope.map.zoom = 12;
			} else if ($scope.address.detail.address_components[0].types[0] == "administrative_area_level_1") {
				$scope.map.zoom = 11;
			} else if ($scope.address.detail.address_components[0].types[0] == "locality") {
				$scope.map.zoom = 12;
			} else if ($scope.address.detail.address_components[0].types[0] == "country") {
				$scope.map.zoom = 5;
			}
			
			reloadMarker();
		}
		
	}, true);
	
    $scope.windowOptions = {
		pixelOffset:new google.maps.Size(0, -20),
		maxWidth:300,
    };
	$scope.marker = {};
	
	$scope.detailDorm = function (id) {
		$state.go('finddorm.detail', {dormId: id});
	}
	
	$scope.onClick = function(marker, eventName, model) {
		$scope.marker.id = model.id;
		$scope.marker.title = model.title;
		$scope.marker.address = model.address;
		$scope.marker.price = model.price;
		$scope.marker.telp = model.telp;
		$scope.marker.dormProvider = model.dormProvider;
		$scope.marker.status = model.status;
		$scope.marker.status_value = model.status_value;
		$scope.marker.description = model.description;
		model.show = !model.show;
		$scope.activeModel = model;
    };
	
    $scope.listMarkers = [];
    // Get the bounds from the map once it's loaded
	
    $scope.$watch(function() {
		return $scope.map.bounds;
    }, function(nv, ov) {
		// Only need to regenerate once
		if (!ov.southwest && nv.southwest) {
			reloadMarker($scope.map.bounds);
		}
    }, true);
	
	
	
	reloadMarker = function(bounds) {
		var bounds = (typeof bounds !== 'undefined') ?  bounds : $scope.map.bounds;
		var markers = [];
		
		data = {
			ne_latitude:bounds.northeast.latitude,
			ne_longitude:bounds.northeast.longitude,
			sw_latitude:bounds.southwest.latitude,
			sw_longitude:bounds.southwest.longitude,
		}
		var getDorm = AjaxService.sendAjax("/api/dormitory/show", "POST", data);
		getDorm.success(function(data, status, headers, config) {
			$scope.listMarkers = [];
			if (data.status == 'OK') {
				for (var i=0;i<data.data.length;i++) {
					markers.push({
						id : data.data[i].id, 
						latitude : data.data[i].latitude, 
						longitude : data.data[i].longitude, 
						title : data.data[i].name, 
						address : data.data[i].address,
						price : data.data[i].price,
						dormProvider : data.data[i].dormProvider,
						telp : data.data[i].telp,
						description : data.data[i].description,
						status : data.data[i].status,
						status_value : (data.data[i].status == 1) ? "Available" : "Not Available",
					});
				}
				$scope.listMarkers = markers;
			} else {
				toaster.pop({
					type: 'error',
					title: 'ERROR',
					body: data.reason,
				});
			}
		}).error(function(data, status, headers, config) {
			toaster.pop({
				type: 'error',
				title: 'ERROR',
				body: "Error "+status+" When Load Page",
			});
			$interval.cancel(rm_interval);
			if (status == 401) {
				$state.go('logout');
			}
		});
		
	};
	
	function reloadMarkerInterval() {
		reloadMarker($scope.map.bounds);
	}
	var rm_interval = $interval(reloadMarkerInterval, 10000);
	
	$scope.$on("$destroy",function(){
		if (angular.isDefined(rm_interval)) {
			$interval.cancel(rm_interval);
		}
	});
	
	navigator.geolocation.getCurrentPosition(function(pos) {
		$scope.map.center.latitude = pos.coords.latitude;
		$scope.map.center.longitude = pos.coords.longitude;
		$scope.map.zoom = 15;
	}, function(error) {
		console.log(error.message);
	});
	
	
});
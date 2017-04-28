angular.module('inspinia').service('AjaxService', function ($http, $localStorage ,Upload) {
	var service = {};
	var api_url = "http://172.19.11.114:8000";
	service.sendAjax = function (url,method,data) {
		data = typeof data !== 'undefined' ? data : {};
		return $http({
			url: api_url+"/app_dev.php"+url,
			method: method,
			//withCredentials: true,
			headers: {
			   'Content-Type': 'application/x-www-form-urlencoded',
			   'Authorization': 'Bearer '+$localStorage.token
			},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
			data: data
		});
	}
	
	
	service.uploadFile = function (url,data) {
		return Upload.upload({
			url: api_url+"/app_dev.php"+url,
			data: data,
			headers: {
				'Authorization': 'Bearer '+$localStorage.token
			}
		});
	}
	
	service.getImageUrl = function (url) {
		return api_url+'/'+url;
	}
	
	return service;
});
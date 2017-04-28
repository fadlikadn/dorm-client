angular.module('inspinia').service('AuthenticationService', function ($localStorage) {
	var service = {};
	service.isAuth = isAuth;
	service.deleteCredentials = deleteCredentials;
	service.setCredentials = setCredentials;
	service.isAdmin = isAdmin;
	service.isDp = isDp;
	service.isUser = isUser;
	return service;
	function isAuth() {
		if (typeof $localStorage.token != 'undefined') {
			return true;
		} else {
			return false;
		}
	}
	
	function deleteCredentials() {
		delete $localStorage.token;
		delete $localStorage.role;
		delete $localStorage.name;
		delete $localStorage.username;
		delete $localStorage.profpict;
	}
	
	function setCredentials(token, role, name, username, profpict) {
		$localStorage.token = token;
		$localStorage.role = role;
		$localStorage.name = name;
		$localStorage.username = username;
		$localStorage.profpict = profpict;
	}
	
	function isAdmin (){
		if ($localStorage.role.indexOf("ROLE_ADMIN") !== -1) {
			return true;
		} else {
			return false;
		}
	}
	
	function isDp (){
		if ($localStorage.role.indexOf("ROLE_DP") !== -1) {
			return true;
		} else {
			return false;
		}
	}
	
	function isUser (){
		if ($localStorage.role.indexOf("ROLE_USER") !== -1) {
			return true;
		} else {
			return false;
		}
	}
	
});
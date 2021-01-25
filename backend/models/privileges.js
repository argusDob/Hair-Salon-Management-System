"use strict";

// Booking-Clients-Services-Employees-Reports

const accountPrivileges = {
  basic:  '["CU--","---","----","----","----"]',
  low:    '["CRUD","CRUD","----","----","----"]',
  medium: '["CRUD","CRUD,"CRUD","-R--","----"]',
  high:   '["CRUD","CRUD","CRUD","CRUD","CRUD"]'
};
module.exports.getPrivileges = function() {
  return accountPrivileges;
};

function getModulePrivileges(user, token, moduleIndex) {

	if ((!user) || (!token) || (!user.permissions) || (user.permissions == 'none') || (!accountPrivileges[user.permissions])) { return false; }
	if (!moduleIndex) { moduleIndex = 0; }

	let theUserPrivileges = '';
	if (user.privileges) { theUserPrivileges = user.privileges; }
	else { theUserPrivileges = accountPrivileges[user.permissions]; }

	if ((!theUserPrivileges) || (theUserPrivileges == '') || (theUserPrivileges.indexOf("[") != 0)) {
	return false; }
	const theModulePrivileges = JSON.parse(theUserPrivileges)[moduleIndex];
	if (theModulePrivileges.indexOf(token) != -1) { return theModulePrivileges; }
	return false;
}




module.exports.canCreateEmployees = function(user) {
	return getModulePrivileges(user, 'C', 3);
//	return 'CRUD';
};
module.exports.canReadEmployees = function(user) {
	return getModulePrivileges(user, 'R', 3);
};
module.exports.canUpdateEmployees = function(user) {
	return getModulePrivileges(user, 'U', 3);
};
module.exports.canDeleteEmployees = function(user) {
	return getModulePrivileges(user, 'D', 3);
};




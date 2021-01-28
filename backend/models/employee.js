"use strict";
const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const employeeScheduleSchema = new Schema({
	startTime:{ type: String },
	breakStartTime: { type: String },
	breakEndTime: { type: String },
	endTime: { type: String },
	date: { type: Date }
})

const employeeSchema = new Schema({
	createdAt: { type: Date, default: Date.now },
	createdBy: { type: String },
	updatedAt: { type: Date },
	updatedBy: { type: String },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	mobileNumber: { type: String },
	title: { type: String },
	notes: { type: String },
	startDate: { type: Date },
	endDate: { type: Date },
	userRefs: { type: mongoose.Schema.Types.ObjectId, ref: "UserSchema" },
	employeeSchedule: [employeeScheduleSchema]


});




//userSchema.index({ licenceId: 1, type: 1 });
employeeSchema.pre('save', function(next) {
	const currentDate = new Date();
	this.updatedAt = currentDate;
	next();
});
const newEmployee = module.exports = mongoose.model('Employee', employeeSchema);



const anEmptyEmployeeRecord = {
	updatedBy: null,
	firstName:null,
	lastName:null,
	mobileNumber: null,
	title: null,
	notes: null,
	startDate:null,
	endDate: null,
	userRefs:null

};

//todo change new employee
const theSelectEmployeesFields = {}; for (let aField in anEmptyEmployeeRecord) { theSelectEmployeesFields[aField] = 1; }

module.exports.addEmployee = function(callback, newUser) {
    const newValues = {};
    for (let aField in anEmptyEmployeeRecord) { if (newUser[aField]) { newValues[aField] = newUser[aField]; } }
    newEmployee.create(newValues, callback);
  };


  module.exports.getAllEmployees = function(requester, callback, maxEmployees, skipUsers) {
	const theSortFields = { lastName: 1 };
	if ( (!maxEmployees) || (isNaN(maxEmployees)) ) { maxEmployees = 1000; }
		newEmployee.find().limit(maxEmployees).select(theSelectEmployeesFields).sort(theSortFields).exec(callback);
	
};

module.exports.getEmployeeById = function(callback, employeeId) { 
	newEmployee.find({ "_id" : employeeId }).exec(callback)
}

// Update
module.exports.updateEmployee = function(requester, callback, updatedEmployee) {
	const updateOptions = { new: true, upsert: false, runValidators: true, setDefaultsOnInsert: true };
	let updateValues = {};
	for (let aField in anEmptyEmployeeRecord) {
		if (updatedEmployee[aField]) { if (updatedEmployee[aField].trim) { updateValues[aField] = updatedEmployee[aField].trim(); } else { updateValues[aField] = updatedEmployee[aField]; } }
	}
	updateValues.updatedBy = requester._id;
	newEmployee.findByIdAndUpdate(updatedEmployee._id, updateValues, updateOptions, callback);
};

module.exports.deleteEmployeeById = function(callback, employeeId) { 
	newEmployee.deleteOne({ "_id" : employeeId }).exec(callback)
}

const anEmptyWorkingDaysRecord = {
	startTime: null,
	endTime:null,
	date: null,
};

module.exports.addWorkingHours = function(requester, callback, newWorkingHours, employeeId) {
	const updateOptions = { new: true, upsert: false, runValidators: true, setDefaultsOnInsert: true };
	let updateValues = {};
	for (let aField in anEmptyWorkingDaysRecord) {
		if (newWorkingHours[aField]) { if (newWorkingHours[aField].trim) { updateValues[aField] = newWorkingHours[aField].trim(); } else { updateValues[aField] = newWorkingHours[aField]; } }
	}
	newEmployee.updateOne( { "_id" : employeeId }, { $push : { workingDays :updateValues } }, updateOptions ).exec(callback);

};

module.exports.getAllWorkingHours = function(callback) {
	newEmployee.find({ "employeeSchedule": { $exists : true }}).exec(callback);

}

module.exports.getEmployeesScheduleByDateRange = function(callback, theStartDate, theEndDate) {
	// newEmployee.find({"employeeSchedule.date: {$gt:  new Date('2021-01-26'),n $lt:new Date('2021-01-27')}}).exec(callback);
	newEmployee.aggregate([{
		$project: {
			firstName: "$firstName",
			lastName: "$lastName",
 			employeeSchedule: {
				$filter: {
					input: '$employeeSchedule',
					as: 'employeeSchedules',
					cond: {
						$and: [
						 { $gte: [ '$$employeeSchedules.date', new Date(theStartDate) ] },
						 { $lte: [ '$$employeeSchedules.date',new Date(theEndDate + 'T23:59:59.587+00:00') ] }
						]
					}
				}
			}
		}
	}]).exec(callback)








	// newEmployee.find({ employeeSchedule : { $elemMatch : {
	// 	$and:[ { date: {$gt: new Date('2021-01-27')}},
	// 				 { date: {$lt: new Date('2021-01-30') }}
	// 				]
	// 	}}
	// }).exec(callback);

}
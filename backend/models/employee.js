"use strict";
const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const employeeScheduleSchema = new Schema({
	name: { type: String },
	startTime:{ type: String },
	breakStartTime: { type: String },
	breakEndTime: { type: String },
	endTime: { type: String },
	date: { type: Date },
	isHolidays: { type: Boolean}
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
	userRefs: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
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
		newEmployee.find().populate("userRefs").exec(callback);
	
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
	breakStartTime: null,
	breakEndTime: null,
	endTime:null,
	date: null,
	isHolidays: null,
	name: null,
};

module.exports.addWorkingHours = function(requester, callback, newWorkingHours, employeeId) {
	const updateOptions = { new: true, upsert: false, runValidators: true, setDefaultsOnInsert: true };
	let updateValues = {};

	for (let aField in anEmptyWorkingDaysRecord) {
		if (newWorkingHours[aField]) { if (newWorkingHours[aField].trim) { updateValues[aField] = newWorkingHours[aField].trim(); } else { updateValues[aField] = newWorkingHours[aField]; } }
	}
	console.log(updateValues)
	newEmployee.updateOne( { "_id" : employeeId }, { $push : { employeeSchedule :updateValues } }, updateOptions ).exec(callback);

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
						 { $gte: [ '$$employeeSchedules.date', new Date(theStartDate + 'T00:00:00.587+00:00' ) ] },
						 { $lte: [ '$$employeeSchedules.date',new Date(theEndDate + 'T23:59:59.587+00:00') ] }
						]
						
					}
				}
			}
		}}]).exec(callback)}

		module.exports.updateEmployeeSchedule = function(callback, newWorkingHours, employeeId, employeeScheduleId) {
			const updateOptions = { new: true, upsert: false, runValidators: true, setDefaultsOnInsert: true };
			let updateValues = {};
			for (let aField in anEmptyWorkingDaysRecord) {
				if (newWorkingHours[aField]) { if (newWorkingHours[aField].trim) { updateValues[aField] = newWorkingHours[aField].trim(); } else { updateValues[aField] = newWorkingHours[aField]; } }
			}
			newEmployee.update({_id:employeeId, "employeeSchedule._id": employeeScheduleId}, {"$set":{"employeeSchedule.$":newWorkingHours}}, updateOptions).exec(callback);

		}

		module.exports.deleteAworkingSchedule = function(callback, employeeId, workingScheduleId) {
			newEmployee.findByIdAndUpdate(employeeId, { '$pull': {'employeeSchedule':{ '_id': workingScheduleId }}}).exec(callback);
		}

		module.exports.updateAllEmployeesSchedule = function(callback, workingScheduleId) {
			newEmployee.updateMany({}, {'$push': {'employeeSchedule' : workingScheduleId}}, {multi: true}).exec(callback);

		}

		module.exports.updateClosedDate = function(callback, theClosedDate) {
			newEmployee.update({ employeeSchedule: { $elemMatch: { _id: theClosedDate._id } } }, { $set: { "employeeSchedule.$[el].name": theClosedDate.name, "employeeSchedule.$[el].date":new Date(theClosedDate.date), }}, { multi: true, arrayFilters: [{ "el._id": theClosedDate._id}] }).exec(callback)
		}

		module.exports.deleteClosedDate = function(callback, theClosedDateId) {
			newEmployee.updateMany({},{$pull: {employeeSchedule: {_id: theClosedDateId }}}).exec(callback)
		}


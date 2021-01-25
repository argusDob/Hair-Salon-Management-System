"use strict";
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const Schema = mongoose.Schema;
const userSchema = new Schema({
	createdAt: { type: Date, default: Date.now },
	createdBy: { type: String },
	updatedAt: { type: Date },
	updatedBy: { type: String },
  username: { type: String, required: true, unique: true, index: true },
	email: { type: String, required: true, unique: true },
	privileges: { type: String, default: '["CR--","---","----","----","----"]', required: true },
	permissions: { type: String, default: 'low', required: true },
	resetPasswordToken: { type: String, sparse: true },
	resetPasswordExpires: { type: Date, sparse: true },
});

userSchema.pre('save', function(next) {
	const currentDate = new Date();
	this.updatedAt = currentDate;
	next();
});
userSchema.plugin(passportLocalMongoose, {usernameQueryFields: ["email"]});
const userAccount = module.exports = mongoose.model('Users', userSchema);

const anEmptyUserRecord = {
	updatedBy: null,
	email: null,
	username: null,
	privileges: null,
	permissions: null,
	resetPasswordToken: null,
	resetPasswordExpires: null,

};

//create
module.exports.addUser = function(callback, newUser) {
    const newValues = {};
    for (let aField in anEmptyUserRecord) { if (newUser[aField]) { newValues[aField] = newUser[aField]; } }
    userAccount.register(new userAccount(newValues), newUser.password, callback);
  };

	// Update
module.exports.updateUser = function(requester, callback, updatedUser) {
	const updateOptions = { new: true, upsert: false, runValidators: true, setDefaultsOnInsert: true };
	let updateValues = {};
	for (let aField in anEmptyUserRecord) {
		if (updatedUser[aField]) { if (updatedUser[aField].trim) { updateValues[aField] = updatedUser[aField].trim(); } else { updateValues[aField] = updatedUser[aField]; } }
	}
	updateValues.updatedBy = requester._id;
	userAccount.findByIdAndUpdate(updatedUser._id, updateValues, updateOptions, callback);
};

module.exports.updatePassword = function(requester, callback, updatedUser) {
	userAccount.findById(updatedUser._id, function(err, user) {
		if (err) { callback(err, user); return; }
		user.setPassword(updatedUser.password, function() {
			user.save(function (err) { if (err) { return callback(err, user); } else { return callback(null, user); } });
//			callback(null, user);
		});
	});
};


module.exports.getUserById = function(callback, userId) { 
	userAccount.find({ "_id" : userId }).exec(callback)
}

module.exports.deleteUserById = function(callback, userId) { userAccount.deleteOne({ "_id" : userId }).exec() }


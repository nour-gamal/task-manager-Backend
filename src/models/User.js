const mongoose = require("mongoose");
const validator = require("validator");
const bycrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
	name: { type: String, trim: true },
	age: {
		type: Number,
		validate(value) {
			if (value < 0) {
				throw new Error("Age must be a positive number");
			}
		},
		default: 0,
	},
	email: {
		type: String,
		required: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("Email is Invalid");
			}
		},
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
		validate(value) {
			if (value.toLowerCase().includes("password")) {
				throw new Error("Password cannot contains the word Password");
			}
		},
		trim: true,
		lowercase: true,
		minLength: 7,
	},
});

userSchema.pre("save", async function (next) {
	const user = this;

	if (user.isModified("password")) {
		user.password = await bycrypt.hash(user.password, 8);
	}

	next(); //to excute the code after-- save
});
const User = mongoose.model("user", userSchema);

module.exports = User;

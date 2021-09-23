const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
		unique: true,
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
		minLength: 7,
	},
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
});

userSchema.virtual("userTasks", {
	ref: "Task",
	localField: "_id",
	foreignField: "owner",
});

userSchema.methods.generateAuthToken = async function () {
	const user = this;

	const token = jwt.sign({ _id: user._id.toString() }, "thisismytoken");
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

userSchema.methods.getPublicProfile = async function () {
	const user = this;
	const userObj = user.toObject();

	delete userObj.password;
	delete userObj.tokens;

	return userObj;
};

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("Invalid login attempt!");
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error("Invalid login attempt!");
	}

	return user;
};

// hash the password of the user
userSchema.pre("save", async function (next) {
	const user = this;

	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}

	next(); //to excute the code after-- save
});
const User = mongoose.model("user", userSchema);

module.exports = User;

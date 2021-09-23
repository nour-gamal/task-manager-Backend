const mongoose = require("mongoose");

const Task = mongoose.model("Task", {
	description: { type: String, required: true, trim: true },
	completed: {
		type: Boolean,
		require: false,
		default: false,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "user",
	},
});

module.exports = Task;

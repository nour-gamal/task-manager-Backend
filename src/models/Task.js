const mongoose = require("mongoose");

const Task = mongoose.model("Task", {
	description: { type: String, required: true, trim: true },
	completed: {
		type: Boolean,
		require: false,
		default: false,
	},
});

module.exports = Task;

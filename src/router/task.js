const express = require("express");
const taskRouter = new express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");

taskRouter.post("/addTask", auth, async (req, res) => {
	const task = new Task({ ...req.body, owner: req.user._id });

	try {
		const newTask = await task.save();

		res.status(201).send({ status: 201, message: "Task Added", task: newTask });
	} catch (e) {
		res.status(400).status({
			status: 400,
			error: e,
		});
	}
});

taskRouter.get("/getTaskById", auth, async (req, res) => {
	const id = req.query.id;
	if (!id) {
		return res.status(404).send({
			message: "Id property missing!",
			status: 404,
		});
	}

	try {
		const task = await Task.findOne({ _id: id, owner: req.user._id });
		if (!task) {
			return res.status(404).send({
				status: 400,
				message: "Task or User is wrong!",
			});
		}
		res.status(200).send({ status: 200, data: task });
	} catch (e) {
		res.status(500).send({
			status: 500,
			e: e,
		});
	}
});

taskRouter.get("/getAllTasks", auth, async (req, res) => {
	try {
		const Tasks = await Task.find({ owner: req.user._id });
		res.status(200).send({
			status: 200,
			data: Tasks,
		});
	} catch (err) {
		res.status(401).send({
			status: 401,
			error: err,
		});
	}
});

taskRouter.get("/removeReturnUncompleteTasks", async (req, res) => {
	const id = req.query.id;
	if (!id) {
		return res.status(400).send({
			message: "id property missing",
		});
	}
	try {
		const removedTask = await Task.findByIdAndDelete(id);
		const uncompletedTasks = await Task.find({ completed: false });
		res.status(200).send({
			status: 200,
			data: uncompletedTasks,
		});
	} catch (e) {
		res.status(404).send({
			status: 404,
			error: e,
		});
	}
});

taskRouter.patch("/editTask", async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ["description", "completed"];
	const id = req.query.id;

	if (!id) {
		return res
			.status(400)
			.send({ status: 400, message: "id property Missing !" });
	}

	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);

	if (!isValidOperation) {
		return res
			.status(400)
			.send({ status: 400, message: "Invalid Operation !" });
	}
	try {
		// const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
		// 	new: true,
		// 	runValidators: true,
		// });

		const updatedTask = await Task.findById(id);
		updates.forEach((update) => (updatedTask[update] = req.body[update]));
		await updatedTask.save();

		res.status(201).send({ status: 201, task: updatedTask });
	} catch (e) {
		res.status(401).send({ status: 401, error: e });
	}
});

taskRouter.delete("/deleteTask", async (req, res) => {
	const id = req.query.id;
	if (!id) {
		return res.status(404).send({
			status: 400,
			data: "id Property is missing!",
		});
	}
	try {
		const deletedTask = await Task.findByIdAndDelete(id);
		res.status(200).send({
			status: 200,
			task: deletedTask,
			message: "task deleted !",
		});
	} catch (e) {
		res.status(404).send({
			status: 404,
			message: "task not found!",
		});
	}
});

module.exports = taskRouter;

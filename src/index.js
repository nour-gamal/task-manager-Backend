const express = require("express");
require("./db/mongoose");
const Task = require("./models/Task");
const User = require("./models/User");
const app = express();
const port = process.env.PORT;

app.use(express.json());

app.post("/adduser", async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		res.status(201).send({ status: 201, user });
	} catch (e) {
		res.status(400).send({ status: 400, error: e });
	}
});

app.get("/getAllUsers", async (req, res) => {
	try {
		const users = await User.find({});

		res.status(200).send({
			status: 200,
			users,
		});
	} catch (e) {
		res.status(401).send(e);
	}
});

app.get("/getUserById", async (req, res) => {
	const id = req.query.id;
	if (!id) {
		return res.status(400).send({
			message: "id property missing !",
			status: 400,
		});
	}
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).send({
				status: 404,
				error: "User not found!",
			});
		}
		res.status(201).send({
			status: 201,
			user,
		});
	} catch (e) {
		res.status(500).send({
			status: 500,
			error: e,
		});
	}
});

app.post("/addTask", async (req, res) => {
	const task = new Task(req.body);

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

app.get("/getTaskById", async (req, res) => {
	const id = req.query.id;
	if (!id) {
		return res.status(404).send({
			message: "Id property missing!",
			status: 404,
		});
	}

	try {
		const task = await Task.findById(id);

		res.status(200).send({ status: 200, data: task });
	} catch (e) {
		res.status(500).send({
			status: 500,
			e: e,
		});
	}
});

app.get("/getAllTasks", (req, res) => {
	Task.find({})
		.then((Tasks) => {
			res.status(200).send({
				status: 200,
				data: Tasks,
			});
		})
		.catch((err) => {
			res.status(401).send({
				status: 401,
				error: err,
			});
		});
});

app.get("/removeReturnUncompleteTasks", async (req, res) => {
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

app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});

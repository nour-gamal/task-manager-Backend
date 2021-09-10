const express = require("express");
require("./db/mongoose");
const Task = require("./models/Task");
const User = require("./models/User");
const app = express();
const port = process.env.PORT;

app.use(express.json());

app.post("/adduser", (req, res) => {
	const user = new User(req.body);
	user
		.save()
		.then(() => {
			res.status(201).send(user);
		})
		.catch((err) => {
			res.status(400).send(err);
		});
});

app.get("/getAllUsers", (req, res) => {
	User.find({})
		.then((User) => res.send(User))
		.catch((e) => res.status(500).send(e));
});
app.get("/getUserById", (req, res) => {
	const id = req.query.id;
	if (!id) {
		return res.status(400).send({
			message: "id property missing !",
			status: 400,
		});
	}
	User.findById(id)
		.then((user) => {
			if (!user) {
				return res.status(404).send({
					message: "User not found",
					status: 404,
				});
			}

			res.send(user);
		})
		.catch((e) => res.status(500).send(e));
});

app.post("/addTask", (req, res) => {
	const task = new Task(req.body);

	task
		.save()
		.then(() => {
			res.status(201).send(task);
		})
		.catch((e) => res.status(400).send(e));
});

app.get("/getTaskById", (req, res) => {
	const id = req.query.id;
	if (!id) {
		return res.status(404).send({
			message: "Id property missing!",
			status: 404,
		});
	}
	Task.findById(id)
		.then((Task) => {
			res.status(200).send({
				status: 401,
				data: Task,
			});
		})
		.catch((err) => {
			res.status(401).send({
				status: 401,
				error: err,
			});
		});
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

app.get("/removeReturnUncompleteTasks", (req, res) => {
	const id = req.query.id;
	if (!id) {
		return res.status(400).send({
			message: "id property missing",
		});
	}
	Task.findByIdAndDelete(id)
		.then((task) => {
			if (!task) {
				return res.status(404).send({ status: 404, message: "Task not found" });
			}
			return Task.countDocuments({ completed: false });
		})
		.then((task) => {
			res.status(201).send({ status: 201, uncompletedTasksCount: task });
		})
		.catch((e) => {
			res.status(401).send({ status: 401, error: e });
		});
});

app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});

const express = require("express");
const User = require("../models/User");

const userRouter = new express.Router();

userRouter.post("/adduser", async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		res.status(201).send({ status: 201, user });
	} catch (e) {
		res.status(400).send({ status: 400, error: e });
	}
});

userRouter.get("/getAllUsers", async (req, res) => {
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

userRouter.get("/getUserById", async (req, res) => {
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

userRouter.patch("/updateUser", async (req, res) => {
	const id = req.query.id;
	updates = Object.keys(req.body);
	const allowedUpdates = ["name", "age", "email", "password"];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);

	if (!id) {
		return res.status(400).send({
			status: 400,
			error: "Please provide an id !",
		});
	}

	if (!isValidOperation) {
		return res
			.status(401)
			.send({ status: 401, message: "invalid opperation !" });
	}

	try {
		const user = await User.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!user) {
			return res.status(404).send({ status: 404, message: "User Not Found !" });
		}

		res
			.status(201)
			.send({ status: 201, message: "updated Successfully !", data: user });
	} catch (e) {
		res.status(500).send({ status: 500, error: e });
	}
});
userRouter.delete("/deleteUser", async (req, res) => {
	const id = req.query.id;
	if (!id) {
		return res.status(404).send({
			status: 400,
			data: "id Property is missing!",
		});
	}
	try {
		const deletedUser = await User.findByIdAndDelete(id);
		res.status(200).send({
			status: 200,
			user: deletedUser,
			message: "user deleted !",
		});
	} catch (e) {
		res.status(404).send({
			status: 404,
			message: "user not found!",
		});
	}
});

module.exports = userRouter;
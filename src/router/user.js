const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const userRouter = new express.Router();

userRouter.post("/register", async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).send({ status: 201, user, token });
	} catch (e) {
		res.status(400).send({ status: 400, error: e });
	}
});

userRouter.post("/user/login", async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	try {
		const user = await User.findByCredentials(email, password);
		const token = await user.generateAuthToken();
		const publicProfile = await user.getPublicProfile();
		res.status(201).send({
			status: 201,
			user: publicProfile,
			token,
		});
	} catch (e) {
		res.status(400).send();
	}
});

userRouter.post("/users/logout", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});
		await req.user.save();
		res.status(200).send({
			status: 200,
			message: "Logout Success!",
		});
	} catch (e) {
		res.status(500).send({ status: 500, message: "Something went wrong!" });
	}
});

userRouter.post("/users/logoutAllSessions", auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.status(200).send({
			status: 200,
			message: "Logout all sessions",
		});
	} catch (e) {
		res.status(500).send({
			status: 500,
			error: "fail to logout",
		});
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

userRouter.get("/user/me", auth, (req, res) => {
	res.send(req.user);
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

userRouter.patch("/me/update", auth, async (req, res) => {
	updates = Object.keys(req.body);
	const allowedUpdates = ["name", "age", "email", "password"];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);

	if (!isValidOperation) {
		return res
			.status(401)
			.send({ status: 401, message: "invalid opperation !" });
	}

	try {
		const user = req.user;
		updates.forEach((update) => (user[update] = req.body[update]));
		const updatedProf = await user.getPublicProfile();
		await user.save();

		if (!user) {
			return res.status(404).send({ status: 404, message: "User Not Found !" });
		}

		res
			.status(201)
			.send({
				status: 201,
				message: "updated Successfully !",
				data: updatedProf,
			});
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

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const decoded = jwt.verify(token, "thisismytoken");
		const user = await User.findOne({
			_id: decoded._id,
			"tokens.token": token,
		});
		if (!user) {
			throw new Error();
		}
		req.user = user;
		next();
	} catch (e) {
		res.status(401).send({
			status: 401,
			error: "User is not authenticated!",
		});
	}
};

module.exports = auth;

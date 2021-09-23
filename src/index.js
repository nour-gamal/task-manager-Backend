const express = require("express");
const cors = require("cors");
const userRouter = require("./router/user");
const taskRouter = require("./router/task");

require("./db/mongoose");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});

const User = require("./models/User");

// const main = async () => {
// 	const task = await Task.findById("614cd2f64f3109f29f861a1b");
// 	await task.populate("owner");
// 	const user = await User.findById("614cd1cdd445af97a3cc5592");
// 	await user.populate("userTasks");
// 	console.log(user.userTasks);
// };

// main();

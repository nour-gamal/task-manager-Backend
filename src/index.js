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

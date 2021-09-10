const mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/task-manger-api", {
// 	useNewUrlParser: true,
// 	useCreateIndex: true,
// 	useFindAndModify: false,
// });
mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => {})
	.catch((e) => console.log(e));

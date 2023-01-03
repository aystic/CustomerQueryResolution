const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { setupDB } = require("./utils/setupDB");
const chatRoutes = require("./routes/chat");
const loginRoutes = require("./routes/login");
const PORT = process.env.PORT || 8001;

setupDB();
const app = express();

app.use(bodyParser.json());

app.use(cors());

//Routes
app.use(loginRoutes);
app.use(chatRoutes);

//global error handler
app.use((error, req, res, next) => {
	console.error(error);
	const status = error.statusCode || 500;
	const message = error.message;
	res.status(status).json({
		message,
	});
});

//setting up the database connection
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

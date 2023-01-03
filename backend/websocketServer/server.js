const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "*",
	},
	path: "/ws/",
});

io.on("connection", (socket) => {
	console.log("Connected ", socket.id);
});

io.use((socket, next) => {
	const email = socket.handshake.auth.email;
	console.log(email);
	if (!email) {
		next(err);
	}
	socket.email = email;
	next();
});

app.use((err, req, res, next) => {
	console.error(err);
});

httpServer.listen(PORT);

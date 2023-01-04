const { io } = require("socket.io-client");
const auth = { isServer: true, passKey: process.env.WEBSOCKET_SERVER_PASSKEY };
const socket = io(process.env.WEBSOCKET_SERVER_URI, {
	path: "/ws/",
});
const setupSocket = () => {
	socket.auth = auth;
	socket.connect();
	socket.on("connect", () => {
		console.log("Connected to websocket server: ", new Date());
		socket.emit("startNewSession", auth, 1234);
	});
	socket.on("disconnect", (reason) => {
		if (reason === "io server disconnect") {
			socket.connect();
		}
		console.log("Disconnected from websocket server: ", new Date());
	});
	socket.on("error", ({ ...args }) => {
		console.log("error occured", args);
	});
};
module.exports = {
	socket,
	setupSocket,
	auth,
};

import { io } from "socket.io-client";

console.log(process.env.REACT_APP_WEBSOCKET_URL);
const socket = io(process.env.REACT_APP_WEBSOCKET_URL, {
	autoConnect: false,
	path: "/ws/",
});

socket.onAny((event, ...args) => {
	console.log(event, args);
});

export default socket;

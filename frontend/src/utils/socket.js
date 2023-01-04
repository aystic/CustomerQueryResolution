import { io } from "socket.io-client";
const socket = io(process.env.REACT_APP_WEBSOCKET_URL, {
	autoConnect: false,
	path: "/ws/",
});

socket.onAny((event, ...args) => {
	console.log(event);
});

export default socket;

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { initDB } = require("./utils/initializeDB");
const { saveChat } = require("./utils/saveChats");
const getCurrentChats = require("./utils/getCurrentChats");

/* IN PRODUCTION WE WILL USE REDIS  */
const { InMemorySessionStore } = require("./utils/sessionStore");
const { InMemoryAgentStore } = require("./utils/agentStore");
const { InMemoryUserStore } = require("./utils/userStore");
const sessionStore = new InMemorySessionStore();
const userStore = new InMemoryUserStore();
const agentStore = new InMemoryAgentStore();
const PORT = process.env.PORT || 8080;

(async () => {
	await initDB();
	const chatList = await getCurrentChats();
	chatList.forEach(async (chat) => {
		try {
			sessionStore.saveSession(chat.chatID, {
				user: {
					id: chat.userID,
					connected: false,
				},
				agent: {
					id: chat.agentID,
					connected: false,
				},
			});
		} catch (err) {
			console.error(err);
		}
	});
})();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "*",
	},
	path: "/ws/",
});

io.use(async (socket, next) => {
	try {
		const isServer = socket.handshake.auth.isServer;
		if (!isServer) {
			const email = socket.handshake.auth.email;
			const id = socket.handshake.auth.id;
			const isUser = socket.handshake.auth.isUser;
			if (
				[email, id, isUser].some((val) => val === undefined || val === null)
			) {
				throw new Error("Invalid credentials");
			}
			socket.email = email;
			socket.isUser = isUser;
			socket.userId = id;

			if (!isUser) {
				socket.join(process.env.SOCKETIO_AGENT_ROOM);
				agentStore.saveAgent(id, socket.id);
			} else {
				userStore.saveUser(id, socket.id);
			}
		} else {
			if (
				socket.handshake.auth.passKey !== process.env.WEBSOCKET_SERVER_PASSKEY
			) {
				throw new Error("Invalid credentials");
			}
		}
		next();
	} catch (err) {
		console.error(err);
		next(err);
	}
});

io.on("connection", (socket) => {
	console.log("Connected ", socket.id);
	console.log(userStore);
	console.log(agentStore);
	socket.on("newChatRequest", (auth) => {
		if (auth && auth.passKey === process.env.SOCKETIO_AGENT_ROOM)
			io.in(process.env.SOCKETIO_AGENT_ROOM).emit("newChatRequest");
	});

	socket.on("connectToChat", async (chatID, userID, agentID, isUser) => {
		try {
			if (
				[chatID, userID, agentID, isUser].some(
					(val) => val === null && val === undefined
				)
			) {
				throw new Error("Invalid payload");
			}
			let session = sessionStore.findSession(chatID);
			if (!session) {
				session = {
					user: {
						id: userID,
						connected: false,
					},
					agent: {
						id: agentID,
						connected: false,
					},
				};
			}
			if (isUser) {
				const socket = await io.in(userStore.findUser(userID)).fetchSockets();
				if (socket.length > 0) {
					socket[0].join(chatID);
					session.user.connected = true;
					console.log("userrooms:", socket[0].rooms);
				}
			} else {
				const socket = await io
					.in(agentStore.findAgent(agentID))
					.fetchSockets();
				if (socket.length > 0) {
					socket[0].join(chatID);
					session.agent.connected = true;
					console.log("agentrooms:", socket[0].rooms);
				}
			}
			sessionStore.saveSession(chatID, session);
		} catch (err) {
			console.error(err);
		}
	});

	socket.on("sendMessage", async (message) => {
		try {
			const session = sessionStore.findSession(message.chatID);
			if (session) {
				socket.in(message.chatID).emit("newMessage", message);
			}
			await saveChat(
				message.chatID,
				message.userID,
				message.agentID,
				message.message,
				message.sender
			);
		} catch (err) {
			console.error(err);
		}
	});
	socket.on("disconnecting", () => {
		console.log(socket.id, "disconnecting");
	});
});

httpServer.listen(PORT);

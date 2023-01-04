const { socket, auth } = require("../utils/setupSocket");
const Chat = require("../models/mongoChatModel");
const { QueryTypes } = require("sequelize");
const { dbConnection } = require("../utils/setupDB");
exports.getChatList = async (req, res, next) => {
	try {
		const { email, role, id } = req.body;
		if (!id) {
			const error = new Error("Invalid ID provided!");
			error.statusCode = 401;
			throw error;
		}
		let chatList;
		if (role === "user") {
			chatList = await dbConnection.query(
				`SELECT * FROM Chats WHERE userID = ?`,
				{
					replacements: [id],
					type: QueryTypes.SELECT,
				}
			);
		} else {
			chatList = await dbConnection.query(
				`SELECT *
				FROM Chats
				JOIN (
										SELECT chatID
				FROM ChatProgress
				WHERE agentID = ?
									) AS ChatList ON
												Chats.id = ChatList.chatID;`,
				{ replacements: [id], type: QueryTypes.SELECT }
			);
		}
		res.status(200).json({ data: chatList });
	} catch (err) {
		next(err);
	}
};

exports.createNewChat = async (req, res, next) => {
	try {
		const { id, email, priority, issue, subIssue, description, resolved } =
			req.body;
		console.log(req.body);
		if (
			[id, email, priority, issue, subIssue, description, resolved].some(
				(element) => element === undefined || element === null
			)
		) {
			const error = new Error("Invalid payload provided!");
			error.statusCode = 401;
			throw error;
		}
		const user = await dbConnection.query(
			`SELECT count(*) AS count
			FROM Users
			WHERE id = ?
			AND emailID =?`,
			{
				replacements: [id, email],
				type: QueryTypes.SELECT,
			}
		);
		if (user[0].count === 1) {
			const response = await dbConnection.query(
				`INSERT INTO
				Chats (
					userID, priority, issue, subIssue, description, resolved
				)
				VALUES(?,?,?,?,?,?);`,
				{
					replacements: [id, priority, issue, subIssue, description, resolved],
					type: QueryTypes.INSERT,
				}
			);
			const chat = new Chat({
				agentID: -1,
				chatID: response[0],
				userID: id,
				type: "message",
				sender: "user",
				timestamp: new Date(),
				message: description,
			});
			await chat.save();
			socket.emit("newChatRequest", auth);
			res.status(201).json({ message: "created", id: response[0] });
		} else {
			const error = new Error("Not allowed!");
			error.statusCode = 405;
			throw error;
		}
	} catch (err) {
		next(err);
	}
};

exports.getMessages = async (req, res, next) => {
	try {
		const { id } = req.body;
		if (!id) {
			const error = new Error("Invalid ID provided!");
			error.statusCode = 401;
			throw error;
		}
		const messageList = await Chat.find({ chatID: id }).sort({ timestamp: 1 });
		res.status(200).json({ data: messageList });
	} catch (err) {
		next(err);
	}
};

exports.markAsResolved = async (req, res, next) => {
	try {
		const { id, email, chatID, role } = req.body;
		if ([id, email, chatID].some((val) => val === null || val === undefined)) {
			const error = new Error("Invalid payload provided!");
			error.statusCode = 401;
			throw error;
		}
		let user;
		if (role === "user") {
			user = await dbConnection.query(
				`SELECT count(*) AS count
				FROM Users
				WHERE id = ?
				AND emailID =?`,
				{
					replacements: [id, email],
					type: QueryTypes.SELECT,
				}
			);
		} else {
			user = await dbConnection.query(
				`SELECT count(*) AS count
				FROM Agents
				WHERE id = ?
				AND emailID =?`,
				{
					replacements: [id, email],
					type: QueryTypes.SELECT,
				}
			);
		}
		if (user[0].count === 1) {
			const response = await dbConnection.query(
				`UPDATE Chats
				SET
									resolved = TRUE, resolvedBy =?
				WHERE id = ?;`,
				{
					replacements: [role === "agent" ? id : -1, chatID],
					type: QueryTypes.UPDATE,
				}
			);
			await dbConnection.query(
				`DELETE
				FROM ChatProgress
				WHERE chatID = ?;`,
				{
					replacements: [chatID],
					type: QueryTypes.DELETE,
				}
			);
			res
				.status(204)
				.json({ message: "Updated successfully", id: response[0] });
		} else {
			const error = new Error("Not allowed!");
			error.statusCode = 405;
			throw error;
		}
	} catch (err) {
		next(err);
	}
};

exports.getRequests = async (req, res, next) => {
	try {
		const { pageNumber, rowsPerPage } = req.body;
		if (
			[pageNumber, rowsPerPage].some((val) => val === null || val === undefined)
		) {
			const error = new Error("Invalid payload provided!");
			error.statusCode = 401;
			throw error;
		}
		const [total] = await dbConnection.query(
			`SELECT count(*) AS total
			FROM Chats
			WHERE resolved = FALSE
			AND id NOT IN (
									SELECT chatID
			FROM ChatProgress
			);`,
			{
				type: QueryTypes.SELECT,
			}
		);
		const data = await dbConnection.query(
			`SELECT *
			FROM Chats
			WHERE resolved = FALSE
			AND id NOT IN (
													SELECT chatID
			FROM ChatProgress
												)
			ORDER BY
														priority ASC, createdAt DESC
			LIMIT ?,?;`,
			{
				replacements: [(pageNumber - 1) * rowsPerPage, rowsPerPage],
				type: QueryTypes.SELECT,
			}
		);
		res.status(200).json({
			message: "Fetched successfully",
			data,
			range: {
				start: (pageNumber - 1) * rowsPerPage + 1,
				end: (pageNumber - 1) * rowsPerPage + data.length,
				total: total.total,
			},
		});
	} catch (err) {
		next(err);
	}
};

exports.addChatToResolve = async (req, res, next) => {
	try {
		const { id, email, chatID, toAdd, userID } = req.body;
		if (
			[id, email, chatID, toAdd, userID].some(
				(val) => val === null || val === undefined
			)
		) {
			const error = new Error("Invalid payload provided!");
			error.statusCode = 401;
			throw error;
		}
		let response;
		if (toAdd) {
			response = await dbConnection.query(
				`INSERT INTO
					ChatProgress (
						chatID, agentID,userID
												)
					VALUES (
										?,?,?
									);`,
				{
					replacements: [chatID, id, userID],
					type: QueryTypes.INSERT,
				}
			);
		} else {
			response = await dbConnection.query(
				`DELETE
				FROM ChatProgress
				WHERE chatID = ?
				AND agentID = ?
				AND userID= ? ;`,
				{
					replacements: [chatID, id, userID],
					type: QueryTypes.DELETE,
				}
			);
		}
		// socket.emit("startNewSession", auth);
		res.status(200).json({ message: "Successfully modified", data: response });
	} catch (err) {
		next(err);
	}
};

exports.getUserDetails = async (req, res, next) => {
	try {
		const { userID, isUser, chatID } = req.body;
		if (
			[userID, isUser, chatID].some((val) => val === null || val === undefined)
		) {
			const error = new Error("Invalid payload provided!");
			error.statusCode = 401;
			throw error;
		}
		let response;
		if (!isUser) {
			response = await dbConnection.query(
				`SELECT *
				FROM Users
				WHERE id =?;`,
				{
					replacements: [userID],
					type: QueryTypes.SELECT,
				}
			);
		} else {
			response = await dbConnection.query(
				`SELECT *
				FROM Agents
				WHERE id = (
											SELECT agentID
				FROM ChatProgress
				WHERE chatID = ?
										);`,
				{
					replacements: [chatID],
					type: QueryTypes.SELECT,
				}
			);
		}

		res.status(200).json({ message: "Fetched successfully", data: response });
	} catch (err) {
		next(err);
	}
};

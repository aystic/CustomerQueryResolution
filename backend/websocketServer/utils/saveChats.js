const Chat = require("../models/mongodbChatModel.js");

exports.saveChat = async (chatID, userID, agentID, message, sender) => {
	try {
		const chat = new Chat({
			chatID,
			userID,
			agentID,
			message,
			sender: sender,
			timestamp: new Date().toISOString(),
			type: "message",
		});
		const response = await chat.save();
		console.log(response);
	} catch (err) {
		console.error(err);
	}
};

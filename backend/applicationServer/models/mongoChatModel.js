const mongoose = require("mongoose");
const { Schema } = mongoose;

const ChatSchema = new Schema({
	chatID: Number,
	userID: Number,
	agentID: {
		type: Number,
		default: null,
	},
	type: String, //message or reply
	_linkedTo: {
		type: mongoose.SchemaTypes.ObjectId,
		default: null,
	}, //id of the message whose reply is this message in case the type is reply
	sender: String,
	timestamp: Date,
	message: String,
});

module.exports = mongoose.model("Chat", ChatSchema);

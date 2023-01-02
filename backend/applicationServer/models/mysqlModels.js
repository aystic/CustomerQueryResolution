const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize();

const User = sequelize.define("User", {
	id: {
		type: DataTypes.BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

const Agent = sequelize.define("Agent", {
	id: {
		type: DataTypes.BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

const Chat = sequelize.define("Chat", {
	id: {
		type: DataTypes.BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	priority: {
		type: DataTypes.INTEGER,
		defaultValue: 55,
	},
	issue: {
		type: DataTypes.STRING,
		defaultValue: "dummy",
	},
	issue: {
		type: DataTypes.STRING,
		defaultValue: "dummy",
	},
	issue: {
		type: DataTypes.STRING,
		defaultValue: "dummy",
	},
	resolved: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
});

const ChatProgress = sequelize.define(
	"ChatProgress",
	{
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		chatID: {
			type: DataTypes.BIGINT,
			allowNull: false,
			onDelete: "cascade",
			onUpdate: "cascade",
			references: {
				model: Chat,
				key: id,
			},
		},
		userID: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: User,
				key: id,
			},
		},
		agentID: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: Agent,
				key: id,
			},
		},
	},
	{
		freezeTableName: true,
	}
);

module.exports = {
	User,
	Agent,
	Chat,
	ChatProgress,
};

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
	userID: {
		type: DataTypes.BIGINT,
		allowNull: false,
		references: {
			model: User,
			key: id,
		},
	},
	priority: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 55,
	},
	issue: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: "dummy issue",
	},
	subIssue: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: "dummy subissue",
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: "some dummy description of the problem",
	},
	resolved: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
	resolvedBy: {
		type: DataTypes.BIGINT,
		allowNull: false,
		defaultValue: -1,
		references: {
			model: User,
			key: id,
		},
	},
	createdAt: {
		type: DataTypes.DATE,
		defaultValue: new Date(),
	},
	updatedAt: {
		type: DataTypes.DATE,
		defaultValue: new Date(),
		onUpdate: new Date(),
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

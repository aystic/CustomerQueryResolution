const { Sequelize, QueryTypes } = require("sequelize");
const mongoose = require("mongoose");

const sequelize = new Sequelize(
	process.env.MYSQL_DB,
	process.env.MYSQL_USER,
	process.env.MYSQL_PASSWORD,
	{
		host: process.env.MYSQL_HOST,
		dialect: "mysql",
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	}
);

const initDB = async () => {
	try {
		mongoose.set("strictQuery", false);
		await mongoose.connect(`${process.env.MONGODB_URI}`);
		console.log("Connection to mongoDB successful");
		await sequelize.authenticate();
		console.log("Connection to mysql db successful");
		await sequelize.query(
			`CREATE TABLE IF NOT EXISTS Users (
			id BIGINT NOT NULL AUTO_INCREMENT,
			emailID varchar(100) NOT NULL,
			CONSTRAINT users_PK PRIMARY KEY (id)
		);`,
			{
				type: QueryTypes.RAW,
			}
		);
		await sequelize.query(
			`CREATE TABLE IF NOT EXISTS Agents (
			id BIGINT NOT NULL AUTO_INCREMENT,
			emailID varchar(100) NOT NULL,
			CONSTRAINT agents_PK PRIMARY KEY (id)
		);`,
			{
				type: QueryTypes.RAW,
			}
		);
		await sequelize.query(
			`CREATE TABLE IF NOT EXISTS Chats (
			id BIGINT NOT NULL AUTO_INCREMENT,
			userID BIGINT NOT NULL,
			priority INT NOT NULL DEFAULT 55,
			issue varchar(100) NOT NULL DEFAULT "dummy",
			subIssue varchar(100) NOT NULL DEFAULT "dummy",
			description varchar(255) NOT NULL DEFAULT "dummy",
			resolved bool NOT NULL DEFAULT TRUE,
			resolvedBy BIGINT NOT NULL DEFAULT -1,
			createdAt timestamp DEFAULT current_timestamp,
			updatedAt timestamp DEFAULT current_timestamp ON UPDATE current_timestamp,
			CONSTRAINT chats_PK PRIMARY KEY (id),
			CONSTRAINT user_FK FOREIGN KEY (userID) REFERENCES Users(id) ON UPDATE CASCADE ON DELETE CASCADE
		);`,
			{
				type: QueryTypes.RAW,
			}
		);
		await sequelize.query(
			`CREATE TABLE IF NOT EXISTS ChatProgress (
			id BIGINT NOT NULL AUTO_INCREMENT,
			chatID BIGINT NOT NULL,
			agentID BIGINT NOT NULL,
			userID BIGINT NOT NULL,
			CONSTRAINT chatProgress_PK PRIMARY KEY (id),
			CONSTRAINT chatChatProgress_FK FOREIGN KEY (chatID) REFERENCES Chats(id) ON UPDATE CASCADE ON DELETE CASCADE,
			CONSTRAINT agentChatProgress_FK FOREIGN KEY (agentID) REFERENCES Agents(id) ON UPDATE CASCADE ON DELETE CASCADE,
			CONSTRAINT userChatProgress_FK FOREIGN KEY (userID) REFERENCES Users(id) ON UPDATE CASCADE ON DELETE CASCADE
		);`,
			{
				type: QueryTypes.RAW,
			}
		);
		console.log("MySQL tables initialized successfully");
	} catch (err) {
		console.error(err);
	}
};
module.exports = {
	initDB,
	dbConnection: sequelize,
};

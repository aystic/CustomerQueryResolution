const { Sequelize } = require("sequelize");
const mongoose = require("mongoose");

const sequelize = new Sequelize(
	process.env.MYSQL_DB,
	process.env.MYSQL_USER,
	process.env.MYSQL_PASSWORD,
	{
		host: "localhost",
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
	} catch (err) {
		console.error(err);
	}
};
module.exports = {
	initDB,
	dbConnection: sequelize,
};

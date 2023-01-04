const { QueryTypes } = require("sequelize");
const { dbConnection } = require("./initializeDB");

const getCurrentChats = async () => {
	try {
		const response = await dbConnection.query(`SELECT * FROM ChatProgress;`, {
			type: QueryTypes.SELECT,
		});
		return response;
	} catch (err) {
		console.error(err);
	}
};

module.exports = getCurrentChats;

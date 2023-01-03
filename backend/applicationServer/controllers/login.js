const { QueryTypes } = require("sequelize");
const { dbConnection } = require("../utils/setupDB");

exports.login = async (req, res, next) => {
	const { email, role } = req.body;
	try {
		let userData;
		if (role === "user") {
			userData = await dbConnection.query(
				`SELECT * FROM Users WHERE emailID=?`,
				{
					replacements: [email],
					type: QueryTypes.SELECT,
				}
			);
		} else {
			userData = await dbConnection.query(
				`SELECT * FROM Agents WHERE emailID=?`,
				{
					replacements: [email],
					type: QueryTypes.SELECT,
				}
			);
		}
		if (userData.length === 0) {
			res.status(404).json({ data: "User does not exists" });
		}
		res.status(200).json({ data: userData });
	} catch (err) {
		next(err);
	}
};

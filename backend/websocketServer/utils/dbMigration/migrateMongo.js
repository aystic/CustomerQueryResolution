const mongoose = require("mongoose");

(async () => {
	try {
		mongoose.set("strictQuery", false);
		await mongoose.connect(`${process.env.MONGODB_URI}`);
		console.log("Connection to mongoDB successful");

		console.log("MySQL tables initialized successfully");
	} catch (err) {
		console.error(err);
	}
})();

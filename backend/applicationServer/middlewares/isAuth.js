const isAuth = (req, res, next) => {
	const { email } = req.body;
	if (!email) {
		const error = new Error("No email ID provided!");
		error.statusCode = 401;
		next(error);
	}
	if (email.split("@")[1] === "agent.com") {
		req.body.role = "agent";
	} else {
		req.body.role = "user";
	}
	next();
};

module.exports = isAuth;

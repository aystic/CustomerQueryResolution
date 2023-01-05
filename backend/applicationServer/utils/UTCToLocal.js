const convertUTCToLocal = (date) => {
	return new Date("2023-01-02T05:04:36.768Z").toLocaleString("en-GB", {
		timeZone: "Asia/Kolkata",
	});
};

const convertLocalToUTC = (date) => {
	return JSON.stringify(new Date(date));
};

import axios from "axios";
export const createChat = async (postData) => {
	try {
		const data = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/newchat`
		);
		console.log(data);
	} catch (err) {
		throw new Error(err);
	}
};

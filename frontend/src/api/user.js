import axios from "axios";
export const createChat = async (postData) => {
	try {
		const data = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/new-chat`,
			postData
		);
		return data.data;
	} catch (err) {
		throw new Error(err);
	}
};

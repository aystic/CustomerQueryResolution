import axios from "axios";
export const login = async (email) => {
	try {
		const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}`, {
			email: `${email}`,
		});
		return response.data.data[0];
	} catch (err) {
		throw new Error(err);
	}
};

export const getChat = async (id, email) => {
	try {
		const response = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/chat`,
			{
				id,
				email,
			}
		);
		return response.data.data;
	} catch (err) {
		throw new Error(err);
	}
};

export const getChatMessages = async (chatID) => {
	try {
		const response = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/messages`,
			{
				id: chatID,
			}
		);
		return response.data.data;
	} catch (err) {
		throw new Error(err);
	}
};

export const markAsResolve = async (postData) => {
	try {
		const response = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/mark-as-resolved`,
			postData
		);
		return response.data.data;
	} catch (err) {
		throw new Error(err);
	}
};

export const getUserDetails = async (userID, isUser, chatID) => {
	try {
		const response = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/getUserDetails`,
			{
				userID,
				isUser,
				chatID,
			}
		);
		return response.data.data;
	} catch (err) {
		throw new Error(err);
	}
};

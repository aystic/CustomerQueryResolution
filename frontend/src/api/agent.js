import axios from "axios";

export const getRequests = async (pageNumber, rowsPerPage) => {
	try {
		const response = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/requests`,
			{
				pageNumber,
				rowsPerPage,
			}
		);
		return response.data;
	} catch (err) {
		throw new Error(err);
	}
};

export const markToResolve = async (postData) => {
	try {
		const response = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/add-to-resolve`,
			postData
		);
		return response.data;
	} catch (err) {
		throw new Error(err);
	}
};

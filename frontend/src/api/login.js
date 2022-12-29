import axios from "axios";
export const login = async (email) => {
	try {
		const data = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/login`,
			{
				email,
			}
		);
		return data;
	} catch (err) {
		throw new Error(err);
	}
};

import React, { createContext } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const GlobalContext = createContext({
	isLoggedIn: false,
	isUser: null,
	userData: {
		id: null,
		email: null,
		current: [],
		resolved: [],
	},
	isAuthContextSet: false,
	setIsUser: () => {},
	setUserData: () => {},
	setIsLoggedIn: () => {},
	showNotification: () => {},
});

export const ContextProvider = (props) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isUser, setIsUser] = useState(false);
	const [userData, setUserData] = useState({
		id: null,
		email: null,
		current: [],
		resolved: [],
	});
	const showNotification = ({ type, value }) => {
		toast(value, { type, className: "notification" });
	};
	return (
		<GlobalContext.Provider
			value={{
				isLoggedIn,
				isUser,
				userData,
				setUserData,
				setIsUser,
				setIsLoggedIn,
				showNotification,
			}}
		>
			{props.children}
		</GlobalContext.Provider>
	);
};

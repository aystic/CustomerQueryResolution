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
	isUserConnected: false,
	newRequests: false,
	newMessages: false,
	setAreNewMessages: () => {},
	setAreNewRequests: () => {},
	setIsUserConnected: () => {},
	setIsUser: () => {},
	setUserData: () => {},
	setIsLoggedIn: () => {},
	showNotification: () => {},
});

export const GlobalContextProvider = (props) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isUser, setIsUser] = useState(false);
	const [newRequests, setAreNewRequests] = useState(false);
	const [newMessages, setAreNewMessages] = useState(false);
	const [isUserConnected, setIsUserConnected] = useState(false);
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
				isUserConnected,
				userData,
				newRequests,
				newMessages,
				setAreNewMessages,
				setAreNewRequests,
				setIsUserConnected,
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

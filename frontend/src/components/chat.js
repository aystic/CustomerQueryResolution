import classes from "./chat.module.css";
import TopBar from "./topBar";
import Sidebar from "./sidebar";
import ChatWindow from "./chatwindow";
import { useState, useContext, useEffect, useCallback } from "react";
import { GlobalContext } from "../store/globalContext";
import { getUserDetails } from "../api/common";
import socket from "../utils/socket";

const Chat = () => {
	const globalContext = useContext(GlobalContext);
	const [chat, setChat] = useState([]);
	const [chatTag, setChatTag] = useState("current");
	const [selectedChat, setSelectedChat] = useState(null);
	const [receiverDetails, setReceiverDetails] = useState(null);
	const [messageToSend, setMessageToSend] = useState(null);
	const receiverChangeHandler = async (reset, userID, isUser, chatID) => {
		try {
			if (!reset) {
				const data = await getUserDetails(userID, isUser, chatID);
				if (data.length > 0) setReceiverDetails(data[0]);
			} else {
				setReceiverDetails(null);
			}
		} catch (err) {
			console.error(err);
		}
	};
	const chatSelectHandler = (chatID) => {
		setSelectedChat(chatID);
	};
	const addNewMessageHandler = useCallback(
		(message, received) => {
			const newMessage = {
				message,
				sender: globalContext.isUser ? "user" : "agent",
				timestamp: new Date().toISOString(),
				_linked_to: null,
				userID: globalContext.isUser
					? globalContext.userData.id
					: receiverDetails.id,
				agentID: globalContext.isUser
					? receiverDetails.id
					: globalContext.userData.id,
				chatID: selectedChat,
				type: "message",
			};
			if (received) {
				setChat((prev) => {
					return [...prev, message];
				});
			} else {
				setChat((prev) => {
					return [...prev, newMessage];
				});
			}
			if (!received) setMessageToSend(newMessage);
		},
		[
			globalContext.userData,
			globalContext.isUser,
			receiverDetails,
			selectedChat,
		]
	);
	const tagChangeHandler = useCallback(() => {
		return (chatTag) => setChatTag(chatTag);
	}, []);

	useEffect(() => {
		if (selectedChat && receiverDetails) {
			const chat = globalContext.userData.current.find(
				(chat) => chat.id === selectedChat
			);
			socket.emit(
				"connectToChat",
				chat.id,
				chat.userID,
				globalContext.isUser ? receiverDetails.id : globalContext.userData.id,
				globalContext.isUser
			);
		}
	}, [selectedChat, receiverDetails, globalContext]);
	useEffect(() => {
		if (messageToSend) {
			socket.emit("sendMessage", messageToSend);
		}
	}, [messageToSend]);
	useEffect(() => {
		socket.on("newMessage", (message) => {
			console.log(message);
			addNewMessageHandler(message, true);
		});
		return () => {
			socket.off("newMessage");
		};
	}, [addNewMessageHandler]);
	return (
		<>
			<TopBar
				classes={classes}
				tagChangeHandler={tagChangeHandler}
				chatTag={chatTag}
				receiverDetails={receiverDetails}
			/>
			<div className={classes["chat-body"]}>
				<Sidebar
					setChat={setChat}
					selectedChat={selectedChat}
					chatSelectHandler={chatSelectHandler}
					classes={classes}
					chatTag={chatTag}
					receiverChangeHandler={receiverChangeHandler}
				/>
				<ChatWindow
					chat={chat}
					chatTag={chatTag}
					selectedChat={selectedChat}
					addNewMessageHandler={addNewMessageHandler}
					classes={classes}
				/>
			</div>
		</>
	);
};

export default Chat;

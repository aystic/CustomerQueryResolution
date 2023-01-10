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
	const [isLoading, setIsLoading] = useState(false);
	const toggleLoading = () => {
		setIsLoading((prev) => !prev);
	};
	const tagChangeHandler = (chatType) => {
		setChat([]);
		setSelectedChat(null);
		setReceiverDetails(null);
		setChatTag(chatType);
	};

	const receiverChangeHandler = async (reset, userID, isUser, chatID) => {
		try {
			if (!reset) {
				const data = await getUserDetails(userID, isUser, chatID);
				if (data.length !== 0) {
					setReceiverDetails(data[0]);
				} else {
					setReceiverDetails(null);
				}
			} else {
				setReceiverDetails(null);
			}
		} catch (err) {
			throw new Error(err);
		}
	};
	const chatSelectHandler = (chatID) => {
		setSelectedChat(chatID);
	};
	const addNewMessageHandler = useCallback(
		(message, received) => {
			if (selectedChat === message.chatID) {
				setChat((prev) => {
					return [...prev, message];
				});
			} else {
				globalContext.setUserData((prev) => {
					const currentChats = prev.current;
					const idx = currentChats.findIndex(
						(chat) => chat.id === message.chatID
					);
					currentChats[idx].hasNewMessages = true;
					return { ...prev, current: currentChats };
				});
			}
			if (!received) setMessageToSend(message);
		},
		[selectedChat, globalContext]
	);

	useEffect(() => {
		if (chatTag !== "resolved" && selectedChat !== null && receiverDetails) {
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
	}, [selectedChat, receiverDetails, globalContext, chatTag]);
	useEffect(() => {
		if (messageToSend) {
			socket.emit("sendMessage", messageToSend);
		}
	}, [messageToSend]);
	useEffect(() => {
		socket.on("newMessage", (message) => {
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
					toggleLoading={toggleLoading}
					setChat={setChat}
					selectedChat={selectedChat}
					chatSelectHandler={chatSelectHandler}
					classes={classes}
					chatTag={chatTag}
					receiverChangeHandler={receiverChangeHandler}
				/>
				<ChatWindow
					isLoading={isLoading}
					receiverDetails={receiverDetails}
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

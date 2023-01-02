import classes from "./chat.module.css";
import TopBar from "./topBar";
import Sidebar from "./sidebar";
import ChatWindow from "./chatwindow";
import { useMemo, useState, useContext } from "react";
import { GlobalContext } from "../store/globalContext";
import { getUserDetails } from "../api/common";

const Chat = () => {
	const globalContext = useContext(GlobalContext);
	const [chat, setChat] = useState([]);
	const [chatTag, setChatTag] = useState("current");
	const [selectedChat, setSelectedChat] = useState(null);
	const [receiverEmail, setReceiverEmail] = useState(null);

	const receiverChangeHandler = async (userID) => {
		try {
			if (userID) {
				const data = await getUserDetails(userID);
				setReceiverEmail(data[0].emailID);
			} else {
				setReceiverEmail(null);
			}
		} catch (err) {
			console.error(err);
		}
	};
	const chatSelectHandler = (chatID) => {
		setSelectedChat(chatID);
	};
	const addMessageHandler = (message) => {
		setChat((prev) => {
			const newMessage = {
				message,
				sender: globalContext.isUser ? "user" : "agent",
				timestamp: new Date().toISOString(),
				_linked_to: null,
				userID: globalContext.userData.id,
				chatID: selectedChat,
				type: "message",
			};
			return [...prev, newMessage];
		});
	};
	const tagChangeHandler = useMemo(() => {
		return (chatTag) => setChatTag(chatTag);
	}, []);
	return (
		<>
			<TopBar
				classes={classes}
				tagChangeHandler={tagChangeHandler}
				chatTag={chatTag}
				receiverEmail={receiverEmail}
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
					addMessageHandler={addMessageHandler}
					classes={classes}
				/>
			</div>
		</>
	);
};

export default Chat;

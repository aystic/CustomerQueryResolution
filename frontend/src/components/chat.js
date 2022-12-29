import classes from "./chat.module.css";
import TopBar from "./topBar";
import Sidebar from "./sidebar";
import ChatWindow from "./chatwindow";
import { useMemo, useState } from "react";

const Chat = ({ isUser, userData }) => {
	const [chatTag, setChatTag] = useState("current");
	const [selectedChat, setSelectedChat] = useState(null);
	const tagChangeHandler = useMemo(() => {
		return (chatTag) => setChatTag(chatTag);
	}, []);
	return (
		<>
			<TopBar
				userData={userData}
				isUser={isUser}
				classes={classes}
				tagChangeHandler={tagChangeHandler}
				chatTag={chatTag}
			/>
			<div className={classes["chat-body"]}>
				<Sidebar userData={userData} classes={classes} chatTag={chatTag} />
				<ChatWindow selectedChat={selectedChat} classes={classes} />
			</div>
		</>
	);
};

export default Chat;

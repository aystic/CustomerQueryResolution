import classes from "./chat.module.css";
import TopBar from "./topBar";
import Sidebar from "./sidebar";
import ChatWindow from "./chatwindow";

const Chat = ({ isUser }) => {
	return (
		<>
			<TopBar isUser={isUser} classes={classes} />
			<div className={classes["chat-body"]}>
				<Sidebar classes={classes} />
				<ChatWindow classes={classes} />
			</div>
		</>
	);
};

export default Chat;

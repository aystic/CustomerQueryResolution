import classes from "./chat.module.css";
const NewChat = () => {
	return (
		<div className={classes["centered-container"]}>
			<button className={classes["new-chat-btn"]}>New Chat</button>
		</div>
	);
};
export default NewChat;

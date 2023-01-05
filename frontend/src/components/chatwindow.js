import { useState, useEffect, useRef, useContext } from "react";
import { GlobalContext } from "../store/globalContext";
import NewChat from "./newChat";
import sendBtn from "./send-button.svg";
const ChatWindow = ({
	chat,
	classes,
	selectedChat,
	addNewMessageHandler,
	chatTag,
	receiverDetails,
}) => {
	const globalContext = useContext(GlobalContext);
	const [message, setMessage] = useState("");
	const scrollToRef = useRef(null);
	const chatHandler = (e) => {
		e.preventDefault();
		const newMessage = {
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
			message,
		};
		addNewMessageHandler(newMessage, false);
		setMessage("");
	};
	const messageChangeHandler = (e) => {
		setMessage(e.target.value);
	};

	const chatList = chat.map((value, idx) => {
		return (
			<div
				key={idx}
				className={
					(value.sender === "user" && globalContext.isUser === true) ||
					(value.sender === "agent" && globalContext.isUser === false)
						? classes["message-self"]
						: classes["message-other"]
				}
			>
				{value.message}
			</div>
		);
	});
	useEffect(() => {
		if (scrollToRef.current) {
			scrollToRef.current.scrollIntoView({
				behavior: "smooth",
			});
		}
	}, [chat]);
	chatList.push(
		<div
			key={chat.length}
			ref={scrollToRef}
			className={classes["scroll-to-div"]}
		></div>
	);

	return (
		<div className={classes["chat"]}>
			{selectedChat !== null ? (
				<>
					<div
						className={`${classes["message-list-container"]} ${classes["scroller "]}`}
					>
						{chatList}
					</div>
					{chatTag === "current" && (
						<div className={classes["chat-input-container"]}>
							<form
								className={classes["form-container"]}
								onSubmit={chatHandler}
							>
								<input
									value={message}
									onChange={messageChangeHandler}
									className={classes["chat-input"]}
									type={"text"}
									placeholder="Type your message here!"
								></input>
								<button
									disabled={message === ""}
									style={{ visibility: message === "" ? "hidden" : "visible" }}
									className={classes["chat-input-btn"]}
									type="submit"
								>
									<img src={sendBtn} alt="send button" />
								</button>
							</form>
						</div>
					)}
				</>
			) : globalContext.isUser ? (
				<NewChat />
			) : (
				""
			)}
		</div>
	);
};

export default ChatWindow;

import { useState, useEffect, useRef } from "react";
import NewChat from "./newChat";
import sendBtn from "./send-button.svg";
const messages = [
	{ text: "hello", self: true },
	{ text: "world", self: false },
	{
		text: "Cras suscipit ultricies nisl at tristique. Integer porttitor erat metus, non tempus metus porttitor a. Aliquam rutrum arcu in tincidunt vulputate. Pellentesque purus turpis, ultricies vel nunc id, gravida ornare nisl. Duis eu dolor augue. Curabitur condimentum neque eu nisi suscipit consectetur. Aliquam hendrerit, dui id tempus pulvinar, dolor nulla malesuada neque, sed facilisis ante diam porttitor felis. Suspendisse nunc justo, consectetur vel ultrices eu, fringilla in erat. Fusce a cursus augue. Vivamus in cursus quam. Aenean sed ex quis turpis laoreet elementum ut id mauris. Curabitur vel hendrerit lorem, sed semper leo. Phasellus neque mauris, interdum vehicula iaculis non, scelerisque ac nisl. Sed imperdiet est risus, nec commodo massa malesuada id. Quisque id lorem at magna volutpat imperdiet.",
		self: false,
	},
];
const ChatWindow = ({ classes, selectedChat, showNotification }) => {
	const [chats, setChats] = useState(messages);
	const [message, setMessage] = useState("");
	const scrollToRef = useRef(null);
	const chatHandler = (e) => {
		e.preventDefault();
		setChats((prev) => {
			return [...prev, { text: message, self: true }];
		});
		setMessage("");
	};
	const messageChangeHandler = (e) => {
		setMessage(e.target.value);
	};

	const chatList = chats.map((value, idx) => {
		return (
			<div
				key={idx}
				className={
					value.self === true
						? classes["message-self"]
						: classes["message-other"]
				}
			>
				{value.text}
			</div>
		);
	});
	useEffect(() => {
		if (scrollToRef.current) {
			scrollToRef.current.scrollIntoView({
				behavior: "smooth",
			});
		}
	}, [chats]);
	chatList.push(
		<div
			key={chats.length}
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
					<div className={classes["chat-input-container"]}>
						<form className={classes["form-container"]} onSubmit={chatHandler}>
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
				</>
			) : (
				<NewChat showNotification={showNotification} />
			)}
		</div>
	);
};

export default ChatWindow;

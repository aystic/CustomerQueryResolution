import { useState, useEffect, useRef } from "react";
const messgages = [
	{ text: "hello", self: true },
	{ text: "world", self: false },
	{
		text: "Cras suscipit ultricies nisl at tristique. Integer porttitor erat metus, non tempus metus porttitor a. Aliquam rutrum arcu in tincidunt vulputate. Pellentesque purus turpis, ultricies vel nunc id, gravida ornare nisl. Duis eu dolor augue. Curabitur condimentum neque eu nisi suscipit consectetur. Aliquam hendrerit, dui id tempus pulvinar, dolor nulla malesuada neque, sed facilisis ante diam porttitor felis. Suspendisse nunc justo, consectetur vel ultrices eu, fringilla in erat. Fusce a cursus augue. Vivamus in cursus quam. Aenean sed ex quis turpis laoreet elementum ut id mauris. Curabitur vel hendrerit lorem, sed semper leo. Phasellus neque mauris, interdum vehicula iaculis non, scelerisque ac nisl. Sed imperdiet est risus, nec commodo massa malesuada id. Quisque id lorem at magna volutpat imperdiet.",
		self: false,
	},
];
const ChatWindow = ({ classes }) => {
	const [chats, setChats] = useState(messgages);
	const chatInputRef = useRef(null);
	const scrollToRef = useRef(null);
	const chatHandler = (e) => {
		e.preventDefault();
		setChats((prev) => {
			return [...prev, { text: e.target[0].value, self: true }];
		});
	};
	useEffect(() => {
		if (chatInputRef.current) chatInputRef.current.value = "";
		scrollToRef.current.scrollIntoView({
			behavior: "smooth",
		});
	}, [chats]);

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
	chatList.push(
		<div
			key={chats.length}
			ref={scrollToRef}
			className={classes["scroll-to-div"]}
		></div>
	);
	return (
		<div className={classes["chat"]}>
			<div className={classes["message-list-container"]}>{chatList}</div>
			<div className={classes["chat-input-container"]}>
				<form className={classes["form-container"]} onSubmit={chatHandler}>
					<input
						className={classes["chat-input"]}
						type={"text"}
						placeholder="Type your message here!"
						ref={chatInputRef}
					></input>
					<button className={classes["chat-input-btn"]} type="submit">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="#fff"
							viewBox="0 0 16 16"
						>
							<path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
						</svg>
					</button>
				</form>
			</div>
		</div>
	);
};

export default ChatWindow;

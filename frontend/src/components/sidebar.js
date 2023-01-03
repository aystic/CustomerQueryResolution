import { useContext } from "react";
import { getChatMessages, markAsResolve } from "../api/common";
import { GlobalContext } from "../store/globalContext";
import markAsResolvedBtn from "./mark-as-resolved.svg";
// let firstRender = true;
const Sidebar = ({
	classes,
	chatTag,
	setChat,
	selectedChat,
	chatSelectHandler,
	receiverChangeHandler,
}) => {
	const globalContext = useContext(GlobalContext);
	// const scrollToRef = useRef(null);
	const chatListClickHandler = async (chatID, userID) => {
		if (chatID !== selectedChat) {
			try {
				receiverChangeHandler(userID, globalContext.isUser, chatID);
				chatSelectHandler(chatID);
				const messages = await getChatMessages(chatID);
				console.log(messages);
				setChat(messages);
			} catch (err) {
				receiverChangeHandler(null);
				chatSelectHandler(null);
				console.error(err);
			}
		} else {
			receiverChangeHandler(null);
			setChat([]);
			chatSelectHandler(null);
		}
	};
	const markAsResolvedHandler = async (chatID) => {
		try {
			let postData = {
				id: globalContext.userData.id,
				chatID,
				resolved: true,
				email: globalContext.userData.email,
			};
			await markAsResolve(postData);
			const idx = globalContext.userData.current.findIndex(
				(chat) => chat.id === chatID
			);
			const currentChats = globalContext.userData.current;
			const chat = currentChats.splice(idx, 1);
			chat[0].resolved = true;
			globalContext.setUserData((prev) => {
				return {
					...prev,
					current: currentChats,
					resolved: [...prev.resolved, ...chat],
				};
			});
			chatSelectHandler(null);
		} catch (err) {
			console.error(err);
		}
	};
	const chatList =
		chatTag === "current"
			? globalContext.userData.current
			: globalContext.userData.resolved;
	const list = chatList.map((val, idx) => {
		return (
			<div key={idx} className={classes["chat-list-item-container"]}>
				<div
					onClick={chatListClickHandler.bind(null, val.id, val.userID)}
					className={`${classes["chat-list"]} ${
						selectedChat === val.id ? classes["chat-list-active"] : ""
					}`}
				>
					<div className={classes["chip"]}>{val.issue}</div>
					<div className={classes["chip"]}>{val.subIssue}</div>
					<div>
						<p>{val.description}</p>
					</div>
				</div>
				{chatTag === "current" ? (
					<button
						onClick={markAsResolvedHandler.bind(null, val.id)}
						className={classes["mark-as-resolved-btn"]}
					>
						{/* <img src={markAsResolvedBtn} alt="Mark as resolved button" /> */}
					</button>
				) : (
					""
				)}
			</div>
		);
	});
	// list.push(
	// 	<div
	// 		key={chatList.length}
	// 		ref={scrollToRef}
	// 		className={classes["scroll-to-div"]}
	// 	></div>
	// );

	// useEffect(() => {
	// 	if (scrollToRef.current !== null && firstRender === false) {
	// 		scrollToRef.current.scrollIntoView({
	// 			behavior: "smooth",
	// 		});
	// 	}
	// 	firstRender = false;
	// }, [chatList]);
	return (
		<>
			{list.length === 0 ? (
				<div className={`${classes["sidebar"]} ${classes["centered"]}`}>
					<span className={classes["info-text-big"]}>No Chats Found!</span>
				</div>
			) : (
				<div className={`${classes["sidebar"]} ${classes["scroller"]}`}>
					{list}
					<div></div>
				</div>
			)}
		</>
	);
};
export default Sidebar;

/*
<div className={classes["chat-list"]}>1</div>
			<div className={classes["chat-list"]}>2</div>
			<div className={classes["chat-list"]}>3</div>
			<div className={classes["chat-list"]}>4</div>
			<div className={classes["chat-list"]}>5</div>
			<div className={classes["chat-list"]}>6</div>
			<div className={classes["chat-list"]}>7</div>
			<div className={classes["chat-list"]}>8</div>
			<div className={classes["chat-list"]}>9</div>
			<div className={classes["chat-list"]}>10</div>
*/

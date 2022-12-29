const TopBar = ({ isUser, classes, userData, tagChangeHandler, chatTag }) => {
	const chatSegregationHandler = (chatType) => {
		tagChangeHandler(chatType);
	};
	return (
		<div className={classes["top-bar"]}>
			<div className={classes["chat-actions"]}>
				<button
					onClick={chatSegregationHandler.bind(null, "current")}
					className={`${classes["top-bar-btn"]} ${
						chatTag === "current" ? classes["top-bar-btn-active"] : ""
					}`}
				>
					Current
				</button>
				<button
					onClick={chatSegregationHandler.bind(null, "resolved")}
					className={`${classes["top-bar-btn"]} ${
						chatTag === "resolved" ? classes["top-bar-btn-active"] : ""
					}`}
				>
					Resolved
				</button>
				{!isUser && (
					<button
						className={`${classes["top-bar-btn"]} ${
							chatTag === "new-chats" ? classes["top-bar-btn-active"] : ""
						}`}
					>
						New Requests
					</button>
				)}
			</div>
			<div className={classes["chat-details"]}>
				<div className={classes["user-details"]}>
					<div className={classes["online-status"]}></div>
					test@agent.com(Customer Agent)
				</div>
				<div className={classes["user-details"]}>
					<div className={classes["online-status"]}></div>
					{userData.email}(You)
				</div>
			</div>
		</div>
	);
};
export default TopBar;

/*
<button
					onClick={chatSegregationHandler.bind(null, "priority-1")}
					className={classes["top-bar-btn"]}
				>
					Urgent
				</button>
				<button
					onClick={chatSegregationHandler.bind(null, "priority-2")}
					className={classes["top-bar-btn"]}
				>
					Medium
				</button>
				<button
					onClick={chatSegregationHandler.bind(null, "priority-3")}
					className={classes["top-bar-btn"]}
				>
					Low
				</button>
				<button
					onClick={chatSegregationHandler.bind(null, "priority-4")}
					className={classes["top-bar-btn"]}
				>
					Others
				</button>
*/

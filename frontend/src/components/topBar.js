import { useState } from "react";
const TopBar = ({ isUser, classes }) => {
	const [section, setSection] = useState("current");
	const chatSegregationHandler = (priority) => {
		console.log(priority);
	};
	return (
		<div className={classes["top-bar"]}>
			<div className={classes["chat-actions"]}>
				{!isUser && (
					<>
						<button
							className={`${classes["top-bar-btn"]} ${
								section === "current" ? classes["top-bar-btn-active"] : ""
							}`}
						>
							Current
						</button>
						<button
							className={
								section !== "resolved"
									? classes["top-bar-btn"]
									: classes["top-bar-btn-active"]
							}
						>
							Resolved
						</button>
						<button
							className={
								section !== "new-chats"
									? classes["top-bar-btn"]
									: classes["top-bar-btn-active"]
							}
						>
							New Requests
						</button>
					</>
				)}
			</div>
			<div className={classes["chat-details"]}></div>
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

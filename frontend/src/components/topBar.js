const TopBar = ({ classes }) => {
	const chatSegregationHandler = (priority) => {
		console.log(priority);
	};
	return (
		<div className={classes["top-bar"]}>
			<div className={classes["chat-actions"]}>
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
			</div>
			<div className={classes["chat-details"]}></div>
		</div>
	);
};
export default TopBar;

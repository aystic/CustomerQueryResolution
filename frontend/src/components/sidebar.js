const Sidebar = ({ classes, userData, chatTag }) => {
	const chatList = chatTag === "current" ? userData.current : userData.resolved;
	const list = chatList.map((val, idx) => {
		if (chatTag === "current") {
			<div className={classes["chat-list"]}>{val.title}</div>;
		}
		return <div className={classes["chat-list"]}>{val.title}</div>;
	});
	return (
		<>
			{list.length === 0 ? (
				<div className={`${classes["sidebar"]} ${classes["centered"]}`}>
					<span className={classes["info-text-big"]}>No Chats Found!</span>
				</div>
			) : (
				<div className={`${classes["sidebar"]} ${classes["scroller"]}`}>
					{list}
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

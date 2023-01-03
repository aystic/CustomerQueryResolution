import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../store/globalContext";
import Modal from "../common/modal";
import { createPortal } from "react-dom";
const TopBar = ({ classes, tagChangeHandler, chatTag, receiverEmail }) => {
	const globalContext = useContext(GlobalContext);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const chatSegregationHandler = (chatType) => {
		tagChangeHandler(chatType);
	};
	const modalToggleHandler = () => {
		setIsModalOpen((prev) => !prev);
	};

	useEffect(() => {}, []);
	return (
		<>
			{isModalOpen &&
				createPortal(
					<Modal
						modalType={"newRequests"}
						isModalOpen={isModalOpen}
						modalToggleHandler={modalToggleHandler}
					/>,
					document.getElementById("modal-container")
				)}
			<div className={classes["top-bar"]}>
				<div className={classes["chat-actions"]}>
					<button
						style={{ flexGrow: "1.8" }}
						onClick={chatSegregationHandler.bind(null, "current")}
						className={`${classes["top-bar-btn"]} ${
							chatTag === "current" ? classes["top-bar-btn-active"] : ""
						}`}
					>
						Current
					</button>
					<button
						style={{ flexGrow: "1.5" }}
						onClick={chatSegregationHandler.bind(null, "resolved")}
						className={`${classes["top-bar-btn"]} ${
							chatTag === "resolved" ? classes["top-bar-btn-active"] : ""
						}`}
					>
						Resolved
					</button>
					{!globalContext.isUser && (
						<button
							style={{ flexGrow: "1" }}
							onClick={modalToggleHandler}
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
						{receiverEmail && (
							<>
								<div className={classes["online-status"]}></div>
								{`${receiverEmail}(Customer${
									!globalContext.isUser ? "" : " Agent"
								})`}
							</>
						)}
					</div>
					<div className={classes["user-details"]}>
						<div className={classes["online-status"]}></div>
						{globalContext.userData.email}(You)
					</div>
				</div>
			</div>
		</>
	);
};
export default TopBar;

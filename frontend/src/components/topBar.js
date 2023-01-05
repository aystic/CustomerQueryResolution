import { useState, useContext, useEffect } from "react";
import socket from "../utils/socket";
import { GlobalContext } from "../store/globalContext";
import Modal from "../common/modal";
import { createPortal } from "react-dom";
const TopBar = ({ classes, tagChangeHandler, chatTag, receiverDetails }) => {
	const globalContext = useContext(GlobalContext);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const modalToggleHandler = () => {
		if (globalContext.newRequests) {
			globalContext.setAreNewRequests(false);
		}
		setIsModalOpen((prev) => !prev);
	};

	useEffect(() => {
		socket.on("newChatRequest", () => {
			globalContext.setAreNewRequests(true);
		});
		return () => {
			socket.off("newChatRequest");
		};
	}, [globalContext]);
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
						onClick={tagChangeHandler.bind(null, "current")}
						className={`${classes["top-bar-btn"]} ${
							chatTag === "current" ? classes["top-bar-btn-active"] : ""
						}`}
					>
						Current
					</button>
					<button
						style={{ flexGrow: "1.5" }}
						onClick={tagChangeHandler.bind(null, "resolved")}
						className={`${classes["top-bar-btn"]} ${
							chatTag === "resolved" ? classes["top-bar-btn-active"] : ""
						}`}
					>
						Resolved
					</button>
					{!globalContext.isUser && (
						<button
							style={{ flexGrow: "1", position: "relative" }}
							onClick={modalToggleHandler}
							className={`${classes["top-bar-btn"]} ${
								chatTag === "new-chats" ? classes["top-bar-btn-active"] : ""
							}`}
						>
							{globalContext.newRequests && (
								<div
									className={`${classes["notification-dot"]} ${classes["top-right"]}`}
								></div>
							)}
							New Requests
						</button>
					)}
				</div>
				<div className={classes["chat-details"]}>
					<span className={classes["user-details"]}>
						{receiverDetails && (
							<>
								<div className={classes["connection-status"]}></div>
								{`${receiverDetails.emailID}(Customer${
									!globalContext.isUser ? "" : " Agent"
								})`}
							</>
						)}
						<div
							className={`${classes["connection-status"]} ${
								globalContext.isUserConnected
									? classes["online"]
									: classes["offline"]
							} ${classes["connection-status-self"]}`}
						></div>
						{globalContext.userData.email}(You)
					</span>
				</div>
			</div>
		</>
	);
};
export default TopBar;

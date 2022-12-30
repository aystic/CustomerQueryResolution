import { useState } from "react";
import { createPortal } from "react-dom";
import classes from "./chat.module.css";
import Modal from "../common/modal";
const NewChat = ({ showNotification }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const modalToggleHandler = () => {
		setIsModalOpen((prev) => !prev);
	};

	return (
		<>
			{isModalOpen &&
				createPortal(
					<Modal
						modalType={"newChat"}
						isModalOpen={isModalOpen}
						modalToggleHandler={modalToggleHandler}
						showNotification={showNotification}
					/>,
					document.getElementById("modal-container")
				)}
			<div className={classes["centered-container"]}>
				<button
					onClick={modalToggleHandler.bind(null, "new-chat")}
					className={classes["new-chat-btn"]}
				>
					New Chat
				</button>
			</div>
		</>
	);
};
export default NewChat;

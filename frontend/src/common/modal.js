import classes from "./modal.module.css";
import closeBtn from "./close-button.svg";
import { useState } from "react";
const Modal = ({ modalType, modalToggleHandler, isModalOpen }) => {
	const [closeModal, setCloseModal] = useState(
		isModalOpen === true ? false : true
	);
	const closeModalHandler = () => {
		setCloseModal(true);
		setTimeout(() => {
			modalToggleHandler();
		}, 180);
	};
	return (
		<div className={classes["modal-overlay"]}>
			<div
				className={`${classes["modal"]} ${
					closeModal === true ? classes["modal-exit"] : classes["modal-entry"]
				}`}
			>
				<div className={classes["modal-top-bar"]}>
					<h2>Modal Name</h2>
					<button>
						<img
							src={closeBtn}
							onClick={closeModalHandler}
							alt="Modal close button"
						/>
					</button>
				</div>
				<div className={classes["modal-body"]}></div>
				<div className={classes["modal-bottom-bar"]}>
					{modalType === "newChat" ? (
						<>
							<button>Reset</button>
							<button>Submit</button>
						</>
					) : (
						<button>Add</button>
					)}
				</div>
			</div>
		</div>
	);
};
export default Modal;

import classes from "./modal.module.css";
import closeBtn from "./close-button.svg";
import { useState } from "react";

const ModalElement = ({
	modalType,
	modalToggleHandler,
	isModalOpen,
	modalBody,
	modalName,
	formResetHandler,
	submitBtnRef,
	formValidity,
}) => {
	const [closeModal, setCloseModal] = useState(
		isModalOpen === true ? false : true
	);

	const closeModalHandler = () => {
		setCloseModal(true);
		setTimeout(() => {
			modalToggleHandler();
		}, 210);
	};

	return (
		<div className={classes["modal-overlay"]}>
			<div
				className={`${classes["modal"]} ${
					closeModal === true ? classes["modal-exit"] : classes["modal-entry"]
				} ${
					modalType === "newChat"
						? classes["modal-small"]
						: classes["modal-large"]
				}`}
			>
				<div className={classes["modal-top-bar"]}>
					<h2>{modalName}</h2>
					<button autoFocus={true}>
						<img
							src={closeBtn}
							onClick={closeModalHandler}
							alt="Modal close button"
						/>
					</button>
				</div>
				<div className={classes["modal-body"]}>{modalBody}</div>
				{modalType === "newChat" && (
					<div className={classes["modal-bottom-bar"]}>
						<button onClick={formResetHandler}>Reset</button>
						{formValidity && (
							<button
								onClick={() => {
									if (submitBtnRef) {
										submitBtnRef.current.click();
									}
								}}
							>
								Submit
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
export default ModalElement;

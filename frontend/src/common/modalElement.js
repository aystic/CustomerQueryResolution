import classes from "./modal.module.css";
import closeBtn from "./close-button.svg";
import { useState } from "react";
import prevBtn from "./prev-page.svg";
import nextBtn from "./next-page.svg";
import firstPageBtn from "./first-page.svg";
import lastPageBtn from "./last-page.svg";
import filterBtn from "./filter.svg";

const ModalElement = ({
	modalType,
	modalToggleHandler,
	isModalOpen,
	modalBody,
	modalName,
	formResetHandler,
	submitBtnRef,
	formValidity,
	totalRows,
	currentPage,
	rowsPerPage,
	rowsPerPageChangeHandler,
	pageChangeHandler,
	searchQuery,
	setSearchQuery,
}) => {
	const [closeModal, setCloseModal] = useState(
		isModalOpen === true ? false : true
	);
	const [rowsPerPageInputValue, setRowsPerPageInputValue] = useState(20);
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
				<div className={classes["modal-bottom-bar"]}>
					{modalType === "newChat" && (
						<>
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
						</>
					)}
					{modalType === "newRequests" && (
						<div className={classes["pagination"]}>
							<button
								onClick={() => {
									pageChangeHandler(1);
								}}
							>
								<img src={firstPageBtn} alt="Go to first page button" />
							</button>

							<button
								onClick={() => {
									pageChangeHandler(currentPage - 1);
								}}
							>
								<img src={prevBtn} alt="Go to previous page button" />
							</button>
							<p>
								Showing{" "}
								{`${rowsPerPage * (currentPage - 1) + 1} to ${
									totalRows <= rowsPerPage * currentPage
										? totalRows
										: rowsPerPage * currentPage
								} of ${totalRows}`}
							</p>
							<button
								onClick={() => {
									pageChangeHandler(currentPage + 1);
								}}
							>
								<img src={nextBtn} alt="Go to next page button" />
							</button>
							<button
								onClick={() => {
									const totalPages = Math.ceil(totalRows / rowsPerPage);
									pageChangeHandler(totalPages);
								}}
							>
								<img src={lastPageBtn} alt="Go to last page button" />
							</button>
							<div className={classes["table-search"]}>
								<input
									disabled={true}
									style={{ cursor: "not-allowed" }}
									value={searchQuery}
									onChange={(e) => {
										setSearchQuery(e.target.value);
									}}
									type="text"
									placeholder="Search"
								></input>
							</div>
							<div className={classes["pagination-rows-select"]}>
								<form
									onSubmit={rowsPerPageChangeHandler.bind(
										null,
										rowsPerPageInputValue
									)}
								>
									<label htmlFor="rows-per-page-input">Rows per page</label>
									<input
										id="rows-per-page-input"
										value={rowsPerPageInputValue}
										type="number"
										placeholder="Rows per page"
										min={1}
										onChange={(e) => {
											setRowsPerPageInputValue(+e.target.value);
										}}
									/>
									<button type="submit">
										<img
											src={filterBtn}
											alt="Button for setting rows per page"
										/>
									</button>
								</form>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
export default ModalElement;

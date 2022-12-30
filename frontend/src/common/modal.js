import ModalElement from "./modalElement";
import classes from "./modal.module.css";
import { createChat } from "../api/user";
import { useState, useRef, useEffect } from "react";
import { tableData } from "./tableData";

const ISSUES = ["Priority1", "Priority2", "Priority3", "Priority4"];
const SUB_ISSUES = [
	"SubPriority1",
	"SubPriority2",
	"SubPriority3",
	"SubPriority4",
];
const Modal = ({
	modalType,
	modalToggleHandler,
	isModalOpen,
	showNotification,
}) => {
	const [formState, setFormState] = useState({
		issue: {
			name: "",
			priority: 0,
		},
		subIssue: {
			name: "",
			priority: 0,
		},
		description: "",
	});
	const issueRef = useRef(null);
	const subIssueRef = useRef(null);
	const textAreaRef = useRef(null);
	const [formValidity, setFormValidity] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedRow, setSelectedRow] = useState(null);
	const submitBtnRef = useRef(null);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchFor, setSearchFor] = useState("");
	const formResetHandler = () => {
		setFormState({
			issue: {
				name: "",
				priority: 0,
			},
			subIssue: {
				name: "",
				priority: 0,
			},
			description: "",
		});
		if (issueRef) issueRef.current.selectedIndex = 0;
		if (subIssueRef) subIssueRef.current.selectedIndex = 0;
		if (textAreaRef) textAreaRef.current.value = "";
	};
	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const postData = formState;
			const data = await createChat(postData);
			console.log(data);
		} catch (err) {
			showNotification({
				type: "error",
				value: err.message,
			});
			console.error(err);
		}
	};

	const rowsPerPageChangeHandler = (value, e) => {
		e.preventDefault();
		if (value >= 1 && value <= tableData.length) {
			setRowsPerPage(value);
		} else if (value > tableData.length) {
			setRowsPerPage(tableData.length);
		} else {
			console.error("Invalid rows per page value");
		}
	};

	const pageChangeHandler = (pageNo) => {
		const totalPages = Math.ceil(tableData.length / rowsPerPage);
		if (pageNo >= 1 && pageNo <= totalPages) setCurrentPage(pageNo);
	};

	useEffect(() => {
		const token = setTimeout(() => {
			setSearchFor(searchQuery);
		}, 200);
		return () => {
			clearTimeout(token);
		};
	}, [searchQuery]);
	let modalBody = "";
	if (modalType === "newChat") {
		modalBody = (
			<>
				<form
					className={classes["modal-form"]}
					id="new-chat-form"
					onSubmit={submitHandler}
				>
					<fieldset>
						<label htmlFor="issue-header">Select an issue</label>
						<select
							ref={issueRef}
							form="new-chat-form"
							placeholder="Select the relevant issue"
							required
							id="issue-header"
							name="Issue type"
							onChange={(e) => {
								setFormState((prev) => {
									return {
										...prev,
										issue: {
											name:
												e.target.value !== "0"
													? ISSUES[+e.target.value - 1]
													: "",
											priority: +e.target.value,
										},
									};
								});
							}}
						>
							<option value="0">Select the relevant issue</option>
							<option value="1">Issue having priority 1</option>
							<option value="2">Issue having priority 2</option>
							<option value="3">Issue having priority 3</option>
							<option value="4">Other issue</option>
						</select>
					</fieldset>
					<fieldset>
						<label htmlFor="sub-issue-header">Select a sub-issue</label>
						<select
							ref={subIssueRef}
							form="new-chat-form"
							placeholder=""
							required
							id="sub-issue-header"
							name="Sub issue type"
							onChange={(e) => {
								setFormState((prev) => {
									return {
										...prev,
										subIssue: {
											name:
												e.target.value !== "0"
													? SUB_ISSUES[+e.target.value - 1]
													: "",
											priority: +e.target.value,
										},
									};
								});
							}}
						>
							<option value="0">Select the relevant issue</option>
							<option value="1">Issue having priority 1</option>
							<option value="2">Issue having priority 2</option>
							<option value="3">Issue having priority 3</option>
							<option value="4">Other issue</option>
						</select>
					</fieldset>
					<fieldset>
						<label htmlFor="issue-description">Describe your issue</label>
						<textarea
							ref={textAreaRef}
							form="new-chat-form"
							id="issue-description"
							name="description"
							required
							placeholder="Describe your issue in as much detail as possible"
							minLength={20}
							maxLength={500}
							rows={5}
							onChange={(e) => {
								setFormState((prev) => {
									return { ...prev, description: e.target.value };
								});
							}}
						/>
					</fieldset>
					<button onSubmit={submitHandler} ref={submitBtnRef} type="submit">
						Submit
					</button>
				</form>
			</>
		);
	} else {
		//idx will lie from ROWS*(PAGE-1) <-> ROWS*PAGE-1;
		const table = [];
		for (
			let i = rowsPerPage * (currentPage - 1);
			i <
			(tableData.length <= rowsPerPage * currentPage
				? tableData.length
				: rowsPerPage * currentPage);
			i++
		) {
			const val = tableData[i];
			const isAnySelected = selectedRow !== null;
			const isThisSelected = isAnySelected && selectedRow.index === i;
			const markup = (
				<tr key={i} className={`${isThisSelected && classes["selected-row"]}`}>
					<td>{i + 1}</td>
					<td>{val.col1}</td>
					<td>{val.col2}</td>
					<td>{val.col3}</td>
					<td>{val.col4}</td>
					<td>{val.col5}</td>
					<td>{val.col6}</td>
					<td>
						<button
							disabled={!isAnySelected ? false : isThisSelected ? false : true}
							className={`${isThisSelected && classes["active"]}`}
							onClick={() => {
								if (isThisSelected) {
									setSelectedRow(null);
								} else {
									if (!isAnySelected) {
										setSelectedRow({ index: i, ...val });
									}
								}
							}}
						>
							{isThisSelected ? "DeSelect" : "Resolve"}
						</button>
					</td>
				</tr>
			);
			table.push(markup);
		}
		modalBody = (
			<table className={classes["table"]}>
				<thead>
					<tr>
						<td>S.No</td>
						<td>Date</td>
						<td>User</td>
						<td>Issue</td>
						<td>SubIssue</td>
						<td>Description</td>
						<td>Priority</td>
						<td>Action</td>
					</tr>
				</thead>
				<tbody>{table}</tbody>
			</table>
		);
	}
	useEffect(() => {
		if (
			formState.issue.value !== "" &&
			formState.issue.priority !== 0 &&
			formState.subIssue.value !== "" &&
			formState.subIssue.priority !== 0 &&
			formState.description.length >= 20
		) {
			setFormValidity(true);
		} else {
			setFormValidity(false);
		}
	}, [formState]);
	return (
		<>
			<ModalElement
				modalType={modalType}
				modalToggleHandler={modalToggleHandler}
				isModalOpen={isModalOpen}
				modalBody={modalBody}
				modalName={
					modalType === "newChat"
						? "Submit new query"
						: `View all requests - ${Math.ceil(
								tableData.length / rowsPerPage
						  )} page(s)`
				}
				formResetHandler={formResetHandler}
				submitBtnRef={submitBtnRef}
				formValidity={formValidity}
				rowsPerPage={rowsPerPage}
				currentPage={currentPage}
				totalRows={tableData.length}
				rowsPerPageChangeHandler={rowsPerPageChangeHandler}
				pageChangeHandler={pageChangeHandler}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
			/>
		</>
	);
};

export default Modal;

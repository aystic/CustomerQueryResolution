import ModalElement from "./modalElement";
import classes from "./modal.module.css";
import { createChat } from "../api/user";
import { useState, useContext, useRef, useEffect } from "react";
import { GlobalContext } from "../store/globalContext";
import { getRequests, markToResolve } from "../api/agent";
import Loader from "./loader";
const ISSUES = ["Priority1", "Priority2", "Priority3", "Priority4"];
const SUB_ISSUES = [
	"SubPriority1",
	"SubPriority2",
	"SubPriority3",
	"SubPriority4",
];
const Modal = ({ modalType, modalToggleHandler, isModalOpen }) => {
	const globalContext = useContext(GlobalContext);
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
	const [tableData, setTableData] = useState([]);
	const [loading, setLoading] = useState(
		modalType === "newRequests" ? true : false
	);
	const [metaData, setMetadata] = useState({
		start: 0,
		end: 0,
		totalRows: 0,
	});
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
			setLoading(true);
			const postData = {
				id: globalContext.userData.id,
				email: globalContext.userData.email,
				priority: formState.issue.priority * 10 + formState.subIssue.priority,
				issue: formState.issue.name,
				subIssue: formState.subIssue.name,
				description: formState.description,
				resolved: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
			const data = await createChat(postData);
			globalContext.setUserData((prev) => {
				return {
					...prev,
					current: [
						...prev.current,
						{
							id: data.id,
							userID: postData.id,
							priority: postData.priority,
							issue: postData.issue,
							subIssue: postData.subIssue,
							description: postData.description,
							resolved: postData.resolved,
						},
					],
				};
			});
			modalToggleHandler();
			setLoading(false);
			globalContext.showNotification({
				type: "success",
				value: "Created new request!",
			});
		} catch (err) {
			setLoading(false);
			globalContext.showNotification({
				type: "error",
				value: "Could not create new request!",
			});
			console.error(err);
		}
	};

	const rowsPerPageChangeHandler = (value, e) => {
		e.preventDefault();
		if (value >= 1 && value <= metaData.totalRows) {
			setRowsPerPage(value);
			setCurrentPage(1);
		} else if (value > metaData.totalRows) {
			setRowsPerPage(metaData.totalRows);
			setCurrentPage(1);
		} else {
			console.error("Invalid rows per page value");
		}
	};

	const pageChangeHandler = (pageNo) => {
		const totalPages = Math.ceil(metaData.totalRows / rowsPerPage);
		if (pageNo >= 1 && pageNo <= totalPages) setCurrentPage(pageNo);
	};

	useEffect(() => {
		const fetch = async () => {
			try {
				setLoading(true);
				const response = await getRequests(currentPage, rowsPerPage);
				setTableData(response.data);
				setMetadata({
					start: response.range.start,
					end: response.range.end,
					totalRows: response.range.total,
				});
				setLoading(false);
			} catch (err) {
				setLoading(false);
				globalContext.showNotification({
					type: "error",
					value: "Failed to fetch the requests!",
				});
				console.error(err);
			}
		};
		if (modalType === "newRequests") fetch();
	}, [currentPage, rowsPerPage, modalType, globalContext]);

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

	const markToResolveHandler = async (
		chatID,
		isThisSelected,
		isAnySelected,
		val,
		i
	) => {
		try {
			const postData = {
				id: globalContext.userData.id,
				email: globalContext.userData.email,
				chatID: chatID,
				toAdd: false,
				userID: val.userID,
			};
			if (isThisSelected) {
				await markToResolve(postData);
				setSelectedRow(null);
				globalContext.setUserData((prev) => {
					let currentChats = prev.current;
					const idx = prev.current.findIndex((val) => val.chatID === chatID);
					currentChats.splice(idx, 1);
					return { ...prev, current: currentChats };
				});
			} else {
				if (!isAnySelected) {
					postData.toAdd = true;
					await markToResolve(postData);
					setSelectedRow({ index: i, ...val });
					globalContext.setUserData((prev) => {
						return { ...prev, current: [...prev.current, val] };
					});
				}
			}
		} catch (err) {
			console.error(err);
		}
	};

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
		if (!loading && tableData.length > 0) {
			for (let i = 0; i < metaData.end - metaData.start + 1; i++) {
				const val = tableData[i];
				const isAnySelected = selectedRow !== null;
				const isThisSelected = isAnySelected && selectedRow.index === i;
				const markup = (
					<tr
						key={i}
						className={`${isThisSelected && classes["selected-row"]}`}
					>
						<td>{i + 1}</td>
						<td>{val.priority}</td>
						<td>
							{new Date(val.createdAt).toLocaleString("en-US", {
								timeZone: "Asia/Kolkata",
							})}
						</td>
						<td>{val.issue}</td>
						<td>{val.subIssue}</td>
						<td>
							{val.description.length > 50
								? val.description.substr(0, 50) + "..."
								: val.description}
						</td>
						<td>
							<button
								disabled={
									!isAnySelected ? false : isThisSelected ? false : true
								}
								className={`${isThisSelected && classes["active"]}`}
								onClick={markToResolveHandler.bind(
									null,
									val.id,
									isThisSelected,
									isAnySelected,
									val,
									i
								)}
							>
								{isThisSelected ? "DeSelect" : "Resolve"}
							</button>
						</td>
					</tr>
				);
				table.push(markup);
			}
		}
		modalBody = (
			<table className={classes["table"]}>
				<thead>
					<tr>
						<td style={{ minWidth: "6.4rem", width: "6.4rem" }}>S.No</td>
						<td style={{ width: "7.8rem", minWidth: "7.8rem" }}>Priority</td>
						<td>Date</td>
						<td>Issue</td>
						<td>SubIssue</td>
						<td>Description</td>
						<td>Action</td>
					</tr>
				</thead>
				<tbody>{table}</tbody>
			</table>
		);
	}

	return (
		<>
			<ModalElement
				modalType={modalType}
				modalToggleHandler={modalToggleHandler}
				isModalOpen={isModalOpen}
				modalBody={loading ? <Loader /> : modalBody}
				modalName={
					modalType === "newChat"
						? "Submit new query"
						: `View all requests - ${Math.ceil(
								metaData.totalRows / rowsPerPage
						  )} page(s)`
				}
				formResetHandler={formResetHandler}
				submitBtnRef={submitBtnRef}
				formValidity={formValidity}
				rowsPerPage={rowsPerPage}
				currentPage={currentPage}
				totalRows={metaData.totalRows}
				rowsPerPageChangeHandler={rowsPerPageChangeHandler}
				pageChangeHandler={pageChangeHandler}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
			/>
		</>
	);
};

export default Modal;

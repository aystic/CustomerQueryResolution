import ModalElement from "./modalElement";
import classes from "./modal.module.css";
import { createChat } from "../api/user";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

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
	const submitBtnRef = useRef(null);
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
					modalType === "newChat" ? "Submit new query" : "View all requests"
				}
				formResetHandler={formResetHandler}
				submitBtnRef={submitBtnRef}
				formValidity={formValidity}
			/>
		</>
	);
};

export default Modal;

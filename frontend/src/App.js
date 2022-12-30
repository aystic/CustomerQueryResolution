import "./App.css";
import { useState } from "react";
import socket from "./utils/socket";
import { login } from "./api/common";
import Chat from "./components/chat";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EMAIL_REGEX =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function App() {
	const [email, setEmail] = useState("");
	const [userData, setUserData] = useState({
		email: "itspmohit@gmail.com",
		resolved: [],
		current: [],
	});
	const [isUser, setIsUser] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(true);
	const [isValid, setValidity] = useState(false);
	const inputChangeHandler = (e) => {
		setEmail(e.target.value);
		setValidity(EMAIL_REGEX.test(e.target.value));
	};
	const startChatHandler = async (e) => {
		e.preventDefault();
		try {
			// const data = await login(email);
			const data = {
				email,
				resolved: [],
				current: [],
			};
			console.log(data);
			setUserData(data);
			// In production we will fetch the role of the user from the backend
			if (email.split("@")[1] === "agent.com") {
				setIsUser(false);
			} else {
				setIsUser(true);
			}
			setIsLoggedIn(true);
		} catch (err) {
			console.error(err);
		}
	};

	const showNotification = ({ type, value }) => {
		toast(value, { type, className: "notification" });
	};

	return (
		<>
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
			/>
			{isLoggedIn && (
				<div className="chat-container">
					<Chat
						userData={userData}
						isUser={isUser}
						showNotification={showNotification}
					/>
				</div>
			)}
			{!isLoggedIn && (
				<div className="start-page">
					<div className="start-form-container">
						<form onSubmit={startChatHandler}>
							<input
								className="username-input"
								placeholder="Enter your email"
								type={"email"}
								value={email}
								onChange={inputChangeHandler}
							/>
							<button
								disabled={!isValid}
								className="username-input-btn"
								type="submit"
							>
								Enter
							</button>
						</form>
					</div>
				</div>
			)}
		</>
	);
}

export default App;

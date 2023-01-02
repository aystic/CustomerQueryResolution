import "./App.css";
import { useState, useContext } from "react";
import socket from "./utils/socket";
import { GlobalContext } from "./store/globalContext";
import { login } from "./api/common";
import { getChat } from "./api/common";
import Chat from "./components/chat";
import { ToastContainer } from "react-toastify";

const EMAIL_REGEX =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function App() {
	const [email, setEmail] = useState("");
	const globalContext = useContext(GlobalContext);
	const [isValid, setValidity] = useState(false);
	const inputChangeHandler = (e) => {
		setEmail(e.target.value);
		setValidity(EMAIL_REGEX.test(e.target.value));
	};

	const startChatHandler = async (e) => {
		e.preventDefault();
		try {
			const data = await login(email);
			const userData = await getChat(data.id, data.emailID);
			socket.auth = { email: data.emailID };
			socket.connect();

			const userChatData = {
				id: data.id,
				email: data.emailID,
				resolved: [],
				current: [],
			};
			userData.forEach((val) => {
				if (val.resolved === 1) {
					userChatData.resolved.push(val);
				} else {
					userChatData.current.push(val);
				}
			});
			globalContext.setIsLoggedIn(true);
			globalContext.setUserData(userChatData);
			if (data.emailID.split("@")[1] === "agent.com") {
				globalContext.setIsUser(false);
			} else {
				globalContext.setIsUser(true);
			}
		} catch (err) {
			console.error(err);
		}
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
			{globalContext.isLoggedIn && (
				<div className="chat-container">
					<Chat />
				</div>
			)}
			{!globalContext.isLoggedIn && (
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

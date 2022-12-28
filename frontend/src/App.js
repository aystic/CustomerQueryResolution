import "./App.css";
import { useState } from "react";
import socket from "./utils/socket";
import Chat from "./components/chat";

function App() {
	const [user, setUser] = useState("");
	const [isUser, setIsUser] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(true);
	const inputChangeHandler = (e) => {
		setUser(e.target.value);
	};
	const startChatHandler = (e) => {
		e.preventDefault();
		// socket.connect();

		// In production we will fetch the role of the user from the backend
		if (user.split("@")[1] === "agent.com") {
			setIsUser(false);
		} else {
			setIsUser(true);
		}
		setIsLoggedIn(true);
	};
	return (
		<>
			{isLoggedIn && (
				<div className="chat-container">
					<Chat isUser={isUser} />
				</div>
			)}
			{!isLoggedIn && (
				<div className="start-screen">
					<form onSubmit={startChatHandler}>
						<input
							className="username-input"
							placeholder="Enter your username"
							type={"email"}
							value={user}
							onChange={inputChangeHandler}
						/>
						<button className="username-input-btn" type="submit">
							Enter
						</button>
					</form>
				</div>
			)}
		</>
	);
}

export default App;

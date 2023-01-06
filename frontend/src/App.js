import "./App.css";
import { useState, useContext, useEffect } from "react";
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
			const userChatData = {
				id: data.id,
				email: data.emailID,
				resolved: [],
				current: [],
			};
			userData.forEach((val) => {
				val.hasNewMessages = false;
				if (val.resolved === 1) {
					userChatData.resolved.push(val);
				} else {
					userChatData.current.push(val);
				}
			});
			globalContext.setIsLoggedIn(true);
			globalContext.setUserData(userChatData);
			let isUser;
			if (data.emailID.split("@")[1] === "agent.com") {
				isUser = false;
				globalContext.setIsUser(false);
			} else {
				isUser = true;
				globalContext.setIsUser(true);
			}
			socket.auth = { email: data.emailID, id: data.id, isUser };
			socket.connect();
		} catch (err) {
			console.error(err);
		}
	};
	useEffect(() => {
		socket.on("connect", () => {
			console.log("connected", new Date());
			globalContext.setIsUserConnected(true);
		});
		socket.on("disconnect", (reason) => {
			if (reason === "io server disconnect") {
				socket.connect();
			}
			console.log("disconnected", new Date());
			globalContext.setIsUserConnected(false);
		});

		socket.on("ping", () => {
			socket.emit("pong");
		});

		socket.on("error", (...response) => {
			console.log(response);
		});
		return () => {
			socket.off("disconnect");
			socket.off("connect");
			socket.off("ping");
			socket.off("error");
		};
	}, [globalContext]);
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
			)}
		</>
	);
}

export default App;

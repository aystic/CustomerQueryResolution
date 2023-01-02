import classes from "./loader.module.css";
const Loader = () => {
	return (
		<div className={classes["loader-container"]}>
			<div className={classes["loader"]}></div>
		</div>
	);
};

export default Loader;

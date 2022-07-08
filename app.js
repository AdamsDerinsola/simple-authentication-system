const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let userList = [];

app.get("/", (req, res) => {
	res.render("home", { title: "Welcome" });
});

app.get("/signup", (req, res) => {
	res.render("signup", { title: "Sign-Up page" });
});

app.get("/login", (req, res) => {
	res.render("login", { title: "Login" });
});

app.get("/success", (req, res) => {
	res.render("success", { title: "Congratulations!" });
});

app.get("/profile", (req, res) => {
	res.render("profile", { title: "My Profile" });
});

app.post("/signup", (req, res) => {
	// CREATE NEW USER OBJECT EACH TIME A POST IS MADE
	let counter = 0;
	let user = {
		nameFirst: "",
		nameLast: "",
		userId: "",
		userKey: "",
	};

	// ASSIGN PASSED FORM DATA TO NEW USER OBJECT KEYS
	user.nameFirst = req.body.userFirstName;
	user.nameLast = req.body.userLastName;
	user.userId = req.body.userName;
	user.userKey = req.body.password;

	// CHECK IF USERNAME IS ALREADY EXISTING
	if (userList.length === 0) {
		userList.push(user);
		res.redirect("success");
	} else {
		for (let i = 0; i < userList.length; i++) {
			let listItem = userList[i];
			if (listItem.userId === user.userId) {
				counter += 1;
			}
		}

		// IF USERNAME ALREAdY EXISTS RETURN AN ERROR PAGE
		if (counter !== 0) {
			res.render("failure", {
				title: "Error",
				message: "Sorry, This username has already been taken!",
			});
		}
		// ELSE ADD NEW USER OBJECT TO THE USER ARRAY AND RETURN SUCCESS PAGE
		else {
			userList.push(user);
			res.redirect("success");
		}
	}
});

app.post("/login", (req, res) => {
	let counter = 0;
	let profileName = "";

	// ASSIGN USER ATTEMPTED LOGIN DATA
	const loginName = req.body.loginName;
	const loginKey = req.body.loginPassword;

	// CHECK IF USER DATA EXISTS AND RENDER PROFILE IF CREDENTIALS ARE CORRECT
	for (let i = 0; i < userList.length; i++) {
		let listItem = userList[i];
		if (listItem.userId === loginName && listItem.userKey === loginKey) {
			counter += 1;
			profileName = listItem.nameLast + " " + listItem.nameFirst;
		}
	}

	if (counter === 1) {
		res.render("profile", { profileHead: profileName, title: "My profile" });
	}
	// IF CREDENTIALS ARE WRONG RETURN ERROR PAGE
	else {
		res.render("failure", {
			title: "Error",
			message: "Confirm login details and try again",
		});
	}
});

app.get("/failure", (req, res) => {
	res.render("failure", { title: "Error!" });
});

app.listen(5000, function () {
	console.log("Server started on port 5000...");
});

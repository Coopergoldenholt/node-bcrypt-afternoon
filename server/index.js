const express = require("express");
require("dotenv").config();
const session = require("express-session");
const massive = require("massive");
const { SERVER_PORT, SESSION_SECRET, CONNECTION_STRING } = process.env;
const authCtrl = require("./controllers/authController");
const treasureCtrl = require("./controllers/treasureController");
const auth = require("./middleware/authMiddleware");

const app = express();

app.use(express.json());
app.use(
	session({
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 10 // 10 days
		}
	})
);

app.post("/auth/register", authCtrl.register);
app.post("/auth/login", authCtrl.login);
app.delete("/auth/logout", authCtrl.logout);
app.get("/api/treasure/dragon", treasureCtrl.dragonTreasure);
app.get("/api/treasure/user", auth.usersOnly, treasureCtrl.getUserTreasure);
app.post("/api/treasure/user", auth.usersOnly, treasureCtrl.addUserTreasure);
app.get(
	"/api/treasure/all",
	auth.usersOnly,
	auth.adminsOnly,
	treasureCtrl.getAllTreasure
);

massive(CONNECTION_STRING).then(db => {
	app.set("db", db);
	app.listen(SERVER_PORT, () => console.log(`${SERVER_PORT} is listening`));
});

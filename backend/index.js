const express = require("express");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
const port = 3000;
const SECRET_KEY = process.env.SECRET_KEY;

const pool = new Pool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: 5432,
});

app.post("/add", async (req, res) => {
	const { name, url } = req.body;
	const testExistence = await pool.query("SELECT * FROM url WHERE name = $1", [name]);
	if (testExistence.rows.length != 0) {
		res.status(403);
		res.json({ result: "URL already exists" });
		res.end();
	} else {
		await pool.query("INSERT INTO url (name, url, time) VALUES ($1, $2, NOW())", [name, url]);
		res.status(200);
		res.json({ result: "URL added successfully" });
		res.end();
	}
});

app.post("/admin/auth/login", async (req, res) => {
	const { account, password } = req.body;

	const result = await pool.query("SELECT id FROM account WHERE account = $1 AND password = $2", [account, password]);

	if (result.rowCount == 0) {
		res.status(401);
		res.json({ message: "Account or password is wrong." });
		return;
	} else {
		const token = jwt.sign({ id: result.rows[0].id }, SECRET_KEY, { expiresIn: "1h" });
		res.status(200);
		res.json({ message: "Succeed.", token });
		console.log("token:", token);
	}
});

app.post("/admin/auth/verify", async (req, res) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		res.status(400);
		res.json({ message: "Token not found." });
		return;
	}

	const token = authHeader.split(" ")[1];

	try {
		const tokenDecoded = jwt.verify(token, SECRET_KEY);
		const result = await pool.query("SELECT * FROM account WHERE id = $1", [tokenDecoded.id]);
		res.status(200).json({
			message: "Token is ok.",
			account: result.rows[0].account,
		});
	} catch (err) {
		console.log("Verify Error:", err);
		res.status(401).json({ message: "Token is invalid." });
	}
});

app.get("/admin/all", async (req, res) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		res.status(400);
		res.json({ message: "Token not found." });
		return;
	}

	const token = authHeader.split(" ")[1];

	try {
		const tokenDecoded = jwt.verify(token, SECRET_KEY);
		const result = await pool.query("SELECT * FROM url");
		res.status(200).json({
			data: result.rows,
		});
	} catch (err) {
		console.log("Verify Error:", err);
		res.status(401).json({ message: "Token is invalid." });
	}
});

app.post("/admin/delete", async (req, res) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		res.status(400);
		res.json({ message: "Token not found." });
		return;
	}

	const token = authHeader.split(" ")[1];

	try {
		const tokenDecoded = jwt.verify(token, SECRET_KEY);
		const { id } = req.body;
		await pool.query("DELETE FROM url WHERE id = $1", [id]);
		res.status(200).json({ result: "URL deleted successfully" });
	} catch (err) {
		console.log("Verify Error:", err);
		res.status(401).json({ message: "Token is invalid." });
	}
});

app.get("/:name", async (req, res) => {
	const name = String(req.params.name);
	const result = await pool.query("SELECT * FROM url WHERE name = $1", [name]);
	console.log(result.rows);
	if (result.rows.length === 0) {
		res.json({ url: "/" });
	} else {
		res.json({ url: result.rows[0].url });
	}
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});

const express = require("express");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();
const port = 3000;

const pool = new Pool({
	host: "db",
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: 5432,
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

app.post("/add", async (req, res) => {
	const { name, url } = req.body;
	const testExistence = await pool.query("SELECT * FROM url WHERE name = $1", [name]);
	if (testExistence.rows.length != 0) {
		res.json({ result: "URL already exists" });
	} else {
		await pool.query("INSERT INTO url (name, url, time) VALUES ($1, $2, NOW())", [name, url]);
		res.json({ result: "URL added successfully" });
	}
});

app.post("/delete", async (req, res) => {
	const { id } = req.body;
	const testExistence = await pool.query("SELECT * FROM url WHERE id = $1", [id]);
	if (testExistence.rows.length != 0) {
		await pool.query("DELETE FROM url WHERE id = $1", [id]);
		res.json({ result: "URL deleted successfully" });
	} else {
		res.json({ result: "URL not found" });
	}
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});

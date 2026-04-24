const express = require("express")
const app = express()
const PORT = 3000

app.use(express.json())

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html")
})

app.post("/log", (req, res) => {
	const { message, level, timestamp } = req.body

	if (!message) {
		return res.status(400).json({ error: "Missing message" })
	}

	const log = {
		level: level || "info",
		message,
		timestamp: timestamp || new Date().toISOString(),
	}

	console.log(`[${log.level.toUpperCase()}] ${log.timestamp} — ${log.message}`)

	app.locals.logs = app.locals.logs || []
	app.locals.logs.unshift(log)
	if (app.locals.logs.length > 200) app.locals.logs.pop()

	res.json({ ok: true })
})

app.get("/logs", (req, res) => {
	res.json(app.locals.logs || [])
})

app.listen(PORT, () => {
	console.log(`Log server running at http://localhost:${PORT}`)
})

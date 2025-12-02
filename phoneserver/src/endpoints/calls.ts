import express from "express";
import { db } from "../db";

// ...existing code...

const router = express.Router();

router.get("/api/calls", async (req, res) => {
	try {
		// Extract user ID from JWT cookie
		const { getUserIdFromToken } = await import("../functions/tokenizer.js");
		const userId = getUserIdFromToken(req.cookies.jwt);

		const calls = await db
			.selectFrom("call")
			.selectAll()
			.where("owner", "=", userId)
			.execute();
		res.json(calls);
	} catch {
		res.status(500).json({ error: "Failed to fetch calls" });
	}
});
export { router as callsRouter };

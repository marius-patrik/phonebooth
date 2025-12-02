import Database from "better-sqlite3";
import { type Generated, Kysely, SqliteDialect } from "kysely";
import { config } from "../config.js";

interface DatabaseSchema {
	user: {
		id: Generated<number>; // UUID
		authCode?: number;
		authCodeExpires?: string; // ISO timestamp
		authCodeCreated?: string; // ISO timestamp for code creation

		email: string;
		callerId: number;
		balance: number;
		displayCurrency: string;
		currency: string;
	};
	call: {
		id: Generated<number>;
		owner: number;

		calleeID: number;
		countryCode: number;

		status: "ringing" | "connected" | "hanging" | "over" | "failed";

		startTime: string;
		lastBillingCheck?: string; // ISO timestamp of last billing check

		price?: number;
		endTime?: string;
	};
	rate: {
		id: Generated<number>;

		country: string;
		code: number;
		price: number;
	};
	transaction: {
		id: Generated<number>;
		owner: number;

		transactionType: string;
		displayCurrency: string;
		value: number;
		timestamp: string;
	};
	contact: {
		id: Generated<number>;
		owner: number;

		name: string;
		calleeID: number;
		countryCode: number;
		createdAt: string;
	};
}

// Create the Kysely instance with the schema
export const db = new Kysely<DatabaseSchema>({
	dialect: new SqliteDialect({
		database: new Database(config.databasePath),
	}),
});

// Log database location on initialization
if (config.databasePath === ":memory:") {
	console.log("⚠️  Using in-memory database - data will be lost on restart");
} else {
	console.log(`✓ Using persistent database: ${config.databasePath}`);
}

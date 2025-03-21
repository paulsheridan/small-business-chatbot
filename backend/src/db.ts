import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.resolve(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "chatbot.db");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL,  -- "user" or "assistant"
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export function saveMessage(role: "user" | "assistant", content: string) {
  const stmt = db.prepare("INSERT INTO messages (role, content) VALUES (?, ?)");
  stmt.run(role, content);
}

export default db;

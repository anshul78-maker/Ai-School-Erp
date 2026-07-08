import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import path from "path";
import { students as seedStudents } from "../seed/data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

// --- schema ---------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    profile TEXT NOT NULL           -- JSON blob with everything the dashboard needs
  );
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    meta TEXT,
    xp INTEGER DEFAULT 0,
    done INTEGER DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES students(id)
  );
`);

// --- seeding --------------------------------------------------------------
function seed() {
  const insertStudent = db.prepare(
    "INSERT INTO students (username, password_hash, profile) VALUES (?, ?, ?)"
  );
  const insertTask = db.prepare(
    "INSERT INTO tasks (student_id, text, meta, xp, done) VALUES (?, ?, ?, ?, ?)"
  );

  const tx = db.transaction(() => {
    for (const s of seedStudents) {
      const { password, tasks, ...profile } = s;
      const hash = bcrypt.hashSync(password, 10);
      const info = insertStudent.run(s.username, hash, JSON.stringify(profile));
      const sid = info.lastInsertRowid;
      for (const t of tasks) insertTask.run(sid, t.text, t.meta, t.xp, t.done);
    }
  });
  tx();
  console.log(`Seeded ${seedStudents.length} student(s).`);
}

const count = db.prepare("SELECT COUNT(*) AS n FROM students").get().n;
const reseed = process.argv.includes("--reseed");
if (reseed) {
  db.exec("DELETE FROM tasks; DELETE FROM students;");
  seed();
} else if (count === 0) {
  seed();
}

// --- query helpers --------------------------------------------------------
export function getStudentByUsername(username) {
  return db.prepare("SELECT * FROM students WHERE username = ?").get(username);
}
export function getStudentById(id) {
  return db.prepare("SELECT * FROM students WHERE id = ?").get(id);
}
export function getTasks(studentId) {
  return db
    .prepare("SELECT id, text, meta, xp, done FROM tasks WHERE student_id = ? ORDER BY id")
    .all(studentId);
}
export function toggleTask(studentId, taskId) {
  const t = db
    .prepare("SELECT done FROM tasks WHERE id = ? AND student_id = ?")
    .get(taskId, studentId);
  if (!t) return null;
  const next = t.done ? 0 : 1;
  db.prepare("UPDATE tasks SET done = ? WHERE id = ?").run(next, taskId);
  return next;
}

export default db;

// Allow running "node server/db.js --reseed" directly.
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("Database ready at", DB_PATH);
}

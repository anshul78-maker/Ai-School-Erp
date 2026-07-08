import { Router } from "express";
import { getStudentById, getTasks, toggleTask } from "../db.js";
import { requireAuth } from "../auth.js";
import { studyBuddyReply, weeklyInsight, aiEnabled } from "../ai.js";

const router = Router();
router.use(requireAuth);

function loadProfile(req, res) {
  const student = getStudentById(req.user.id);
  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return null;
  }
  return { student, profile: JSON.parse(student.profile) };
}

// Everything the dashboard needs, in one call.
router.get("/dashboard", (req, res) => {
  const ctx = loadProfile(req, res);
  if (!ctx) return;
  const tasks = getTasks(ctx.student.id);
  res.json({ ...ctx.profile, tasks, aiEnabled });
});

// Toggle a task done/undone (persists to the database).
router.post("/tasks/:id/toggle", (req, res) => {
  const next = toggleTask(req.user.id, Number(req.params.id));
  if (next === null) return res.status(404).json({ error: "Task not found" });
  res.json({ id: Number(req.params.id), done: next });
});

// AI study buddy.
router.post("/buddy", async (req, res) => {
  const ctx = loadProfile(req, res);
  if (!ctx) return;
  const message = (req.body && req.body.message) || "";
  if (!message.trim()) return res.status(400).json({ error: "Empty message" });
  const result = await studyBuddyReply(message, ctx.profile);
  res.json(result);
});

// AI weekly insight (refreshes the text on the overview).
router.get("/insight", async (req, res) => {
  const ctx = loadProfile(req, res);
  if (!ctx) return;
  const result = await weeklyInsight(ctx.profile);
  res.json(result);
});

export default router;

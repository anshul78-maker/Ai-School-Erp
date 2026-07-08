import { Router } from "express";
import { getStudentByUsername } from "../db.js";
import { verifyPassword, signToken } from "../auth.js";

const router = Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ error: "Enter your username and password" });

  const student = getStudentByUsername(username.trim().toLowerCase());
  if (!student || !verifyPassword(password, student.password_hash))
    return res.status(401).json({ error: "Wrong username or password" });

  const token = signToken(student);
  const profile = JSON.parse(student.profile);
  res.json({ token, name: profile.name });
});

export default router;

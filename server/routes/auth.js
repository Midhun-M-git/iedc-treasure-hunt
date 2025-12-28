import express from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Register a new team
router.post("/register", async (req, res) => {
  const { teamName, password, members } = req.body;
  if (!teamName || !password || !members || !Array.isArray(members) || members.length === 0) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  try {
    // Check if teamName already exists
    const existing = await prisma.team.findUnique({ where: { teamName } });
    if (existing) {
      return res.status(409).json({ success: false, message: "Team name already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const team = await prisma.team.create({
      data: {
        teamName,
        password: hashedPassword,
        members: {
          create: members.map(name => ({ name }))
        }
      },
      include: { members: true }
    });
    res.json({ success: true, message: "Team registered!", team });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error registering team", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { teamName, password } = req.body;
  const team = await prisma.team.findUnique({ where: { teamName } });

  if (!team) return res.status(401).json({ success: false, message: "Invalid credentials" });

  const isValid = await bcrypt.compare(password, team.password);
  if (!isValid) return res.status(401).json({ success: false, message: "Invalid credentials" });

  res.json({ success: true, message: "Login successful", team });
});

export default router;

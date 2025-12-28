import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt"; // for password hashing

const app = express();
const prisma = new PrismaClient();

// Configure multer (uploads stored in /uploads)
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); // serve uploaded files

//---------------------------------------
// Register a new team (with password hashing)
app.post("/register", async (req, res) => {
  const { teamName, password } = req.body;
  try {
    // Check if teamName already exists
    const existing = await prisma.team.findUnique({ where: { teamName } });
    if (existing) {
      return res.status(409).json({ error: "Team name already exists!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const team = await prisma.team.create({
      data: { teamName, password: hashedPassword },
    });
    res.json(team);
  } catch (error) {
    res.status(400).json({ error: "Registration failed!" });
  }
});

// Login (check hashed password)
app.post("/login", async (req, res) => {
  const { teamName, password } = req.body;

  const team = await prisma.team.findUnique({ where: { teamName } });
  if (team && (await bcrypt.compare(password, team.password))) {
    res.json({ message: "Login successful", teamId: team.id });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});


//---------------------------------------
// ADD TEAM MEMBER
//---------------------------------------
app.post("/api/teams/:teamId/members", async (req, res) => {
  const { name } = req.body;
  const { teamId } = req.params;

  try {
    const member = await prisma.member.create({
      data: { name, teamId: parseInt(teamId) },
    });
    res.json({ message: "Member added!", member });
  } catch (error) {
    res.status(500).json({ error: "Failed to add member." });
  }
});

//---------------------------------------
// UPLOAD SELFIE
//---------------------------------------
app.post("/api/teams/:teamId/selfie", upload.single("selfie"), async (req, res) => {
  const { teamId } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    const selfie = await prisma.selfie.create({
      data: { teamId: parseInt(teamId), imageUrl: `/uploads/${req.file.filename}` },
    });

    res.json({ message: "Selfie uploaded successfully!", selfie });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload selfie." });
  }
});

//---------------------------------------
// SERVER START
//---------------------------------------
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

import express from "express";
import cors from "cors";
import multer from "multer";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

// ✅ Registration
app.post("/register", async (req, res) => {
  const { teamName, userId, password } = req.body;
  const team = await prisma.team.create({
    data: { teamName, userId, password }
  });
  res.json(team);
});

// ✅ Upload selfie before clue unlock
app.post("/upload/:teamId", upload.single("selfie"), async (req, res) => {
  await prisma.selfie.create({
    data: { teamId: Number(req.params.teamId), path: req.file?.path || "" }
  });
  res.json({ success: true, clue: "Next location: Auditorium" });
});

app.listen(4000, () => console.log("Backend running on port 4000"));

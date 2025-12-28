
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const prisma = new PrismaClient();

// Registration route
app.post('/register', async (req, res) => {
	try {
		const { teamName, loginId, password, members } = req.body;
		const team = await prisma.team.create({
			data: {
				name: teamName,
				loginId,
				password,
				members: {
					create: members.map((name: string) => ({ name }))
				}
			},
			include: { members: true }
		});
		res.json({ message: 'Registered', team });
	} catch (error) {
		res.status(400).json({ error: 'Registration failed', details: error });
	}
});

// Login route
app.post('/login', async (req, res) => {
	try {
		const { loginId, password } = req.body;
		const team = await prisma.team.findUnique({
			where: { loginId }
		});
		if (!team || team.password !== password) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}
		res.json({ message: 'Logged in', teamId: team.id });
	} catch (error) {
		res.status(400).json({ error: 'Login failed', details: error });
	}
});

// Progress route
app.get('/progress/:teamId', async (req, res) => {
	// ...existing code...
	res.json({ node: 'Library' });
});

// Selfie upload route
app.post('/selfie', async (req, res) => {
	// ...existing code...
	res.json({ message: 'Selfie uploaded' });
});

// Excel export route
app.get('/export', async (req, res) => {
	// ...existing code...
	res.json({ message: 'Excel exported' });
});

export default app;

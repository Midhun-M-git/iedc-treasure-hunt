"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const prisma = new client_1.PrismaClient();
// Registration route
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamName, loginId, password, members } = req.body;
        const team = yield prisma.team.create({
            data: {
                name: teamName,
                loginId,
                password,
                members: {
                    create: members.map((name) => ({ name }))
                }
            },
            include: { members: true }
        });
        res.json({ message: 'Registered', team });
    }
    catch (error) {
        res.status(400).json({ error: 'Registration failed', details: error });
    }
}));
// Login route
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loginId, password } = req.body;
        const team = yield prisma.team.findUnique({
            where: { loginId }
        });
        if (!team || team.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({ message: 'Logged in', teamId: team.id });
    }
    catch (error) {
        res.status(400).json({ error: 'Login failed', details: error });
    }
}));
// Progress route
app.get('/progress/:teamId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ...existing code...
    res.json({ node: 'Library' });
}));
// Selfie upload route
app.post('/selfie', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ...existing code...
    res.json({ message: 'Selfie uploaded' });
}));
// Excel export route
app.get('/export', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ...existing code...
    res.json({ message: 'Excel exported' });
}));
exports.default = app;

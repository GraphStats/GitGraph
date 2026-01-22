import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import githubHandler from './api/github.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// For local development, we use the same logic as the serverless function
app.all('/api/github*', async (req, res) => {
    // Simulate Vercel's request/response behavior
    return githubHandler(req, res);
});

app.listen(PORT, () => {
    console.log(`🚀 Local proxy server running on http://localhost:${PORT}`);
    console.log(`📡 Ready to handle Vercel-style API requests`);
});

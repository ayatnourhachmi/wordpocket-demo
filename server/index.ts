import express from 'express';
import dotenv from 'dotenv';
import generateHandler from './api/generate.js';

dotenv.config({ path: './server/.env' });

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.post('/api/generate', generateHandler);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
});

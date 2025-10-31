import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db.js';
// ...existing code...
// updated import to match mailer export
import { initMailerIfNeeded } from './config/mailer.js';
import { errorHandler } from './utils/error.js';

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import touristRoutes from './routes/tourist.js';
import verifyRoutes from './routes/verify.js';
import emergencyRoutes from './routes/emergency.js';
import incidentRoutes from './routes/incidents.js';
import teamsRoutes from './routes/teams.js';
import analyticsRoutes from './routes/analytics.js';
import routesProxy from './routes/routesProxy.js';
import safeRoutesAPI from './routes/routes.js';
import debugRoutes from './routes/debug.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('[API] build', new Date().toISOString());

// Connect DB + Mailer
await connectDB();
// ...existing code...
// updated call to match exported function name
await initMailerIfNeeded();

// CORS
const origins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: origins.length ? origins : '*',
  credentials: true
}));

// Security + parsing + logs
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Rate limiting
const authLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 50 });
const sosLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

app.use('/api/auth', authLimiter);
app.use('/api/emergency', sosLimiter);
app.use('/api/sos', sosLimiter); // if used elsewhere

// Health
app.get('/api/health', (req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tourist', touristRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/routes', safeRoutesAPI);
app.use('/api/routesProxy', routesProxy);

// Debug routes (for verifying DB/collections quickly)
app.use('/api/debug', debugRoutes);

// 404 fallback
app.use((req, res) => res.status(404).json({ ok: false, message: 'Not found' }));

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
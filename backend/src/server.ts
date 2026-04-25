import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import analyzeRouter from './routes/analyze.route';
import compareRouter from './routes/compare.route';
import trendingRouter from './routes/trending.route';
import generateRouter from './routes/generate.route';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

// Trust Railway/Vercel proxy so rate-limiter can read the real client IP
app.set('trust proxy', 1);

// ─── Security headers ─────────────────────────────────────────────────────
app.use(helmet());

// ─── Global middleware ────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace('https://', 'https://www.') : undefined,
].filter(Boolean) as string[];

function isAllowedOrigin(origin: string): boolean {
  if (allowedOrigins.includes(origin)) return true;
  // Accept any *.vercel.app deployment
  if (/^https:\/\/[a-z0-9][a-z0-9-]*\.vercel\.app$/.test(origin)) return true;
  return false;
}

const corsOptions: cors.CorsOptions = {
  origin: (origin, cb) => {
    if (!origin || isAllowedOrigin(origin)) {
      cb(null, true);
    } else {
      cb(new Error(`CORS blocked: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json({ limit: '50kb' }));
app.use(rateLimiter);

// ─── Health check ─────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────
app.use('/analyze', analyzeRouter);
app.use('/compare', compareRouter);
app.use('/trending', trendingRouter);
app.use('/generate', generateRouter);

// ─── 404 + error handlers (must be last) ─────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`[Server] Hashtag Intelligence API running on http://localhost:${config.port}`);
  console.log(`[Server] POST http://localhost:${config.port}/analyze`);
  if (!config.llm.foundryApiKey || !config.llm.foundryResource) {
    console.warn('[Server] WARNING: ANTHROPIC_FOUNDRY_API_KEY or ANTHROPIC_FOUNDRY_RESOURCE not set — LLM enrichment will be skipped.');
  } else {
    console.log(`[Server] LLM: Azure AI Foundry (${config.llm.foundryDeployment}) ready.`);
  }
});

export default app;

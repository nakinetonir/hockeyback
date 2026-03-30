import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import playersRoutes from './routes/players.routes.js';
import goaliesRoutes from './routes/goalies.routes.js';
import matchesRoutes from './routes/matches.routes.js';
import teamsRoutes from './routes/teams.routes.js';
import { notFoundHandler } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.corsOrigins.length === 0 || env.corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origen no permitido por CORS: ${origin}`));
    }
  })
);

app.use(express.json());
app.use(morgan('dev'));

app.use(async (_req, _res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    next(error);
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/goalies', goaliesRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/teams', teamsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
export default app;
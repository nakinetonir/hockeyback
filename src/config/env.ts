import dotenv from 'dotenv';

dotenv.config();

const defaultMongoUri = 'mongodb+srv://nacho:20Deabril%40@cluster0.3aqi7.mongodb.net/';
const defaultCorsOrigin = 'http://localhost:4200';

function parseCorsOrigins(value: string | undefined): string[] {
  const source = value && value.trim().length > 0 ? value : defaultCorsOrigin;
  return source
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export const env = {
  port: Number(process.env.PORT || 3000),
  mongoUri: process.env.MONGODB_URI || defaultMongoUri,
  mongoDb: process.env.MONGODB_DB || 'hockeylinea',
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN)
};

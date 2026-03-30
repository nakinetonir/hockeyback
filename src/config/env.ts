import dotenv from 'dotenv';
dotenv.config();

function parseCorsOrigins(value: string | undefined): string[] {
  return (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export const env = {
  port: Number(process.env.PORT || 3000),
  mongoUri: process.env.MONGODB_URI || '',
  mongoDb: process.env.MONGODB_DB || 'hockeylinea',
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN)
};

if (!env.mongoUri) {
  throw new Error('Falta MONGODB_URI');
}
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
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN),
  analysisWebhookUrl:
    process.env.ANALYSIS_WEBHOOK_URL ||
    'https://n8n-nightly-bcxd.onrender.com/webhook/70b0e3dc-f16f-4fb6-9de8-3b312a09073e'
};

if (!env.mongoUri) {
  throw new Error('Falta MONGODB_URI');
}

import mongoose from 'mongoose';
import { env } from './env.js';

let connectionPromise: Promise<typeof mongoose> | null = null;
let hasLoggedConnection = false;

export async function connectDb(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(env.mongoUri, {
        dbName: env.mongoDb
      })
      .then((connection) => {
        if (!hasLoggedConnection) {
          console.log(`Mongo conectado a ${env.mongoDb}`);
          hasLoggedConnection = true;
        }
        return connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
}

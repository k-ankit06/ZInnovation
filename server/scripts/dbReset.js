// server/scripts/dbReset.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const DB_NAME = 'tourist_safety'; // keep in sync with connectDB

async function run() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/';
    await mongoose.connect(uri, { dbName: DB_NAME });
    const result = await mongoose.connection.db.dropDatabase();
    console.log(`Dropped database "${DB_NAME}":`, result);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('DB reset failed:', err);
    process.exit(1);
  }
}

run();
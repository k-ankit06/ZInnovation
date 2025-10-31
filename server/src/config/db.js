import mongoose from 'mongoose';

// Log all mongoose operations (useful while debugging inserts/finds)
mongoose.set('debug', true);

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing');
  // Make sure we always use the same DB name
  await mongoose.connect(uri, { dbName: 'tourist_safety' });
  const c = mongoose.connection;
  console.log('[DB] Connected:', { host: c.host, port: c.port, name: c.name });
}
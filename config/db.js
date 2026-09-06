const mongoose = require('mongoose');

let cached = global._mongooseConn;
if (!cached) cached = global._mongooseConn = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Check your .env file.');
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
      .then((m) => { console.log('MongoDB connected'); return m; });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
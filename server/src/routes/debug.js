import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/collections', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const names = await db.listCollections().toArray();
    const out = {};
    for (const n of names) {
      out[n.name] = await db.collection(n.name).countDocuments();
    }
    return res.json({ ok: true, db: mongoose.connection.name, collections: out });
  } catch (e) {
    console.error('debug/collections error', e);
    return res.status(500).json({ ok: false, message: e.message });
  }
});

router.get('/incidents', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const docs = await db.collection('incidents').find().sort({ createdAt: -1 }).limit(5).toArray();
    return res.json({ ok: true, db: mongoose.connection.name, last5: docs });
  } catch (e) {
    console.error('debug/incidents error', e);
    return res.status(500).json({ ok: false, message: e.message });
  }
});

export default router;
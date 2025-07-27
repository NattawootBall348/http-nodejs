import express from 'express';
import { middleware } from '@line/bot-sdk';
import dotenv from 'dotenv';

import { config, client } from './line/config.js';
import { handleLineEvent } from './handlers/lineHandler.js';

dotenv.config();

const app = express();

app.use(middleware(config));
app.use(express.json());

app.post('/webhook', async (req, res) => {
  try {
    const events = req.body.events;
    await Promise.all(events.map(handleLineEvent));
    res.status(200).end();
  } catch (err) {
    console.error('❌ LINE Webhook Error:', err);
    res.status(500).end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Webhook endpoint: http://localhost:${PORT}/webhook`);
});

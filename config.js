import 'dotenv/config';
import { Client } from '@line/bot-sdk';

// โหลดค่า LINE Token จาก .env
const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// สร้าง LINE Client
const client = new Client(config);
export {client};

export { config, client };
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ใช้ GPT-4-turbo ซึ่งคุ้มค่าที่สุดในปี 2025
export async function askGPT(userId, messageText, history = []) {
  const messages = [
    { role: 'system', content: 'คุณคือผู้ช่วยที่ฉลาด สุภาพ และจำข้อมูลผู้ใช้ได้' },
    ...history,
    { role: 'user', content: messageText }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'ขออภัย ฉันไม่เข้าใจ';
}

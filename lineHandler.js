import { client } from '../line/config.js';
import { askGPT } from '../services/gptService.js';
import { db } from '../firebase/firebase.js';

export async function handleLineEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') return;

  const userId = event.source.userId;
  const messageText = event.message.text;
  const timestamp = new Date(event.timestamp);

  // ดึงโปรไฟล์ผู้ใช้จาก LINE และเก็บไว้ใน Firestore
  const profile = await client.getProfile(userId);
  await db.collection('users').doc(userId).set({
    displayName: profile.displayName,
    pictureUrl: profile.pictureUrl,
    lastActive: timestamp
  }, { merge: true });

  // ดึงประวัติข้อความ 5 รายการล่าสุด
  const historySnapshot = await db.collection('conversations')
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .limit(5)
    .get();

  const history = [];
  historySnapshot.forEach(doc => {
    const data = doc.data();
    history.unshift({ role: 'user', content: data.message });
    if (data.reply) {
      history.unshift({ role: 'assistant', content: data.reply });
    }
  });

  // ขอคำตอบจาก GPT
  const replyText = await askGPT(userId, messageText, history);

  // บันทึกคำถาม-คำตอบ
  await db.collection('conversations').add({
    userId,
    message: messageText,
    reply: replyText,
    timestamp
  });

  // Flex Message ตอบกลับ
  const flexMsg = {
    type: 'flex',
    altText: 'BallGPT มีคำตอบแล้ว',
    contents: {
      type: 'bubble',
      hero: {
        type: 'image',
        url: profile.pictureUrl || 'https://placekitten.com/200/200',
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover'
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: profile.displayName,
            weight: 'bold',
            size: 'lg'
          },
          {
            type: 'text',
            text: replyText,
            wrap: true,
            margin: 'md',
            size: 'md',
            color: '#666666'
          }
        ]
      }
    }
  };

  return client.replyMessage(event.replyToken, flexMsg);
}

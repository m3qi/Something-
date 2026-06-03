const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const stages = JSON.parse(fs.readFileSync('./stages.json', 'utf-8'));
const PROGRESS_FILE = './progress.json';
let progress = { startTime: Date.now(), lastNotifiedStage: 0 };

if (fs.existsSync(PROGRESS_FILE)) {
  try {
    const saved = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
    progress = saved;
  } catch(e) {}
}

function saveProgress() {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// Telegram settings (8947928608:AAFVoWeordXH-h7AzmPBwww3UV-tCTZc_c0)
const BOT_TOKEN = 'BOT_TOKEN_HERE';
const CHAT_ID = 'CHAT_ID_HERE';

async function sendTelegramMessage(message) {
  if (BOT_TOKEN === 'BOT_TOKEN_HERE') return;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message })
    });
  } catch(e) { console.error(e); }
}

function getCurrentOpenStage() {
  const now = Date.now();
  let openId = 1;
  for (let i = 0; i < stages.length; i++) {
    const openTime = progress.startTime + stages[i].openAfterHours * 60 * 60 * 1000;
    if (now >= openTime) openId = stages[i].id;
    else break;
  }
  return openId;
}

app.get('/api/current-stage', (req, res) => {
  const currentId = getCurrentOpenStage();
  if (currentId > stages.length) {
    return res.json({ finished: true, message: '🎉 تهانينا! لقد أكملت جميع المراحل العشر بنجاح 🎉' });
  }
  const stage = stages.find(s => s.id === currentId);
  if (currentId > progress.lastNotifiedStage) {
    sendTelegramMessage(`🔓 تم فتح المرحلة ${currentId}\nالسؤال: ${stage.puzzle}\n${stage.hint ? 'تلميح: '+stage.hint : ''}`);
    progress.lastNotifiedStage = currentId;
    saveProgress();
  }
  res.json({
    stageId: stage.id,
    puzzle: stage.puzzle,
    hint: stage.hint || "لا يوجد تلميح",
    songUrl: stage.songUrl || null,
    finished: false
  });
});

app.post('/api/submit-answer', async (req, res) => {
  const { stageId, answer } = req.body;
  const stage = stages.find(s => s.id === stageId);
  if (!stage) return res.json({ correct: false, message: 'مرحلة غير صالحة' });
  const isCorrect = answer.trim().toLowerCase() === stage.answer.toLowerCase();
  if (isCorrect) {
    await sendTelegramMessage(`✅ تم حل المرحلة ${stageId} بنجاح!`);
    return res.json({ correct: true, nextStageId: stageId + 1 });
  } else {
    return res.json({ correct: false, message: '❌ إجابة خاطئة، حاول مرة أخرى' });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

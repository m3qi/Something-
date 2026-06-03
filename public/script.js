let currentStageId = null;
let currentSongUrl = null;

async function loadStage() {
    const res = await fetch('/api/current-stage');
    const data = await res.json();
    if (data.finished) {
        document.getElementById('puzzle-box').innerHTML = `
            <h2>🎉 مبروك 🎉</h2>
            <p style="font-size:1.3rem;">${data.message || 'لقد أنهيت جميع المراحل! أنتِ خلصتي اللعبه بهاي السرعه انطينه مجال'}</p>
            <p>شكراً  ❤️</p>
        `;
        return;
    }
    currentStageId = data.stageId;
    currentSongUrl = data.songUrl;
    document.getElementById('stage-title').innerText = `المرحلة ${data.stageId}`;
    document.getElementById('puzzle-text').innerHTML = `📖 السؤال: ${data.puzzle}`;
    document.getElementById('hint-text').innerText = data.hint || "لا يوجد تلميح";
    document.getElementById('message').innerText = '';
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').disabled = false;
    document.getElementById('submit-btn').disabled = false;
    
    const playerDiv = document.getElementById('music-player');
    if (currentSongUrl && currentSongUrl.trim() !== '') {
        playerDiv.innerHTML = `
            <button id="play-song-btn" style="background:#ff7b00; color:white; border:none; padding:8px 16px; border-radius:25px; cursor:pointer; margin-top:10px;">
                🎵 تشغيل الموسيقى
            </button>
        `;
        document.getElementById('play-song-btn').addEventListener('click', () => {
            window.open(currentSongUrl, '_blank');
        });
    } else {
        playerDiv.innerHTML = '';
    }
}

async function submitAnswer() {
    const answer = document.getElementById('answer-input').value.trim();
    if (!answer) {
        document.getElementById('message').innerText = 'الرجاء كتابة إجابة';
        return;
    }
    const res = await fetch('/api/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stageId: currentStageId, answer })
    });
    const data = await res.json();
    if (data.correct) {
        document.getElementById('message').innerHTML = '✅ إجابة صحيحة! تهانينا. انتقل إلى المرحلة التالية.';
        loadStage();
    } else {
        document.getElementById('message').innerHTML = `❌ ${data.message}`;
    }
}

document.getElementById('submit-btn').addEventListener('click', submitAnswer);
loadStage();
setInterval(loadStage, 60000);

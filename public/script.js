let currentStageId = null;
let currentSongUrl = null;
let messageTimeout = null;

async function loadStage() {
    const res = await fetch('/api/current-stage');
    const data = await res.json();
    if (data.finished) {
        document.getElementById('puzzle-box').innerHTML = `
            <h2>🎉 مبروك 🎉</h2>
            <p style="font-size:1.3rem;">${data.message || 'لقد أنهيت جميع المراحل! أنتِ شاطره'}</p>
            <p>شكراً  ❤️</p>
        `;
        return;
    }
    currentStageId = data.stageId;
    currentSongUrl = data.songUrl;
    document.getElementById('stage-title').innerText = `المرحلة ${data.stageId}`;
    document.getElementById('puzzle-text').innerHTML = `📖 السؤال: ${data.puzzle}`;
    document.getElementById('hint-text').innerText = data.hint || "لا يوجد تلميح";
    
    // مسح حقل الإجابة والرسالة السابقة
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').disabled = false;
    document.getElementById('submit-btn').disabled = false;
    
    // مسح الرسالة فقط (ليس بشكل فوري، بل نتركها إذا كانت موجودة)
    if (messageTimeout) clearTimeout(messageTimeout);
    const messageDiv = document.getElementById('message');
    if (messageDiv) messageDiv.innerText = '';
    
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
    const messageDiv = document.getElementById('message');
    
    if (!answer) {
        showMessage('الرجاء كتابة إجابة', 'error');
        return;
    }
    
    try {
        const res = await fetch('/api/submit-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stageId: currentStageId, answer })
        });
        const data = await res.json();
        
        if (data.correct) {
            showMessage('✅ إجابة صحيحة! تهانينا. انتقل إلى المرحلة التالية.', 'success');
            // بعد 2 ثانية، انتقل إلى المرحلة التالية
            setTimeout(() => {
                loadStage();
            }, 2000);
        } else {
            showMessage(`❌ ${data.message}`, 'error');
            // لا نعيد تحميل المرحلة، فقط نمسح حقل الإجابة
            document.getElementById('answer-input').value = '';
        }
    } catch (error) {
        showMessage('❌ حدث خطأ في الاتصال بالخادم', 'error');
    }
}

function showMessage(msg, type) {
    const messageDiv = document.getElementById('message');
    if (messageTimeout) clearTimeout(messageTimeout);
    messageDiv.innerHTML = msg;
    messageDiv.style.color = (type === 'success') ? '#2ecc71' : '#e74c3c';
    // تختفي الرسالة بعد 5 ثوانٍ
    messageTimeout = setTimeout(() => {
        if (messageDiv) messageDiv.innerHTML = '';
    }, 5000);
}

document.getElementById('submit-btn').addEventListener('click', submitAnswer);
loadStage();
setInterval(loadStage, 60000);

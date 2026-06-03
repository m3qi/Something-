let currentStageId = null;
let currentSongUrl = null;
let messageTimeout = null;
let audioPlayer = null;
let countdownInterval = null;

async function loadStage() {
    const res = await fetch('/api/current-stage');
    const data = await res.json();
    
    if (data.finished) {
        document.getElementById('puzzle-box').innerHTML = `
            <h2>🎉 مبروك 🎉</h2>
            <p style="font-size:1.3rem;">${data.message || ' خلصتي كل المراحل كولي يا الله شبسرعه! أنتِ شاطره'}</p>
            <p>شكراً  ❤️</p>
        `;
        return;
    }
    
    currentStageId = data.stageId;
    currentSongUrl = data.songUrl;
    
    document.getElementById('stage-title').innerHTML = `🌟 المرحلة ${data.stageId}`;
    document.getElementById('stage-number').innerText = data.stageId;
    document.getElementById('puzzle-text').innerHTML = `📖 السؤال: ${data.puzzle}`;
    document.getElementById('hint-text').innerText = data.hint || "لا يوجد تلميح";
    
    const progressPercent = (data.stageId / 10) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;
    
    const prevBtn = document.getElementById('prev-stage-btn');
    const nextBtn = document.getElementById('next-stage-btn');
    prevBtn.disabled = (data.stageId <= 1);
    nextBtn.disabled = (data.stageId >= 10);
    prevBtn.onclick = () => changeStage(data.stageId - 1);
    nextBtn.onclick = () => changeStage(data.stageId + 1);
    
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').disabled = false;
    document.getElementById('submit-btn').disabled = false;
    if (messageTimeout) clearTimeout(messageTimeout);
    document.getElementById('message').innerHTML = '';
    
    startCountdown();
    setupMusic();
}

async function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    
    const res = await fetch('/api/next-stage-time');
    const data = await res.json();
    
    if (data.finished) {
        document.getElementById('countdown-container').style.display = 'none';
        return;
    }
    
    const countdownContainer = document.getElementById('countdown-container');
    countdownContainer.style.display = 'block';
    
    let remainingSeconds = data.remainingSeconds;
    
    function updateDisplay() {
        if (remainingSeconds <= 0) {
            clearInterval(countdownInterval);
            countdownContainer.style.display = 'none';
            loadStage();
            return;
        }
        
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;
        
        const timerElement = document.getElementById('countdown-timer');
        timerElement.innerHTML = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        remainingSeconds--;
    }
    
    updateDisplay();
    countdownInterval = setInterval(updateDisplay, 1000);
}

async function changeStage(targetStageId) {
    const res = await fetch(`/api/can-access-stage/${targetStageId}`);
    const data = await res.json();
    if (data.canAccess) {
        window.location.reload();
    } else {
        showMessage(`❌ المرحلة ${targetStageId} لم تفتح بعد!`, 'error');
    }
}

function setupMusic() {
    const playerDiv = document.getElementById('music-player');
    if (currentSongUrl && currentSongUrl.trim() !== '') {
        playerDiv.innerHTML = `
            <div class="music-controls">
                <div class="music-info">🎵 موسيقى المرحلة الحالية 🎵</div>
                <button id="stop-music-btn" class="stop-music-btn">⏸️ إيقاف</button>
            </div>
        `;
        
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer = null;
        }
        
        audioPlayer = new Audio();
        audioPlayer.src = currentSongUrl;
        audioPlayer.loop = true;
        audioPlayer.volume = 0.5;
        
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                playerDiv.innerHTML += `<div class="music-warning">⚠️ اضغط هنا لتشغيل الموسيقى</div>`;
                const warningDiv = playerDiv.querySelector('.music-warning');
                if (warningDiv) warningDiv.onclick = () => audioPlayer.play();
            });
        }
        
        document.getElementById('stop-music-btn').addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play();
                document.getElementById('stop-music-btn').innerHTML = '⏸️ إيقاف';
            } else {
                audioPlayer.pause();
                document.getElementById('stop-music-btn').innerHTML = '▶️ تشغيل';
            }
        });
    } else {
        playerDiv.innerHTML = '';
    }
}

async function submitAnswer() {
    const answer = document.getElementById('answer-input').value.trim();
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
            showMessage('✅ إجابة صحيحة! تهانينا.', 'success');
            setTimeout(() => loadStage(), 2000);
        } else {
            showMessage(`❌ ${data.message}`, 'error');
            document.getElementById('answer-input').value = '';
        }
    } catch (error) {
        showMessage('❌ حدث خطأ في الاتصال', 'error');
    }
}

function showMessage(msg, type) {
    const messageDiv = document.getElementById('message');
    if (messageTimeout) clearTimeout(messageTimeout);
    messageDiv.innerHTML = msg;
    messageDiv.style.color = (type === 'success') ? '#2ecc71' : '#e74c3c';
    messageTimeout = setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 5000);
}

document.getElementById('submit-btn').addEventListener('click', submitAnswer);
loadStage();

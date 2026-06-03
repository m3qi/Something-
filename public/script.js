* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: radial-gradient(ellipse at bottom, #0d1d31 0%, #0c0d13 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    position: relative;
    overflow-x: hidden;
}

/* خلفية نجوم بسيطة ومريحة */
.stars {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background: transparent;
    z-index: 0;
}

/* نجوم متلألئة بحجم صغير ولطيف */
.star {
    position: absolute;
    background-color: white;
    border-radius: 50%;
    opacity: 0;
    animation: twinkle 3s infinite ease-in-out;
}

@keyframes twinkle {
    0%, 100% { opacity: 0; transform: scale(0.5); }
    50% { opacity: 0.8; transform: scale(1); }
}

/* إزالة الخلفيات المزعجة القديمة */
.twinkling, .clouds {
    display: none;
}

/* الحاوية الرئيسية */
.container {
    background: rgba(15, 25, 45, 0.85);
    backdrop-filter: blur(10px);
    border-radius: 30px;
    padding: 20px;
    width: 100%;
    max-width: 700px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    z-index: 10;
    animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

.game-title {
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    background: linear-gradient(135deg, #ffd89b, #c7e9fb);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 0 20px rgba(255, 216, 155, 0.5);
    margin-bottom: 5px;
    animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
    from { text-shadow: 0 0 10px rgba(255, 216, 155, 0.3); }
    to { text-shadow: 0 0 25px rgba(255, 216, 155, 0.8); }
}

.subtitle {
    text-align: center;
    color: #a0c4ff;
    font-size: 0.8rem;
    margin-bottom: 20px;
}

.navigation-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.nav-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.nav-btn:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.6);
}

.nav-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

#stage-indicator {
    color: #ffd89b;
    font-weight: bold;
    background: rgba(0, 0, 0, 0.5);
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
}

#countdown-container {
    background: rgba(0, 0, 0, 0.6);
    border-radius: 15px;
    padding: 10px;
    margin-bottom: 20px;
    text-align: center;
    border: 1px solid #ffd89b;
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0% { border-color: #ffd89b; box-shadow: 0 0 5px #ffd89b; }
    100% { border-color: #c7e9fb; box-shadow: 0 0 15px #c7e9fb; }
}

.countdown-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
}

.countdown-label {
    color: #ffd89b;
    font-weight: bold;
}

#countdown-timer {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ff6b6b;
    text-shadow: 0 0 10px #ff6b6b;
    font-family: monospace;
}

.puzzle-card {
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 15px;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    animation: flipIn 0.6s ease-out;
}

@keyframes flipIn {
    from { transform: perspective(400px) rotateX(90deg); opacity: 0; }
    to { transform: perspective(400px) rotateX(0); opacity: 1; }
}

.puzzle-card:hover {
    transform: scale(1.02);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

#puzzle-text {
    font-size: 1.3rem;
    color: #e0e0e0;
    text-align: center;
}

#hint-box {
    background: rgba(118, 75, 162, 0.3);
    padding: 10px;
    border-radius: 10px;
    margin: 15px 0;
    border-right: 3px solid #ffd89b;
    transition: all 0.3s ease;
}

#hint-box:hover {
    background: rgba(118, 75, 162, 0.5);
    padding-right: 15px;
}

.hint-label {
    font-weight: bold;
    color: #ffd89b;
}

#hint-text {
    color: #c7e9fb;
}

.answer-section {
    display: flex;
    gap: 10px;
    margin: 20px 0;
}

#answer-input {
    flex: 1;
    padding: 12px;
    font-size: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid #667eea;
    border-radius: 10px;
    color: white;
    outline: none;
    transition: all 0.3s;
}

#answer-input:focus {
    border-color: #ffd89b;
    background: rgba(255, 255, 255, 0.2);
}

#submit-btn {
    background: linear-gradient(135deg, #f093fb, #f5576c);
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s;
}

#submit-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 20px rgba(245, 87, 108, 0.5);
}

#progress-bar-container {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    overflow: hidden;
    margin: 20px 0 10px;
}

#progress-bar {
    width: 0%;
    height: 100%;
    background: linear-gradient(90deg, #ffd89b, #c7e9fb);
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 10px;
    position: relative;
    overflow: hidden;
}

#progress-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    from { transform: translateX(-100%); }
    to { transform: translateX(100%); }
}

#message {
    text-align: center;
    margin-top: 15px;
    font-weight: bold;
    animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.music-controls {
    background: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}

.music-info {
    color: #ffd89b;
    font-size: 0.9rem;
}

.stop-music-btn {
    background: #ff6b6b;
    color: white;
    border: none;
    padding: 5px 15px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s;
}

.stop-music-btn:hover {
    background: #ff4757;
    transform: scale(1.05);
}

.music-warning {
    color: #ffd89b;
    font-size: 0.8rem;
    margin-top: 5px;
    cursor: pointer;
    text-decoration: underline;
}

.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
}

.modal-content {
    background: linear-gradient(135deg, #667eea, #764ba2);
    margin: 30% auto;
    padding: 30px;
    border-radius: 20px;
    text-align: center;
    width: 80%;
    max-width: 400px;
    color: white;
    font-size: 1.5rem;
}

.close {
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    color: white;
}

.close:hover {
    color: #ffd89b;
}

@media (max-width: 600px) {
    .container { padding: 15px; }
    .game-title { font-size: 1.5rem; }
    .navigation-buttons { flex-direction: column; }
    .nav-btn { width: 100%; text-align: center; }
    #puzzle-text { font-size: 1rem; }
    .answer-section { flex-direction: column; }
    #countdown-timer { font-size: 1.2rem; }
// إنشاء نجوم متلألئة جميلة
function createStars() {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer) return;
    
    starsContainer.innerHTML = '';
    const numberOfStars = 100;
    
    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        starsContainer.appendChild(star);
    }
}

// تشغيل النجوم عند تحميل الصفحة
createStars();
        }

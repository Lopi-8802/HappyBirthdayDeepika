const CORRECT_PASSCODE = "1013"; // Changed to your special code!
let currentInput = "";
let countdownInterval;
let poppedBalloons = 0;

// Asset Loading Isolation Fix
function loadScreenAssets(screenId) {
    const activeScreen = document.getElementById(screenId);
    if (!activeScreen) return;
    const images = activeScreen.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
    });
}

function nextScreen(currentId, nextId) {
    const currentScreen = document.getElementById(currentId);
    const nextScreen = document.getElementById(nextId);
    if (currentScreen && nextScreen) {
        currentScreen.classList.remove('active');
        loadScreenAssets(nextId);
        nextScreen.classList.add('active');
        
        // Context Trigger Switches
        if (nextId === 'screen-balloons') { setupBalloonGame(); }
        if (nextId === 'screen-letter') { startTypewriterMessage(); }
    }
}

// Passcode Actions
function pressKey(key) {
    const dots = document.querySelectorAll('.dot');
    if (key === 'C') { currentInput = ""; }
    else if (key === 'D') { currentInput = currentInput.slice(0, -1); }
    else if (currentInput.length < 4) { currentInput += key; }
    
    dots.forEach((dot, idx) => {
        if (idx < currentInput.length) dot.classList.add('filled');
        else dot.classList.remove('filled');
    });
    
    if (currentInput.length === 4) {
        if (currentInput === CORRECT_PASSCODE) {
            // Trigger background music playback safely upon validation
            const audio = document.getElementById('bg-music');
            if (audio) { audio.play().catch(e => console.log("Audio waiting for user gesture")); }

            const popup = document.getElementById('popup-notification');
            popup.classList.add('show');
            setTimeout(() => {
                popup.classList.remove('show');
                nextScreen('screen-lock', 'screen-countdown');
                startCountdownTimer();
            }, 2000);
        } else {
            setTimeout(() => {
                currentInput = "";
                dots.forEach(d => d.classList.remove('filled'));
                nextScreen('screen-lock', 'screen-wrong-passcode');
            }, 250);
        }
    }
}

function startCountdownTimer() {
    const targetDate = new Date().getTime() + 5000; // 5 seconds for visual testing
    const unlockBtn = document.getElementById('unlock-btn');
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const diff = targetDate - now;
        if (diff <= 0) {
            clearInterval(countdownInterval);
            unlockBtn.classList.remove('disabled');
            unlockBtn.removeAttribute('disabled');
            return;
        }
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        document.getElementById('seconds').textContent = String(s).padStart(2, '0');
    }, 1000);
}

// Balloon Mini Game Logic
function setupBalloonGame() {
    poppedBalloons = 0;
    document.getElementById('pop-count').textContent = "3";
    const area = document.getElementById('balloon-area');
    area.innerHTML = "";
    
    const colors = ['#f472b6', '#c084fc', '#fbcfe8', '#a78bfa'];
    for (let i = 0; i < 3; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'game-balloon';
        balloon.style.left = (20 + i * 90) + 'px';
        balloon.style.backgroundColor = colors[i % colors.length];
        balloon.style.animationDelay = (i * 0.5) + 's';
        
        balloon.onclick = function() {
            balloon.style.display = 'none';
            poppedBalloons++;
            document.getElementById('pop-count').textContent = String(3 - poppedBalloons);
            if (poppedBalloons >= 3) {
                const btn = document.getElementById('balloon-next-btn');
                btn.classList.remove('disabled');
                btn.removeAttribute('disabled');
            }
        };
        area.appendChild(balloon);
    }
}

// Candle Game Logic
function blowCandle() {
    const flame = document.getElementById('candle-flame');
    if (flame) {
        flame.style.display = 'none';
        const nextBtn = document.getElementById('candle-next-btn');
        nextBtn.classList.remove('disabled');
        nextBtn.removeAttribute('disabled');
    }
}

function startTypewriterMessage() {
    const birthdayMessage = `Dear Divya,\n\nHappy Birthday to someone incredibly special! 🎂🎈\n\nYou are sweet, loving, and my true rock. I am so lucky and grateful to have you in my life. Every single moment spent with you is pure magic.\n\nOn your special day, I wish you all the joy, love, and infinite happiness that you deserve. Here is to celebrating you today and forever!\n\nWith all my love,\nYour Best Friend ❤️`;
    const container = document.getElementById('typewriter-text');
    container.textContent = ""; 
    let index = 0;
    
    const typingInterval = setInterval(() => {
        if (index < birthdayMessage.length) {
            container.textContent += birthdayMessage.charAt(index);
            index++;
            document.querySelector('.letter-box').scrollTop = document.querySelector('.letter-box').scrollHeight;
        } else {
            clearInterval(typingInterval);
            document.getElementById('letter-next-btn').style.display = 'inline-block';
        }
    }, 35);
}

// Replay Feature Engine
function replaySurprise() {
    // Reset structural state parameters
    currentInput = "";
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('filled'));
    document.getElementById('candle-flame').style.display = 'block';
    document.getElementById('candle-next-btn').classList.add('disabled');
    document.getElementById('candle-next-btn').setAttribute('disabled', 'true');
    document.getElementById('balloon-next-btn').classList.add('disabled');
    document.getElementById('balloon-next-btn').setAttribute('disabled', 'true');
    document.getElementById('letter-next-btn').style.display = 'none';
    
    // Jump straight back to welcome screen so she doesn't have to enter the code again!
    nextScreen('screen-final', 'screen-welcome');
}

function generateFallingHearts() {
    const container = document.getElementById('phone-app');
    setInterval(() => {
        if (document.hidden) return;
        const heart = document.createElement('div');
        heart.className = 'clear-heart';
        heart.style.left = Math.random() * 340 + 'px';
        const size = Math.random() * 12 + 8;
        heart.style.width = size + 'px'; heart.style.height = size + 'px';
        heart.style.animationDuration = Math.random() * 3 + 4 + 's';
        container.appendChild(heart);
        heart.addEventListener('animationend', () => heart.remove());
    }, 450);
}

function createHeartBurst(e) {
    const activeScreen = document.querySelector('.screen.active');
    if (!activeScreen || activeScreen.id === 'screen-countdown') return;
    const posX = e.clientX || (e.touches && e.touches[0].clientX);
    const posY = e.clientY || (e.touches && e.touches[0].clientY);
    if (!posX || !posY) return;

    const container = document.getElementById('phone-app');
    const rect = container.getBoundingClientRect();
    const relativeX = posX - rect.left;
    const relativeY = posY - rect.top;

    for (let i = 0; i < 4; i++) {
        const heart = document.createElement('div');
        heart.className = 'clear-heart burst-heart';
        heart.style.left = (relativeX - 8) + 'px'; heart.style.top = (relativeY - 8) + 'px';
        const size = Math.floor(Math.random() * 6) + 10;
        heart.style.width = size + 'px'; heart.style.height = size + 'px';

        const angle = (i * 90) + (Math.random() * 25);
        const distance = Math.floor(Math.random() * 30) + 25;
        const moveX = Math.cos(angle * Math.PI / 180) * distance;
        const moveY = Math.sin(angle * Math.PI / 180) * distance - 30;

        const uniqueAnim = `burst-${Math.random().toString(36).substr(2, 9)}`;
        const styleSheet = document.styleSheets[0];
        styleSheet.insertRule(`@keyframes ${uniqueAnim} { 0% { transform: translate3d(0,0,0) rotate(-45deg) scale(0.4); opacity:0; } 20% { opacity:0.9; } 100% { transform: translate3d(${moveX}px,${moveY}px,0) rotate(${Math.random()*120}deg) scale(1); opacity:0; } }`, styleSheet.cssRules.length);

        heart.style.animation = `${uniqueAnim} 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
        container.appendChild(heart);
        heart.addEventListener('animationend', () => heart.remove());
    }
}

window.addEventListener('DOMContentLoaded', () => {
    generateFallingHearts();
    const appContainer = document.getElementById('phone-app');
    appContainer.addEventListener('click', createHeartBurst);
    appContainer.addEventListener('touchstart', createHeartBurst, { passive: true });
});
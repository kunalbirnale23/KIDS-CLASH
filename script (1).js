// EduTug: Math Tug of War - COMPLETE FIXED VERSION
let gameTime = 60;
let timerInterval;
let isLocked = { left: false, right: false };
let gameStats = {
    left: { correct: 0, wrong: 0 },
    right: { correct: 0, wrong: 0 }
};
let currentMode = '+';
let ropePosition = 0;
const stepSize = 10;
let scoreLeft = 0;
let scoreRight = 0;
let currentAnswers = { left: 0, right: 0 };

// === 1. INITIALIZE GAME ===
function initGame() {
    ropePosition = 0;
    scoreLeft = 0;
    scoreRight = 0;
    gameTime = 60;
    isLocked = { left: false, right: false };
    gameStats = { left: { correct: 0, wrong: 0 }, right: { correct: 0, wrong: 0 } };

    const timerBox = document.getElementById('timer-box');
    timerBox.innerText = gameTime;
    timerBox.style.backgroundColor = "#4CAF50";
    timerBox.style.color = "#fff";

    clearInterval(timerInterval);
    
    document.getElementById('question-left').innerText = "Get Ready!";
    document.getElementById('question-right').innerText = "Get Ready!";
    document.getElementById('options-left').innerHTML = '';
    document.getElementById('options-right').innerHTML = '';
    updateUI();
    startCountdown();
}

// === 2. COUNTDOWN ===
function startCountdown() {
    const overlay = document.getElementById('countdown-overlay');
    const countdownText = document.getElementById('countdown-text');
    overlay.style.display = 'flex';
    let count = 3;
    countdownText.innerText = count;
    countdownText.style.color = "#fff";

    let preTimer = setInterval(() => {
        count--;
        if (count > 0) {
            countdownText.innerText = count;
        } else if (count === 0) {
            countdownText.innerText = "GO!";
            countdownText.style.color = "#4CAF50";
        } else {
            clearInterval(preTimer);
            overlay.style.display = 'none';
            generateQuestionForSide('left');
            generateQuestionForSide('right');
            timerInterval = setInterval(updateGameClock, 1000);
        }
    }, 1000);
}

// === 3. COLORED TIMER ===
function updateGameClock() {
    gameTime--;
    const timerBox = document.getElementById('timer-box');
    timerBox.innerText = gameTime;

    if (gameTime > 30) {
        timerBox.style.backgroundColor = "#4CAF50"; // Green
        timerBox.style.color = "#fff";
    } else if (gameTime > 10) {
        timerBox.style.backgroundColor = "#FFC107"; // Yellow
        timerBox.style.color = "#333";
    } else {
        timerBox.style.backgroundColor = "#f44336"; // Red
        timerBox.style.color = "#fff";
    }

    if (gameTime <= 0) {
        clearInterval(timerInterval);
        determineWinnerByScore();
    }
}

// === 4. SMART QUESTION GENERATOR ===
function generateQuestionForSide(side) {
    let correctAnswer, questionText;
    let modeToUse = currentMode;
    let options = [];

    if (modeToUse === 'mix') {
        const ops = ['+', '-', '*'];
        modeToUse = ops[Math.floor(Math.random() * ops.length)];
    }

    // ENGLISH MODE
    // --- THE ULTIMATE ENGLISH ENGINE ---
    if (modeToUse === 'english') {
        // 1. Define the 6 different types of questions
        const questionTypes = ['synonym', 'antonym', 'missingLetter', 'wordPair', 'plural', 'vowels'];
        const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)]; // Pick a random type!

        let qData; // This will hold the specific question and answers

        // 2. Load the data based on the question type
        if (qType === 'synonym') {
            const list = [
                { q: 'Synonym for\n"Happy"', a: 'Joyful', w: ['Sad', 'Angry', 'Bored'] },
                { q: 'Synonym for\n"Fast"', a: 'Quick', w: ['Slow', 'Lazy', 'Heavy'] },
                { q: 'Synonym for\n"Smart"', a: 'Clever', w: ['Dumb', 'Slow', 'Weak'] }
            ];
            qData = list[Math.floor(Math.random() * list.length)];
        } 
        else if (qType === 'antonym') {
            const list = [
                { q: 'Opposite of\n"Hot"', a: 'Cold', w: ['Warm', 'Boiling', 'Sunny'] },
                { q: 'Opposite of\n"Tall"', a: 'Short', w: ['High', 'Giant', 'Big'] },
                { q: 'Opposite of\n"Day"', a: 'Night', w: ['Morning', 'Sun', 'Light'] }
            ];
            qData = list[Math.floor(Math.random() * list.length)];
        }
        else if (qType === 'missingLetter') {
            const list = [
                { q: 'Fill the blank:\nA _ P L E', a: 'P', w: ['B', 'M', 'T'] },
                { q: 'Fill the blank:\nB A N A N _', a: 'A', w: ['E', 'O', 'U'] },
                { q: 'Fill the blank:\nS C H O _ L', a: 'O', w: ['A', 'U', 'E'] },
                { q: 'Fill the blank:\nT I G E _', a: 'R', w: ['L', 'N', 'M'] }
            ];
            qData = list[Math.floor(Math.random() * list.length)];
        }
        else if (qType === 'wordPair') {
            const list = [
                { q: 'Match the pair:\nSalt & ___', a: 'Pepper', w: ['Sugar', 'Water', 'Bread'] },
                { q: 'Match the pair:\nShoes & ___', a: 'Socks', w: ['Hats', 'Gloves', 'Shirts'] },
                { q: 'Match the pair:\nBread & ___', a: 'Butter', w: ['Juice', 'Meat', 'Apple'] }
            ];
            qData = list[Math.floor(Math.random() * list.length)];
        }
        else if (qType === 'plural') {
            const list = [
                { q: 'Plural of\n"Mouse"', a: 'Mice', w: ['Mouses', 'Meese', 'Mouse'] },
                { q: 'Plural of\n"Child"', a: 'Children', w: ['Childs', 'Childes', 'Chil'] },
                { q: 'Plural of\n"Goose"', a: 'Geese', w: ['Gooses', 'Geeses', 'Goose'] }
            ];
            qData = list[Math.floor(Math.random() * list.length)];
        }
        else if (qType === 'vowels') {
            const list = [
                { q: 'How many vowels\nin "APPLE"?', a: '2', w: ['1', '3', '4'] },
                { q: 'How many vowels\nin "CAT"?', a: '1', w: ['0', '2', '3'] },
                { q: 'How many vowels\nin "HOUSE"?', a: '3', w: ['2', '4', '5'] }
            ];
            qData = list[Math.floor(Math.random() * list.length)];
        }

        // 3. Assign the chosen data to the game variables
        questionText = qData.q;
        correctAnswer = qData.a;
        
        options.push(correctAnswer);
        
        // 4. Shuffle the 3 wrong answers and add them to the buttons
        let shuffledWrong = qData.w.sort(() => 0.5 - Math.random());
        options.push(shuffledWrong[0], shuffledWrong[1], shuffledWrong[2]);
    } 
    // MATH MODE
    else {
        let a, b;
        if (modeToUse === '+') {
            a = Math.floor(Math.random() * 15) + 1;
            b = Math.floor(Math.random() * 15) + 1;
            correctAnswer = a + b;
            questionText = `${a} + ${b} = ?`;
        } else if (modeToUse === '-') {
            a = Math.floor(Math.random() * 20) + 5;
            b = Math.floor(Math.random() * a) + 1;
            correctAnswer = a - b;
            questionText = `${a} - ${b} = ?`;
        } else if (modeToUse === '*') {
            a = Math.floor(Math.random() * 10) + 1;
            b = Math.floor(Math.random() * 10) + 1;
            correctAnswer = a * b;
            questionText = `${a} × ${b} = ?`;
        }

        options = [correctAnswer];
        while (options.length < 4) {
            let offset = Math.floor(Math.random() * 11) - 5;
            let wrongAnswer = correctAnswer + offset;
            if (wrongAnswer !== correctAnswer && !options.includes(wrongAnswer) && wrongAnswer >= 0) {
                options.push(wrongAnswer);
            }
        }
    }

    document.getElementById(`question-${side}`).innerText = questionText;
    currentAnswers[side] = correctAnswer;
    options.sort(() => Math.random() - 0.5);

    const optionsContainer = document.getElementById(`options-${side}`);
    optionsContainer.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => handleTap(side, opt);
        optionsContainer.appendChild(btn);
    });
}

// === 5. FIXED HANDLE TAP - NO MORE BUGS! ===
function handleTap(side, tappedAnswer) {
    if (gameTime <= 0 || isLocked[side]) return;

    let isCorrect = (tappedAnswer === currentAnswers[side]);
    const teamPanel = document.querySelector(`.${side}-team`);

    if (isCorrect) {
        // ✅ PERFECTLY FIXED - BOTH TEAMS WORK CORRECTLY
        playSound('sfx-correct');
        gameStats[side].correct++;  // CORRECT for BOTH left AND right!
        teamPanel.classList.add('correct-glow');
        
        if (side === 'left') {
            ropePosition -= stepSize;
            scoreLeft++;
            triggerPullAnimation('left');
        } else {
            ropePosition += stepSize;
            scoreRight++;
            triggerPullAnimation('right');
        }

        ropePosition = Math.max(-45, Math.min(45, ropePosition));
        updateUI();

        setTimeout(() => {
            teamPanel.classList.remove('correct-glow');
            if (gameTime > 0) generateQuestionForSide(side);
        }, 400);

    } else {
        playSound('sfx-wrong');
        gameStats[side].wrong++;  // WRONG counter ONLY
        teamPanel.classList.add('wrong-glow');
        isLocked[side] = true;

        setTimeout(() => {
            teamPanel.classList.remove('wrong-glow');
            isLocked[side] = false;
        }, 1000);
    }
}

// === 6. AUDIO HELPER ===
function playSound(id) {
    try {
        const audio = document.getElementById(id);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log("Audio play failed:", e));
        }
    } catch(e) {}
}

// === 7. UPDATE VISUALS ===
function updateUI() {
    document.getElementById('score-left').innerText = scoreLeft;
    document.getElementById('score-right').innerText = scoreRight;
    const ropeContainer = document.getElementById('rope-container');
    if (ropeContainer) {
        ropeContainer.style.left = ropePosition + '%';
    }
    const marker = document.getElementById('rope-marker');
    if (marker) marker.style.left = (50 + ropePosition) + '%';
}

// === 8. WINNER DETERMINATION ===
function determineWinnerByScore() {
    let message;
    if (scoreLeft > scoreRight) {
        message = "🎉 Congratulations..!<br>🔵 TEAM 1 WINS! 🎉";
    } else if (scoreRight > scoreLeft) {
        message = "🎉 Congratulations..!<br>🔴 TEAM 2 WINS! 🎉";
    } else {
        message = "🤝 IT'S A TIE! 🤝<br>Both teams are equal!";
    }
    triggerVictory(message);
}

// === 9. VICTORY SCREEN WITH STATS ===
function triggerVictory(message) {
    playSound('sfx-win');
    const winnerText = document.getElementById('winner-text');
    if (winnerText) winnerText.innerHTML = message;

    // ✅ PERFECT ACCURACY CALCULATION - WORKS FOR BOTH TEAMS
    let totalLeft = gameStats.left.correct + gameStats.left.wrong;
    let accLeft = totalLeft > 0 ? Math.round((gameStats.left.correct / totalLeft) * 100) : 0;
    let totalRight = gameStats.right.correct + gameStats.right.wrong;
    let accRight = totalRight > 0 ? Math.round((gameStats.right.correct / totalRight) * 100) : 0;

    // Update stats
    ['stat-l-correct', 'stat-l-wrong', 'stat-l-acc', 'stat-r-correct', 'stat-r-wrong', 'stat-r-acc'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (id === 'stat-l-acc') el.innerText = accLeft + '%';
            else if (id === 'stat-r-acc') el.innerText = accRight + '%';
            else if (id === 'stat-l-correct') el.innerText = gameStats.left.correct;
            else if (id === 'stat-l-wrong') el.innerText = gameStats.left.wrong;
            else if (id === 'stat-r-correct') el.innerText = gameStats.right.correct;
            else if (id === 'stat-r-wrong') el.innerText = gameStats.right.wrong;
        }
    });

    document.getElementById('winner-overlay').style.display = 'flex';
    document.getElementById('game-container').style.display = 'none';

    // CONFETTI!
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 200,
            spread: 160,
            origin: { y: 0.6 },
            colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24']
        });
    }
}

// === 10. RESTART GAME ===
function closeAnalyticsAndRestart() {
    document.getElementById('winner-overlay').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';
    initGame();
}

// === 11. NEW: MAIN MENU BUTTON ===
function showMainMenu() {
    // Hide winner overlay
    document.getElementById('winner-overlay').style.display = 'none';
    
    // Reset all game state
    ropePosition = 0;
    scoreLeft = 0;
    scoreRight = 0;
    gameTime = 60;
    gameStats = { left: { correct: 0, wrong: 0 }, right: { correct: 0, wrong: 0 } };
    isLocked = { left: false, right: false };
    clearInterval(timerInterval);
    
    // Show main menu, hide everything else
    document.getElementById('subject-menu').style.display = 'flex';
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('math-menu').style.display = 'none';
    
    // Reset UI elements
    const timerBox = document.getElementById('timer-box');
    if (timerBox) {
        timerBox.innerText = '60';
        timerBox.style.backgroundColor = "#4CAF50";
        timerBox.style.color = "#fff";
    }
}

// === 12. CHARACTER ANIMATIONS ===
function triggerPullAnimation(side) {
    const char1 = document.querySelector(`.${side}-char-1`);
    const char2 = document.querySelector(`.${side}-char-2`);
    if (char1) char1.classList.add('is-pulling');
    if (char2) char2.classList.add('is-pulling');
    setTimeout(() => {
        if (char1) char1.classList.remove('is-pulling');
        if (char2) char2.classList.remove('is-pulling');
    }, 400);
}

// === 13. MENU FUNCTIONS ===
function showMathMenu() {
    document.getElementById('subject-menu').style.display = 'none';
    document.getElementById('math-menu').style.display = 'flex';
    document.getElementById('game-container').style.display = 'none';
}

function goBackToSubjects() {
    document.getElementById('math-menu').style.display = 'none';
    document.getElementById('subject-menu').style.display = 'flex';
}

function startGameFromMenu(selectedMode) {
    currentMode = selectedMode;
    document.getElementById('subject-menu').style.display = 'none';
    document.getElementById('math-menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';
    playSound('sfx-correct'); // Unlock audio
    initGame();
}

// === 14. PAGE LOAD ===
window.addEventListener('load', function() {
    // Hide game container initially
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('math-menu').style.display = 'none';
    document.getElementById('winner-overlay').style.display = 'none';
    updateUI();
});

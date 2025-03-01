document.getElementById('startBtn').addEventListener('click', startGame);

let gameBoard, restartBtn, scoreDisplay;
let flippedCards = [];
let attempts = 0;
let colors = []; // Variável importante que estava faltando

function startGame() {
    const startBtn = document.getElementById('startBtn');
    startBtn.parentNode.removeChild(startBtn);

    // Cria elementos na ordem correta
    createGameBoard();
    createScoreDisplay();
    createRestartButton();
    
    resetGame();
}

function createGameBoard() {
    gameBoard = document.createElement('div');
    gameBoard.id = 'gameBoard';
    gameBoard.className = 'game-board';
    gameBoard.style.display = 'grid'; // Adicionado display grid
    document.body.appendChild(gameBoard);
}

function createRestartButton() {
    restartBtn = document.createElement('button');
    restartBtn.className = 'magic-button restart-btn';
    restartBtn.textContent = 'Jogar Novamente 🔄';
    restartBtn.style.display = 'none'; // Escondido inicialmente
    restartBtn.addEventListener('click', resetGame);
    document.body.appendChild(restartBtn);
}

function createScoreDisplay() {
    scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    document.body.appendChild(scoreDisplay);
}

function updateScore() {
    scoreDisplay.textContent = `Tentativas: ${attempts}`;
}

function generateColors() {
    const baseColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeead', '#ffd93d'];
    colors = [...baseColors, ...baseColors].sort(() => Math.random() - 0.5); // Armazena globalmente
}

function createCards() {
    gameBoard.innerHTML = '';
    
    colors.forEach(color => {
        const card = document.createElement('div');
        card.className = 'card';
        
        const back = document.createElement('div');
        back.className = 'card-face back';
        
        const front = document.createElement('div');
        front.className = 'card-face front';
        front.style.backgroundColor = color;
        
        card.appendChild(back);
        card.appendChild(front);
        card.addEventListener('click', () => flipCard(card, color));
        gameBoard.appendChild(card);
    });
}

function flipCard(card, color) {
    if (!card.classList.contains('flipped') && flippedCards.length < 2) {
        card.classList.add('flipped');
        flippedCards.push({ card, color });
        
        if (flippedCards.length === 2) {
            attempts++;
            updateScore();
            checkMatch();
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.color === card2.color) {
        flippedCards = [];
        
        if (document.querySelectorAll('.flipped').length === colors.length) {
            showVictory();
            restartBtn.style.display = 'block';
        }
    } else {
        setTimeout(() => {
            card1.card.classList.remove('flipped');
            card2.card.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function showVictory() {
    const victoryText = document.createElement('div');
    victoryText.className = 'victory-effect';
    victoryText.textContent = 'VITÓRIA!';
    document.body.appendChild(victoryText);
    
    victoryText.style.display = 'block';
    setTimeout(() => victoryText.remove(), 1000);
}

function resetGame() {
    flippedCards = [];
    attempts = 0;
    restartBtn.style.display = 'none';
    generateColors();
    createCards();
    updateScore();
    document.querySelectorAll('.victory-effect').forEach(el => el.remove());
}
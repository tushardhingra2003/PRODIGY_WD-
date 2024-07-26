const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const resetBtn = document.getElementById('resetBtn');
const toggleModeBtn = document.getElementById('toggleModeBtn');
const message = document.getElementById('message');
const turnDisplay = document.getElementById('turn');

let currentPlayer = 'X';
let gameState = Array(9).fill('');
let gameActive = true;
let playAgainstAI = false;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

function handleClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (gameState[index] === '' && gameActive) {
        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer); // Add class for color

        if (checkWinner()) {
            message.textContent = `${currentPlayer} wins!`;
            gameActive = false;
            turnDisplay.textContent = '';
        } else if (!gameState.includes('')) {
            message.textContent = "It's a draw!";
            gameActive = false;
            turnDisplay.textContent = '';
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (playAgainstAI && currentPlayer === 'O') {
                turnDisplay.textContent = 'AI is thinking...';
                setTimeout(aiMove, 500); // Adding a small delay for better UX
            } else {
                turnDisplay.textContent = `${currentPlayer}'s turn`;
            }
        }
    }
}

function checkWinner() {
    return winningConditions.some(condition => {
        return condition.every(index => {
            return gameState[index] === currentPlayer;
        });
    });
}

function resetGame() {
    gameState = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O'); // Remove classes for color
    });
    message.textContent = '';
    turnDisplay.textContent = `${currentPlayer}'s turn`;
}

function aiMove() {
    let bestMove;
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
        if (gameState[i] === '') {
            gameState[i] = 'O';
            let score = minimax(gameState, 0, false);
            gameState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    gameState[bestMove] = 'O';
    cells[bestMove].textContent = 'O';
    cells[bestMove].classList.add('O'); // Add class for color
    if (checkWinner()) {
        message.textContent = 'O wins!';
        gameActive = false;
        turnDisplay.textContent = '';
    } else if (!gameState.includes('')) {
        message.textContent = "It's a draw!";
        gameActive = false;
        turnDisplay.textContent = '';
    } else {
        currentPlayer = 'X';
        turnDisplay.textContent = `${currentPlayer}'s turn`;
    }
}

const scores = {
    'X': -10,
    'O': 10,
    'draw': 0
};

function minimax(board, depth, isMaximizing) {
    if (checkWinner()) {
        return scores[currentPlayer];
    }
    if (!board.includes('')) {
        return scores['draw'];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0;  i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function toggleMode() {
    playAgainstAI = !playAgainstAI;
    resetGame();
    toggleModeBtn.textContent = playAgainstAI ? 'Play Against Human' : 'Play Against AI';
}

cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});

resetBtn.addEventListener('click', resetGame);
toggleModeBtn.addEventListener('click', toggleMode);

// Initialize the turn display
turnDisplay.textContent = `${currentPlayer}'s turn`;


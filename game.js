// Estado do jogo
const mazeSize = 10;
let maze = [];
let playerPos = { x: 1, y: 1 };
let exitPos = { x: 8, y: 8 };
let rules = [];

// Inicializa o labirinto
function initMaze() {
    maze = Array(mazeSize).fill().map(() => Array(mazeSize).fill('path'));
    
    // Define paredes fixas
    for (let i = 0; i < mazeSize; i++) {
        maze[0][i] = 'wall';
        maze[mazeSize - 1][i] = 'wall';
        maze[i][0] = 'wall';
        maze[i][mazeSize - 1] = 'wall';
    }
    
    // Adiciona alguns blocos coloridos
    maze[2][2] = 'blue';
    maze[2][3] = 'red';
    maze[5][5] = 'blue';
    maze[7][3] = 'red';
    
    // Posição do jogador e saída
    maze[playerPos.y][playerPos.x] = 'player';
    maze[exitPos.y][exitPos.x] = 'exit';
    
    renderMaze();
}

// Renderiza o labirinto
function renderMaze() {
    const mazeElement = document.getElementById('maze');
    mazeElement.innerHTML = '';
    
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            const cell = document.createElement('div');
            cell.className = `cell ${maze[y][x]}`;
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            if (maze[y][x] === 'player') cell.textContent = 'P';
            else if (maze[y][x] === 'exit') cell.textContent = 'S';
            
            mazeElement.appendChild(cell);
        }
    }
}

// Adiciona uma nova regra
function addRule() {
    const conditionColor = document.getElementById('condition-color').value;
    const actionColor = document.getElementById('action-color').value;
    const resultState = document.getElementById('result-state').value;
    
    const rule = {
        condition: conditionColor,
        action: actionColor,
        result: resultState
    };
    
    rules.push(rule);
    updateRulesList();
}

// Atualiza a lista de regras na tela
function updateRulesList() {
    const rulesList = document.getElementById('rules-list');
    rulesList.innerHTML = '<h4>Regras Ativas:</h4>';
    
    if (rules.length === 0) {
        rulesList.innerHTML += '<p>Nenhuma regra definida.</p>';
        return;
    }
    
    rules.forEach((rule, index) => {
        const ruleText = `Se tocar em <strong>${rule.condition}</strong>, então <strong>${rule.action}</strong> vira <strong>${rule.result}</strong>`;
        const ruleElement = document.createElement('div');
        ruleElement.innerHTML = ruleText + ` <button onclick="removeRule(${index})">Remover</button>`;
        rulesList.appendChild(ruleElement);
    });
}

// Remove uma regra
function removeRule(index) {
    rules.splice(index, 1);
    updateRulesList();
}

// Verifica e aplica as regras quando o jogador se move
function checkRules() {
    rules.forEach(rule => {
        // Verifica se o jogador está em uma célula que ativa a regra
        if (maze[playerPos.y][playerPos.x] === rule.condition) {
            // Aplica a regra em todo o labirinto
            for (let y = 0; y < mazeSize; y++) {
                for (let x = 0; x < mazeSize; x++) {
                    if (maze[y][x] === rule.action) {
                        maze[y][x] = rule.result;
                    }
                }
            }
            renderMaze();
            document.getElementById('message').textContent = `Regra ativada: ${rule.action} → ${rule.result}`;
        }
    });
}

// Move o jogador
function movePlayer(direction) {
    const newPos = { ...playerPos };
    
    switch (direction) {
        case 'up': newPos.y--; break;
        case 'down': newPos.y++; break;
        case 'left': newPos.x--; break;
        case 'right': newPos.x++; break;
    }
    
    // Verifica se a nova posição é válida (não é parede)
    if (maze[newPos.y][newPos.x] !== 'wall') {
        maze[playerPos.y][playerPos.x] = 'path';
        playerPos = newPos;
        
        // Verifica se o jogador chegou à saída
        if (playerPos.x === exitPos.x && playerPos.y === exitPos.y) {
            document.getElementById('message').textContent = '🎉 Parabéns! Você escapou do labirinto!';
        }
        
        maze[playerPos.y][playerPos.x] = 'player';
        checkRules();
        renderMaze();
    } else {
        document.getElementById('message').textContent = '⚠️ Não pode atravessar paredes!';
    }
}

// Reinicia o jogo
function resetGame() {
    rules = [];
    updateRulesList();
    initMaze();
    document.getElementById('message').textContent = '';
}

// Inicializa o jogo
initMaze();
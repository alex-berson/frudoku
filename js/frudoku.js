let board, clues;
let fruits = ['avocado','banana','blueberries','cherries','coconut','grapes','green-apple','kiwi','lemon','mango','melon','peach','pear','pineapple','red-apple','strawberry','tangerine','watermelon'];

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => {
                console.log('Service worker registered!', reg);
            })
            .catch(err => {
                console.log('Service worker registration failed: ', err);
            });
    });
}

const initBoard = () => {

    board = [[0,0,0,0,0,0],
             [0,0,0,0,0,0],
             [0,0,0,0,0,0],
             [0,0,0,0,0,0],
             [0,0,0,0,0,0],
             [0,0,0,0,0,0]];    
}

const showBoard = () => document.body.style.opacity = 1;

const touchScreen = () => matchMedia('(hover: none)').matches;

const preloadImages = () => {

    fruits.forEach(fruit => {

        let img = new Image();

        img.src = `images/fruits/${fruit}.svg`;
    });
}

const shuffle = (array) => {

    for (let i = array.length - 1; i > 0; i--) {

        let j = Math.trunc(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]]; 
    }

    return array;
}

const setBoardSize = () => {

    let minSide = screen.height > screen.width ? screen.width : window.innerHeight;
    let cssBoardSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size'));
    let boardSize = Math.ceil(minSide * cssBoardSize / 6) * 6;

    document.documentElement.style.setProperty('--board-size', boardSize + 'px');
}

const setClues = () => {

    clues = shuffle(fruits).slice(0, 6);

    document.querySelectorAll('.selection .fruit').forEach((fruit, i) => {
        fruit.src = `images/fruits/${clues[i]}.svg`;
    });
}

const puzzleSolved = (board) => {

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            if (board[row][col] == 0) return false;
        }
    }

    return true;
}

const validFruit = (board, row, col, val) => {

    let boxRow = Math.trunc(row / 2) * 2;
    let boxCol = Math.trunc(col / 3) * 3;

    for (let i = 0; i < 6; i++) {

        if (board[row][i] == val || board[i][col] == val) return false;

        let currentRow = boxRow + Math.trunc(i / 3);
        let currentCol = boxCol + i % 3;

        if (board[currentRow][currentCol] == val) return false;
    }

    return true;
}

const checkRegs = (board) => {

    for (let reg = 0; reg < 6; reg++) {
        valLoop: for (let val = 1; val <= 6; val++) {

            let r, c; 
            let boxRow = Math.trunc(reg / 2) * 2;
            let boxCol = reg % 2 * 3;

            for (let cell = 0; cell < 6; cell++) {

                let row = boxRow + Math.trunc(cell / 3);
                let col = boxCol + cell % 3;

                if (board[row][col] != 0 || !validFruit(board, row, col, val)) continue;

                if (r != undefined) continue valLoop;

                [r, c] = [row, col];
            }

            if (r != undefined) return [r, c, val];
        }
    }

    return [null, null, null];
}

const findFruit = (board) => {

    let row, col, val;

    [row, col, val, num] = checkRegs(board);

    if (row != null) return [row, col, val];

    return [null, null, null];
}

const countFilled = (board) => {

    let n = 0;

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            if (board[row][col] != 0) n++;
        }
    }

    return n;
}

const puzzleSolvable = (board) => {

    let tempBoard = board.map(arr => arr.slice());

    do {

        let [row, col, val] = findFruit(tempBoard);

        if (row == null) return false;

        tempBoard[row][col] = val;

    } while (!puzzleSolved(tempBoard));

    return true;
}

const generatePuzzle = () => {

    let tempBoard = [];

    do {

        let cells = Array.from({length: 36}, (_, i) => i);
        let clues = [1,1,2,2,3,3,4,4,5,5,6,6];
        tempBoard = board.map(arr => arr.slice());

        shuffle(cells);

        for (let clue of clues) {
            for (let cell of cells) {

                let [row, col] = [Math.trunc(cell / 6), cell % 6];

                if (tempBoard[row][col] != 0) continue;

                if (validFruit(tempBoard, row, col, clue)) {
                    tempBoard[row][col] = clue;
                    break;
                }
            }
        }

    } while (!puzzleSolvable(tempBoard) || countFilled(tempBoard) != 12);

    board = tempBoard;
}

const saveSolution = () => {

    let tempBoard = board.map(arr => arr.slice());

    do {

        let [row, col, val] = findFruit(tempBoard);

        if (row == null) return false;

        tempBoard[row][col] = val;

    } while (!puzzleSolved(tempBoard));

    let cells = document.querySelectorAll('.cell');

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            cells[row * 6 + col].dataset.val = tempBoard[row][col];
        }
    }
}

const fillBoard = () => {

    let board1D = board.flat();
    let cells = document.querySelectorAll('.cell')
    
    for (let cell of cells) {

        let val = board1D.shift();

        if (!val) continue;

        cell.firstChild.src = `images/fruits/${clues[val - 1]}.svg`;
        cell.classList.add('clue', 'filled');
    }
}

const cellCoords = (touchedCell) => {

    let cells = document.querySelectorAll('.cell');

    for (let [i, cell] of cells.entries()) {
        if (cell == touchedCell) return [Math.trunc(i / 6), i % 6];
    }
}

const selectCell = (e) => {

    let cell = e.currentTarget;
    let cells = document.querySelectorAll('.cell');

    for (let cell of cells) {
                    
        let img = cell.firstChild;

        if (!img.classList.contains('incorrect')) continue;
            
        img.style.animationDuration = '0.0s';

        break;
    }

    document.querySelector('.selection').classList.remove('display');

    if (cell.classList.contains('gray')) {
        cell.classList.remove('gray');
        return;
    } 

    cells.forEach(cell => cell.classList.remove('gray'));

    if (cell.classList.contains('filled')) return;

    cell.classList.add('gray');
    
    setTimeout(() => {
        document.querySelector('.selection').classList.add('display');   
    }, 0);
}

const selectFruit = (e) => {

    let fruit = e.currentTarget.id.substring(1);
    let cells = document.querySelectorAll('.cell');

    document.querySelector('.selection').classList.remove('display');

    for (let cell of cells) {

        if (!cell.classList.contains('gray')) continue;

        let [row, col] = cellCoords(cell);
        let img = cell.firstChild;
        img.src = `images/fruits/${clues[fruit - 1]}.svg`;
        cell.classList.remove('gray');

        if (cell.dataset.val == fruit) {
            cell.classList.add('filled');
            board[row][col] = Number(fruit);
            break;
        }

        img.classList.add('incorrect');

        img.addEventListener('animationend', e => {

            let img = e.currentTarget;

            img.classList.remove('incorrect');
            img.src = '';
            img.removeAttribute('style');

        }, {once: true});

        break;
    }

    if (puzzleSolved(board)) {
        disableTouch();
        setTimeout(firework, 500);
    }
}

const newGame = () => {

    let event = touchScreen() ? 'touchstart' : 'mousedown';

    document.querySelector('.board').removeEventListener(event, newGame);

    document.querySelectorAll('.cell').forEach(cell => {

        cell.classList.add('reset'); 
        cell.classList.remove('filled', 'clue', 'zoom');

        cell.addEventListener('transitionend', e => {

            let cell = e.currentTarget;

            cell.classList.remove('reset'); 
            cell.firstChild.src = '';

        }, {once: true});
    });

    setTimeout(() => {
        initBoard(); 
        setClues();  
        generatePuzzle();
        saveSolution(); 
        fillBoard();
    }, 600);

    setTimeout(enableTouch, 1100);
}

const firework = () => {

    let n = 0;

    let cells = document.querySelectorAll('.cell');
    let order = Array.from({length: 36}, (_, i) => i);
    order = shuffle(order);

    const zoom = () => {

        if (n > 35) {

            let event = touchScreen() ? 'touchstart' : 'mousedown';

            document.querySelector('.board').addEventListener(event, newGame);
            clearInterval(zoomInterval);
            return;
        }

        cells[order[n]].classList.add('zoom');

        cells[order[n]].firstChild.addEventListener('animationend', e => {

            let img = e.currentTarget;

            img.parentElement.classList.remove('zoom'); 

        }, {once: true});

        n++;    
    }

    let  zoomInterval = setInterval(zoom, 200);
}

const enableTouch = () => {

    let cells = document.querySelectorAll('.cell');
    let event = touchScreen() ? 'touchstart' : 'mousedown';

    cells.forEach(cell => cell.addEventListener(event, selectCell));
}

const disableTouch = () => {

    let cells = document.querySelectorAll('.cell');
    let event = touchScreen() ? 'touchstart' : 'mousedown';

    cells.forEach(cell => cell.removeEventListener(event, selectCell));
}

const enableSelection = () => {

    let buttons = document.querySelectorAll('.button');
    let event = touchScreen() ? 'touchstart' : 'mousedown';

    buttons.forEach(button => button.addEventListener(event, selectFruit));
}

const disableTapZoom = () => {

    const preventDefault = (e) => e.preventDefault();
    const event = touchScreen() ? 'touchstart' : 'mousedown';

    document.body.addEventListener(event, preventDefault, {passive: false});
}

const init = () => {

    disableTapZoom();
    setBoardSize();
    initBoard();
    setClues();
    generatePuzzle();
    saveSolution(); 
    fillBoard();
    showBoard();
    enableTouch();
    enableSelection();
    preloadImages();  
}

window.onload = () => document.fonts.ready.then(setTimeout(init, 500));
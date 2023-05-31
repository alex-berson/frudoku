let board;
let clues = [];

let moves = []; //

const fruits = ['avocado','banana','blueberries','cantaloupe','cherries','coconut','grapes','green-apple','kiwi','lemon','mango','peach','pear','pineapple','red-apple','strawberry','tangerine','watermelon'];

// fruits = ['red-apple','tangerine','lemon','kiwi','blueberries','grapes'];

// fruits = ['strawberry','peach','banana','pear', 'green-apple','mango'];

// fruits = ['cherries','pineapple','cantaloupe','avocado','coconut','watermelon'];


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

    for (let fruit of fruits) {

        let img = new Image();

        img.src = `images/fruits/${fruit}.svg`;
    }
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

    // clues = fruits;

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
        let currrentCol = boxCol + i % 3;

        if (board[currentRow][currrentCol] == val) return false;
    }

    return true;
}

const checkBoxes = (board) => {

    for (let sq = 0; sq < 6; sq++) {
        outer: for (let val = 1; val <= 6; val++) {

            let r, c; 
            let boxRow = Math.trunc(sq / 2) * 2;
            let boxCol = sq % 2 * 3;

            for (let cell = 0; cell < 6; cell++) {

                let row = boxRow + Math.trunc(cell / 3);
                let col = boxCol + cell % 3;

                if (board[row][col] != 0 || !validFruit(board, row, col, val)) continue;

                if (r != undefined) continue outer;

                [r, c] = [row, col];
            }

            if (r != undefined) return [r, c, val];
        }
    }

    return [null, null, null];
}

const findFruit = (board) => {

    let row, col, val;

    [row, col, val, num] = checkBoxes(board);
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

const puzzleSolvable = (board, steps = false) => {

    let tempBoard = board.map(arr => arr.slice());

    do {

        let [row, col, val] = findFruit(tempBoard);

        if (steps) {
            moves.push([row, col, val]);
            console.log(row, col, val);
        };

        if (row == null) return false;

        tempBoard[row][col] = val;

    } while(!puzzleSolved(tempBoard));

    // if (steps) console.table(tempBoard);

    return true;
}

const generatePuzzle = () => {

    // const cells = Array.from({length: 36}, (_, i) => i);

    // const regions = [
    //     [0,1,2,6,7,8],
    //     [3,4,5,9,10,11],
    //     [12,13,14,18,19,20],
    //     [15,16,17,21,22,23],
    //     [24,25,26,30,31,32],
    //     [27,28,29,33,34,35]
    // ];

    let tempBoard = [];
    let n = 0; //

    do {

        // let cells = Array.from({length: 36}, (_, i) => i);

        // let c = [];

        n++; //

        tempBoard = board.map(arr => arr.slice());

        let clues = [1,1,2,2,3,3,4,4,5,5,6,6];
        
        let regs = [], cols = [], rows = [];

        // let m = 0;

        do {

            // m++;

            rows = [0,0,1,1,2,2,3,3,4,4,5,5];
            cols = [0,0,1,1,2,2,3,3,4,4,5,5];
            regs = [0,0,0,0,0,0];

            shuffle(rows);
            shuffle(cols);

            for (let i = 0; i < 12; i++) {
                // console.log(rows[i], cols[i], Math.trunc(rows[i] / 2) * 2 + Math.trunc(cols[i] / 3));
                regs[Math.trunc(rows[i] / 2) * 2 + Math.trunc(cols[i] / 3)]++;
            }

        } while (regs.some(r => r != 2));

        // console.log(m);

        // let c = shuffle(cells).slice(0, 12);

        // console.log(c);

        for (let [i,clue] of clues.entries()) {

            if (!validFruit(tempBoard, rows[i], cols[i], clue)) break;

            tempBoard[rows[i]][cols[i]] = clue;
        }

        // console.log(n);

        // console.log(count(tempBoard));

    } while(countFilled(tempBoard) != 12 || !puzzleSolvable(tempBoard));

    console.log(n);

    board = tempBoard;
}

const fillBoard = () => {

    let board1D = board.flat();

    document.querySelectorAll('.cell').forEach(cell => {

        let val = board1D.shift();

        if (val) {
            cell.firstChild.src = `images/fruits/${clues[val - 1]}.svg`;
            cell.classList.add('filled');
        }
    });
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
        // img.style.animation = 'incorrect 0.5s 1 ease forwards';
        img.style.animation = 'incorrect 0.75s 3 ease forwards';

        // div.style.animation = 'blink 0.75s step-start 0s 4';

        img.addEventListener('animationend', e => {

            let img = e.currentTarget;

            img.classList.remove('incorrect');
            img.src = '';
            img.removeAttribute('style');
            // cells.forEach(cell => cell.firstChild.removeAttribute('style'));

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

    document.querySelectorAll(".cell .fruit").forEach((fruit) => {
        fruit.classList.add('reset'); 
    });

    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('filled');
        cell.firstChild.classList.remove('pop');
    });

    setTimeout(() => {
        initBoard(); 
        setClues();  
        generatePuzzle();
        saveSolution(); 
        fillBoard();
    }, 600);

    setTimeout(() => {
        document.querySelectorAll(".cell .fruit").forEach((fruit) => {
            fruit.classList.remove('reset'); 
            enableTouch();
        });
    }, 1100);

}

const firework = () => {

    // console.log('FIREWORK');

    let n = 0;

    let cells = document.querySelectorAll('.cell');
    let order = Array.from({length: 36}, (_, i) => i);
    order = shuffle(order);
    // console.log(cells);

    const pop = () => {
        if (n > 35) {

            let event = touchScreen() ? 'touchstart' : 'mousedown';

            document.querySelector('.board').addEventListener(event, newGame);
            clearInterval(popInterval);

        } else {
            cells[order[n]].firstChild.classList.add('pop');
            n++;
        }
    }

    let  popInterval = setInterval(pop, 200);
}

const saveSolution = () => {

    let tempBoard = board.map(arr => arr.slice());

    do {

        let [row, col, val] = findFruit(tempBoard);

        if (row == null) return false;

        tempBoard[row][col] = val;

    } while(!puzzleSolved(tempBoard));

    let cells = document.querySelectorAll('.cell');

    console.log(tempBoard);

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            cells[row * 6 + col].dataset.val = tempBoard[row][col];
        }
    }
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
    preloadImages();
      
    
    let t0 = performance.now();

    setClues();


    // do {

        initBoard();

        generatePuzzle();

    // } while (!symmetrical());


    saveSolution(); 


    let t1 = performance.now();

    // remove();

    // let t2 = performance.now();

    fillBoard();

    showBoard();

    // if (puzzleSolved(board)) setTimeout(() => {
    //     disableTouch();
    //     firework();
    // }, 1500);

    enableTouch();
    enableSelection();
    // enableEraser();

    puzzleSolvable(board, true);

    // console.table(board);

    console.log(t1 - t0);
    // console.log(t2 - t1);
    // console.log(count(board));

    // setTimeout(play, 2000);
}

window.onload = () => document.fonts.ready.then(init());
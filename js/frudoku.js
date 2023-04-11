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

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.trunc(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }

    return array;
}

const setBoardSize = () => {

    let boardSize;

    if (screen.height > screen.width) {
        boardSize = Math.ceil(screen.width * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 6) * 6;
    } else {
        boardSize = Math.ceil(window.innerHeight * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 6) * 6;
    }

    document.documentElement.style.setProperty('--board-size', boardSize + 'px');
}

const setClues = () => {

    clues = shuffle(fruits).slice(0, 6);

    // clues = fruits;


    document.querySelectorAll('.selection .fruit').forEach((fruit, i) => {
        fruit.src = `images/fruits/${clues[i]}.svg`;
    });
}

const solved = (board) => {

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            if (board[row][col] == 0) return false;
        }
    }

    return true;
}

const valid = (board, row, col, val) => {

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

// const rows = (board) => {

//     for (let row = 0; row < 6; row++) {
//         outer: for (let val = 1; val <= 6; val++) {

//             let r, c;

//             for (let col = 0; col < 6; col++) {

//                 if (board[row][col] != 0 || !valid(board, row, col, val)) continue;

//                 if (r != undefined) continue outer;

//                 [r, c] = [row, col];
//             }

//             if (r != undefined) return [r, c, val, 1];
//         }
//     }

//     return [null, null, null, null];
// }

// const cols = (board) => {

//     for (let col = 0; col < 6; col++) {
//         outer: for (let val = 1; val <= 6; val++) {

//             let r, c;

//             for (let row = 0; row < 6; row++) {

//                 if (board[row][col] != 0 || !valid(board, row, col, val)) continue;

//                 if (r != undefined) continue outer;

//                 [r, c] = [row, col];
//             }

//             if (r != undefined) return [r, c, val, 2];
//         }
//     }

//     return [null, null, null, null];
// }

const boxes = (board) => {

    for (let sq = 0; sq < 6; sq++) {
        outer: for (let val = 1; val <= 6; val++) {

            let r, c; 
            let boxRow = Math.trunc(sq / 2) * 2;
            let boxCol = sq % 2 * 3;

            for (let cell = 0; cell < 6; cell++) {

                let row = boxRow + Math.trunc(cell / 3);
                let col = boxCol + cell % 3;

                if (board[row][col] != 0 || !valid(board, row, col, val)) continue;

                if (r != undefined) continue outer;

                [r, c] = [row, col];
            }

            if (r != undefined) return [r, c, val, 3];
        }
    }

    return [null, null, null, null];
}

// const cells = (board) => {

//     for (let row = 0; row < 6; row++) {
//         outer: for (let col = 0; col < 6; col++) {

//             if (board[row][col] != 0) continue;

//             let v;

//             for (let val = 1; val <= 6; val++) {

//                 if (valid(board, row, col, val)) {

//                     if (v != undefined) continue outer;

//                     v = val;
//                 }
//             }

//             if (v != undefined) return [row, col, v, 4];
//         }
//     }   

//     return [null, null, null, null];
// }

const solve = (board) => {

    let row, col, val, num;

    [row, col, val, num] = boxes(board);
    if (row != null) return [row, col, val, num];

    // [row, col, val, num] = rows(board);
    // if (row != null) return [row, col, val, num];

    // [row, col, val, num] = cols(board);
    // if (row != null) return [row, col, val, num];

    // [row, col, val, num] = cells(board);
    // if (row != null) return [row, col, val, num];

    return [null, null, null, null];
}

// const fill = () => {

//     for (let row = 0; row < 6; row++) {
//         for (let col = 0; col < 6; col++) {

//             if (board[row][col] != 0) continue;

//             // let arr = shuffle([1,2,3,4,5,6,7,8,9]);

//             // console.log(arr);

//             for (let i of shuffle([1,2,3,4,5,6])) {
            
//                 // if (valid(board, row, col, i)) {
//                 if (!valid(board, row, col, i)) continue;

//                 // board[row][col] = i;
//                 board[row][col] = i;

//                 if (fill()) return true;

//                 board[row][col] = 0;

//                 // if (solve(board)) {
//                 //     // console.log(board.map(arr => arr.slice()));
//                 //     n++;
//                 // }
//             }
                        
//             return false;
//         }
//     }

//     return true;
// }

// const save = (board) => {

//     let cells = document.querySelectorAll('.cell');

//     for (let row = 0; row < 6; row++) {
//         for (let col = 0; col < 6; col++) {

//             cells[row * 6 + col].dataset.val = board[row][col];
//             // cells[row * 9 + col].innerText = board[row][col];

//         }
//     }
// }

// const diffrent4 = (board) => {

//     let clues = [1, 2, 3, 4];

//     for (let i = 0; i < 4; i++) {
//         for (let j = 0; j < 4; j++) {

//             if (board[i][j] == 0) continue;

//             let index = clues.indexOf(board[i][j]);

//             if (index == -1) return false;

//             clues.splice(index, 1); 
//         }    
//     }

//     return true;
// }

// const nine = (board) => {

//     let n = 0;
//     let clues = [0,0,0,0,0,0];

//     for (let i = 0; i < 6; i++) {
//         for (let j = 0; j < 6; j++) {
//             if (board[i][j] != 0) {
//                 n++;
//                 clues[board[i][j] - 1]++;
//             }
//         }    
//     }

//     return n == 12 && clues.every(el => el <= 2 && el != 0);
// }

// const remove = () => {

//     let tempBoard;
//     let cells = Array.from({length: 36}, (_, i) => i);

//     // console.log(cells);

//     do {
         
//         tempBoard = board.map(arr => arr.slice());

//         cells = shuffle(cells);

//         // for (let i = 0; i < 16; i++) {
//         for (let cell of cells) {

//             // let cell = cells[i];
//             let row = Math.trunc(cell / 6);
//             let col = cell % 6;
//             let val = tempBoard[row][col];

//             if (count(board) == 12) break;
            
//             tempBoard[row][col] = 0;

//             if (solvable(tempBoard)) continue;

//             tempBoard[row][col] = val;
//         }

//         // console.log(diffrent4(tempBoard));

//     } while(!nine(tempBoard));

//     board = tempBoard;
// }

const count = (board) => {

    let n = 0;

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            if (board[row][col] != 0) n++;
        }
    }

    return n;
}

const solvable = (board, steps = false) => {

    let tempBoard = board.map(arr => arr.slice());

    do {

        let [row, col, val, num] = solve(tempBoard);

        if (steps) {
            moves.push([row, col, val]);
            console.log(row, col, val, num);
        };

        if (row == null) return false;

        tempBoard[row][col] = val;

    } while(!solved(tempBoard));

    // if (steps) console.table(tempBoard);

    return true;
}

const fill = () => {

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
    let n = 0;

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

            if (!valid(tempBoard, rows[i], cols[i], clue)) break;

            tempBoard[rows[i]][cols[i]] = clue;
        }

        // console.log(n);

        // console.log(count(tempBoard));

    } while(count(tempBoard) != 12 || !solvable(tempBoard));

    console.log(n);

    board = tempBoard;
}

// document.querySelector('.time').innerHTML = t2 - t1;

// const fillBoard = () => {

//     let flatBoard = board.flat();

//     console.log(flatBoard);

//     document.querySelectorAll('.cell').forEach(cell => {

//         let val = flatBoard.shift();

//         if (val) {
//             cell.firstChild.innerText = val;
//             cell.classList.add('filled');
//         } else {
//             cell.firstChild.innerText = '';
//             // cell.classList.add('green');
//         }
//     });
// }

const fillBoard = () => {

    let flatBoard = board.flat();

    // console.log(flatBoard);

    document.querySelectorAll('.cell').forEach(cell => {

        let val = flatBoard.shift();

        if (val) {

            // console.log(clues[val - 1]);

            cell.firstChild.src = `images/fruits/${clues[val - 1]}.svg`;
            cell.firstChild.classList.add('filled');
        } else {
            // cell.firstChild.innerText = '';
        }
    });
}

// const checkRow = (row, col, val) => {

//     // console.log(' ');

//     for (let i = 0; i < 6; i++) {

//         if (i == col || board[row][i] != 0) continue;

//         // console.log('row: ', row, i, valid(board, row, i, val));

//         if (valid(board, row, i, val)) return false;
//     }

//     // console.log('ROW');

//     return true;
// }

// const checkCol = (row, col, val) => {

//     // console.log(' ');

//     for (let i = 0; i < 6; i++) {

//         if (i == row || board[i][col] != 0) continue;

//         console.log('col: ', i, col, valid(board, i, col, val));

//         if (valid(board, i, col, val)) return false;
//     }
//     // console.log('COL');

//     return true;
// }

// const checkBox = (row, col, val) => {

//     let boxRow = Math.trunc(row / 2) * 2;
//     let boxCol = Math.trunc(col / 3) * 3;

//     // console.log(' ');

//     for (let i = 0; i < 6; i++) {

//         let r = boxRow + Math.trunc(i / 3);
//         let c = boxCol + i % 3;

//         if (r == row && c == col || board[r][c] != 0) continue;

//         console.log('sq: ', r, c, valid(board, r, c, val));

//         if (valid(board, r, c, val)) return false;
//     }

//     // console.log('SQ');

//     return true;
// }

// const checkCell = (row, col, val) => {

//     // console.log(' ');

//     for (i = 1; i <= 6; i++) {

//         if (i == val) continue;

//         if (valid(board, row, col, val)) return false;
//     }

//     // console.log('CELL');

//     return true;
// }

// const logic = (row, col, val) => {

//     if (checkRow(row, col, val) || checkCol(row, col, val) || checkBox(row, col, val) || checkCell(row, col, val)) return true;

//     // if (checkRow(row, col, val)) return true;

//     return false;
// }

const cellCoords = (touchedCell) => {

    let cells = document.querySelectorAll('.cell');

    for (let [i, cell] of cells.entries()) {
        if (cell == touchedCell) return [Math.trunc(i / 6), i % 6];
    }
}

const select = (e) => {

    let cell = e.currentTarget;
    let cells = document.querySelectorAll('.cell');

    for (let cell of cells) {

        let img = cell.firstChild;

        if (img.classList.contains('incorrect')) {
            img.style.animationDuration = '0.0s';
        }
    }

    // console.table(board);

    // let [row, col] = cellCoords(cell);

    // let val = parseInt(cell.dataset.val);

    // console.log(row, col, val);

    // logic(row, col, val) ? cell.classList.add('green') : cell.classList.add('red');

    if (cell.firstChild.classList.contains('filled')) { 
        for (let cell of cells) {
            cell.classList.remove('gray');
        }

        document.querySelector('.selection').classList.remove('display');
        // document.querySelector('.eraser').classList.remove('display');

        // disableFruits();
        // disableEraser();
        return;
    }

    // console.log(cell.classList);

    if (cell.classList.contains('gray')) {
        cell.classList.remove('gray');
        document.querySelector('.selection').classList.remove('display');
        // document.querySelector('.eraser').classList.remove('display');
        // disableFruits();
        // disableEraser();

        // console.log('GRAY');

        return;
    } 

    for (let cell of cells) {
        cell.classList.remove('gray');
    }

    cell.classList.add('gray');

    document.querySelector('.selection').classList.remove('display');
    // document.querySelector('.eraser').classList.remove('display');

    if (cell.firstChild.classList.contains('red')) {

        // document.querySelector('.selection').style.display = 'none';
        // document.querySelector('.eraser').style.display = 'flex';

        // setTimeout(() => {
        //     document.querySelector('.eraser').classList.add('display');   
        //     // enableEraser();              
        // }, 0);

        return;  
    }

    // document.querySelector('.eraser').style.display = 'none';
    // document.querySelector('.selection').style.display = 'flex';

    setTimeout(() => {
        document.querySelector('.selection').classList.add('display');   
        // enableFruits();             
    }, 0);
}


const selectFruit = (e) => {

    // let fruit = parseInt(e.currentTarget.innerText);

    let fruit = e.currentTarget.id.substring(1);

    // console.log(fruit);

    let cells = document.querySelectorAll('.cell');

    // for (let cell of cells) {
    //     if (cell.classList.contains('gray')) {

    //         let [row, col] = cellCoords(cell);

    //         cell.classList.remove('gray');

    //         cell.dataset.val == fruit ? cell.firstChild.classList.add('filled') : cell.firstChild.classList.add('red'); 
    //         cell.firstChild.src = `images/fruits/${clues[fruit - 1]}.svg`;
    //         if (cell.dataset.val == fruit) board[row][col] = fruit;

    //     }

    //     document.querySelector('.selection').classList.remove('display');
    //     // disableFruits();

    // }

    for (let cell of cells) {
        if (cell.classList.contains('gray')) {

            let [row, col] = cellCoords(cell);
            let img = cell.firstChild;

            cell.classList.remove('gray');

            if (cell.dataset.val == fruit) {
                img.classList.add('filled');
                // div.style.opacity = 1;
                board[row][col] = Number(fruit);
            } else {
                img.classList.add('incorrect'); 
                img.style.animation = 'incorrect 0.5s 1 ease forwards';
                // div.style.animation = 'blink 0.75s step-start 0s 4';

                img.addEventListener('animationend', e => {

                    let img = e.currentTarget;

                    img.classList.remove('incorrect');
                    img.src = '';
                    img.removeAttribute("style");
                }, {once: true});

            }

            img.src = `images/fruits/${clues[fruit - 1]}.svg`;
        }

        document.querySelector('.selection').classList.remove('display');
    }

    if (solved(board)) {
        disableTouch();
        setTimeout(firework, 500);
    }

    // console.log(fruit);
}

const reset = () => {

    document.querySelector('.board').removeEventListener('touchstart', reset);
    document.querySelector('.board').removeEventListener('mousedown', reset);

    document.querySelectorAll(".cell .fruit").forEach((fruit) => {
        fruit.classList.add('reset'); 
    });

    document.querySelectorAll('.cell').forEach(cell => {
        cell.firstChild.classList.remove('filled');
        cell.firstChild.classList.remove('pop');
    });

    setTimeout(() => {
        initBoard(); 
        setClues();  
        fill();
        save(); 
        // remove();
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
        if (n > 35){
            document.querySelector('.board').addEventListener('touchstart', reset);
            document.querySelector('.board').addEventListener('mousedown', reset);
            clearInterval(popInterval);
        } else {
            cells[order[n]].firstChild.classList.add('pop');
            n++;
        }
    }

    let  popInterval = setInterval(pop, 200);

}

// const erase = (e) => {

//     let cells = document.querySelectorAll('.cell');

//     for (let cell of cells) {
//         if (cell.classList.contains('gray')) {

//             let [row, col] = cellCoords(cell);

//             cell.classList.remove('gray');
//             cell.firstChild.classList.remove('red');
//             // cell.firstChild.innerText = '';
//             board[row][col] = 0;
//         }

//         document.querySelector('.eraser').classList.remove('display');

//         // disableFruits();
//         // disableEraser();
//     }
// }

const enableSelection = () => {

    let fruits = document.querySelectorAll('.selection .fruit');

    for (let fruit of fruits){
        if (touchScreen()){
            fruit.addEventListener("touchstart", selectFruit);
        } else {
            fruit.addEventListener("mousedown", selectFruit);
        }
    }
}

// const disableFruits = () => {

//     let Fruits = document.querySelectorAll('.number');

//     for (let fruit of fruits){
//         if (touchScreen()){
//             fruit.removeEventListener("touchstart", selectfruit);
//         } else {
//             fruit.removeEventListener("mousedown", selectfruit);
//         }
//     }
// }

// const enableEraser = () => {

//     let x = document.querySelector('.wastebasket');

//         if (touchScreen()){
//             x.addEventListener("touchstart", erase);
//         } else {
//             x.addEventListener("mousedown", erase);
//         }
// }

// const disableEraser = () => {

//     let x = document.querySelector('.wastebasket');

//         if (touchScreen()){
//             x.removeEventListener("touchstart", erase);
//         } else {
//             x.removeEventListener("mousedown", erase);
//         }
// }

// const fill2 = () => {

//     const cells = Array.from({length: 36}, (_, i) => i);
//     let tempBoard = [];
//     let i = 0;

//     do {
//         i++;

//         let clues = [1,1,2,2,3,3,4,4,5,5,6,6];

//         tempBoard = board.map(arr => arr.slice());

//         let c = shuffle(cells).slice(0, 12);

//         // console.log(c);

//         for (let [i, clue] of clues.entries()) {

//             // console.log(Math.trunc(c[i] / 6), c[i] % 6, clue)

//             tempBoard[Math.trunc(c[i] / 6)][c[i] % 6] = clue;
//         }

//     } while(!solvable(tempBoard));

//     console.log(i);

//     board = tempBoard;
// }

// const fill3 = () => {

//     // const cells = Array.from({length: 36}, (_, i) => i);
//     let tempBoard = [];
//     let i = 0;

//     do {

//         let cells = Array.from({length: 36}, (_, i) => i);

//         i++;

//         let clues = [1,1,2,2,3,3,4,4,5,5,6,6];

//         tempBoard = board.map(arr => arr.slice());

//         // let c = shuffle(cells).slice(0, 12);

//         // console.log(c);

//         for (let clue of clues) {

//             shuffle(cells);

//             for (let cell of cells) {
//                 if (valid(tempBoard, Math.trunc(cell / 6), cell % 6, clue)) {
//                     tempBoard[Math.trunc(cell / 6)][cell % 6] = clue;
//                     break;
//                 }
//             }

//         }

//     } while(!solvable(tempBoard) || count(tempBoard) != 12);

//     console.log(i);

//     board = tempBoard;
// }

// const fill4 = () => {

//     // const cells = Array.from({length: 36}, (_, i) => i);

//     const regions = [
//         [0,1,2,6,7,8],
//         [3,4,5,9,10,11],
//         [12,13,14,18,19,20],
//         [15,16,17,21,22,23],
//         [24,25,26,30,31,32],
//         [27,28,29,33,34,35]
//     ];

//     let tempBoard = [];
//     let n = 0;

//     do {

//         // let cells = Array.from({length: 36}, (_, i) => i);

//         let c = [];

//         n++;

//         let clues = [1,1,2,2,3,3,4,4,5,5,6,6];

//         tempBoard = board.map(arr => arr.slice());

//         for (let i = 0; i < 6; i++) {
//             c.push(regions[i][Math.trunc(Math.random() * 6)]);
//             c.push(regions[i][Math.trunc(Math.random() * 6)]);
//         }

//         shuffle(c);

//         // let c = shuffle(cells).slice(0, 12);

//         // console.log(c);

//         for (let [i,clue] of clues.entries()) {

//             // if (!valid(tempBoard, Math.trunc(c[i] / 6), c[i] % 6, clue)) {
//             //     console.log('NOT');
//             // }   

//             if (!valid(tempBoard, Math.trunc(c[i] / 6), c[i] % 6, clue)) break;

//             tempBoard[Math.trunc(c[i] / 6)][c[i] % 6] = clue;
                           
//         }

//         // console.log(n);

//     } while(!solvable(tempBoard) || count(tempBoard) != 12);

//     console.log(n);

//     board = tempBoard;
// }


// const symmetrical = () => {

//     for (let r = 0; r < 6; r++) {
//         for (p = 0; p < 3; p++) {

//             if (board[r][p] == 0 && board[r][p] != board[r][5 - p]) return false;
//         }
//     }

//     return true;
// }

const save = () => {

    let tempBoard = board.map(arr => arr.slice());

    do {

        let [row, col, val, num] = solve(tempBoard);

        if (row == null) return false;

        tempBoard[row][col] = val;

    } while(!solved(tempBoard));

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

    for (let cell of cells){
        if (touchScreen()){
            cell.addEventListener("touchstart", select);
        } else {
            cell.addEventListener("mousedown", select);
        }
    }
}

const disableTouch = () => {

    // console.log('DISABLE');

    let cells = document.querySelectorAll('.cell');

    for (let cell of cells){
        if (touchScreen()){
            cell.removeEventListener("touchstart", select);
        } else {
            cell.removeEventListener("mousedown", select);
        }
    }
}

const disableTapZoom = () => {
    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchstart', preventDefault, {passive: false});
    document.body.addEventListener('mousedown', preventDefault, {passive: false});
}

const init = () => {

    disableTapZoom();
    setBoardSize();
      
    
    let t0 = performance.now();

    setClues();


    // do {

        initBoard();

        fill();

    // } while (!symmetrical());


    save(); 


    let t1 = performance.now();

    // remove();

    // let t2 = performance.now();

    fillBoard();

    showBoard();

    // if (solved(board)) setTimeout(() => {
    //     disableTouch();
    //     firework();
    // }, 1500);

    enableTouch();
    enableSelection();
    // enableEraser();

    solvable(board, true);

    // console.table(board);

    console.log(t1 - t0);
    // console.log(t2 - t1);
    // console.log(count(board));

    // setTimeout(play, 2000);
}

window.onload = () => document.fonts.ready.then(init());
/* Default values: */

const ROWS = 15;
const COLS = 10;
const SIZE_CELLS = 30;
const NUMBER_MINES = 20;


document.addEventListener("DOMContentLoaded", function() {

    // Create new game
    let game = new MinesweeperGame(ROWS,COLS,SIZE_CELLS,NUMBER_MINES);
    game.createTable();

    // Show number of mines
    document.querySelector('#remaining-mines').innerHTML = `${game.remaining_mines}`;

    // Create eventListener for each cell, to call function play
    Object.values(game.table).forEach(cell => {
        let cell_id = `#pos${cell.row}-${cell.column}`;

        document.querySelector(cell_id).addEventListener("click", function() {
            game.play(cell.row, cell.column);
        });
    });
    
    // Two ways to toggle flag button
    document.querySelector('#flag-button').addEventListener("click", function() {
        game.flagToggle();
    });
    document.addEventListener('keypress', function() {
        document.querySelector('#flag-button').focus();
        game.flagToggle();
    });

    // New game button (reloads the page)
    document.querySelector('#new-game').addEventListener("click", function() {
        location.reload();
    });

});
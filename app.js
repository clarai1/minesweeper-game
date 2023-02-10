/* Default values: */

if (!localStorage.getItem('size_cells')) {
    localStorage.setItem('size_cells', 30);
}
var ROWS = 15;
var COLS = 10;
const SIZE_CELLS = localStorage.getItem('size_cells');
var NUMBER_MINES = 20;


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

    document.querySelector('#options').addEventListener("click", function() {
        document.querySelector('#options-content').style.display = 'block';
        document.querySelector('#help-content').style.display = 'none';
        document.querySelector('#game').style.display = 'none';
    });

    document.querySelector('#help').addEventListener("click", function() {
        document.querySelector('#help-content').style.display = 'block';
        document.querySelector('#options-content').style.display = 'none';
        document.querySelector('#game').style.display = 'none';
    });


    // Options are set, then new game is uploaded. 
    document.querySelector("#sample-cell").setAttribute("style", `height: ${localStorage.getItem('size_cells')}px; width: ${localStorage.getItem('size_cells')}px;`);
    document.querySelector("#size-cells").addEventListener("change", (event) => {
        let new_size = event.target.value;
        document.querySelector("#sample-cell").setAttribute("style", `height:${new_size}px; width:${new_size}px;`);
        localStorage.setItem("size_cells", new_size);
    });
});
/* Default values: */

if (!localStorage.getItem('size_cells')) {
    localStorage.setItem('size_cells', 30);
}

if (!localStorage.getItem('difficulty')) {
    localStorage.setItem('difficulty', 1);
}

switch (localStorage.getItem('difficulty')) {
    case '1':
        var ROWS = 9;
        var COLS = 9;
        var NUMBER_MINES = 10;
        break;
    case '2':
        var ROWS = 16;
        var COLS = 16;
        var NUMBER_MINES = 40; 
        break;
    case '3':
        var ROWS = 16;
        var COLS = 30;
        var NUMBER_MINES = 99; 
        break;
    default:
        var ROWS = 15;
        var COLS = 10;
        var NUMBER_MINES = 20;

}

const SIZE_CELLS = localStorage.getItem('size_cells');



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
    document.querySelector('#game-header .flag-button').addEventListener("click", function() {
        game.flagToggle();
    });
    document.addEventListener('keypress', function() {
        document.querySelector('#game-header .flag-button').focus();
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
        if (document.querySelector('#result')){
            document.querySelector('#result').style.display = 'none';
        }
    });

    document.querySelector('#help').addEventListener("click", function() {
        document.querySelector('#help-content').style.display = 'block';
        document.querySelector('#options-content').style.display = 'none';
        document.querySelector('#game').style.display = 'none';
        if (document.querySelector('#result')){
            document.querySelector('#result').style.display = 'none';
        }
    });


    // Set size of cells
    document.querySelector("#sample-cell").setAttribute("style", `height: ${localStorage.getItem('size_cells')}px; width: ${localStorage.getItem('size_cells')}px;`);
    document.querySelector("#size-cells").value = localStorage.getItem('size_cells');
    document.querySelector("#size-cells").addEventListener("change", (event) => {
        let new_size = event.target.value;
        document.querySelector("#sample-cell").setAttribute("style", `height:${new_size}px; width:${new_size}px;`);
        localStorage.setItem("size_cells", new_size);
    });

    // Set difficulty:
    let difficulty_set = document.querySelector("#difficulty")
    let difficulty_show = document.querySelector("#difficulty-settings output")
    difficulty_set.value = localStorage.getItem('difficulty');
    difficulty_show.value = localStorage.getItem('difficulty')
    difficulty_set.addEventListener("change", (event) => {
        localStorage.setItem('difficulty', event.target.value);
        difficulty_show.value = event.target.value;

    });

});
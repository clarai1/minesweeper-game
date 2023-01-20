const rows = 15;
const columns = 10;
const size_cell = 30

class Cell{
    constructor(row, column){
        this.row = row;
        this.column = column;
        this.covered = true;
        this.number = 0; // if number === -1 -> it is a bomb
        this.flag = false;
    }
}

class MineweeperGame{
    constructor(rows, columns, size_cell, number_bombs){
        this.rows = rows;
        this.columns = columns;
        this.size_cell = size_cell;
        this.number_bombs = number_bombs;
        this.flagButton = false;
        this.table = new Object(); // dict with keys 'i,j' for each cell.
        this.tableIsGenerated = false;
        this.uncovered_cells = 0;
    }

    /**
     * Creates html table and at the same time initialize Minesweeper table 
     * with default Cells objects.
     * The HTML contains a button for each cell in position i,j which has id: #posi-j.
     * The table in MinesweeperGame is an Object with string keys: 'i,j'.
     */
    createTable() {
        let body = document.querySelector('body');
        let table = document.createElement('table');

        table.style.height = `${this.size_cell * this.rows}px`;
        table.style.width = `${this.size_cell * this.columns}px`;

        for (let i = 1; i <= this.rows; i ++){
            let tr = document.createElement('tr');
            table.append(tr);
            for (let j = 1; j <= this.columns; j++){

                // Create button for html
                let td = document.createElement('td');
                tr.append(td);
                let button = document.createElement('button');
                button.id = `pos${i}-${j}`;
                td.style.width = `${this.size_cell}`;
                tr.style.height = `${this.size_cell}`;
                button.innerHTML = '';
                td.append(button);

                // Create Cell object in table
                this.table[`${i},${j}`] = new Cell(i,j)
            }
        }
        body.append(table);
    };

    /**
     * Given a cell position i,j returns all possible adjancent cells in a list
     * @param {number} i 
     * @param {number} j 
     * @returns {Array}
     */
    getAdjacents(i,j) {
        let adjacents = [];
        let arr = [-1, 1];
        arr.forEach(k => {
            if (1 <= i + k && i + k <= this.rows) {
                adjacents.push(this.table[`${i+k},${j}`]);
            }
            if (1 <= j + k && j + k <= this.columns) {
                adjacents.push(this.table[`${i},${j+k}`]);
            }
            if (1 <= i + k && i + k <= this.rows && 1 <= j + k && j + k <= this.columns) {
                adjacents.push(this.table[`${i+k},${j+k}`]);
            }
            if (1 <= i - k && i - k <= this.rows && 1 <= j + k && j + k <= this.columns) {
                adjacents.push(this.table[`${i-k},${j+k}`]);
            }
        });
        return adjacents;
    }

    /**
     * Initializes Minesweeper table cells, first picks random places for the bombs, 
     * ensuring no bomb is in the i,j position or in adjacent neighborhood,
     * then insert the correct number of adjacent bombs in each cell. 
     * @param {number} i Row of starting cell
     * @param {number} j Column of starting cell
     */
    start(i,j) {
        let bombs = []
        let initial_cells = this.getAdjacents(i,j);
        initial_cells.push(this.table[`${i},${j}`]);
        console.log(initial_cells);

        while (bombs.length < this.number_bombs){
            let l = Math.floor(Math.random() * (this.rows)) + 1;
            let k = Math.floor(Math.random() * (this.columns)) + 1;
            let cell = this.table[`${l},${k}`]
            if (!bombs.includes(cell) && !initial_cells.includes(cell)) {
                cell.number = -1;
                bombs.push(cell);
            }
        }  

        bombs.forEach( bomb => {
            let adjacents = this.getAdjacents(bomb.row,bomb.column)
            adjacents.forEach(cell =>{
                if (cell.number !== -1) {
                    cell.number++;
                }
            });
        });
    }

    play(i,j) {
        if (!this.tableIsGenerated){
            this.tableIsGenerated = true;
            this.start(i,j);
        }
        let cell = this.table[`${i},${j}`]

        if (cell.covered) {
            if (this.flagButton) {
                this.flag(i,j);
            } else {
                this.uncover(i,j);
            }
        } else if (this.adjacentFlags(i,j) >= cell.number){
            this.getAdjacents(i,j).forEach(cell =>{
                if (cell.covered && !cell.flag) {
                    this.uncover(cell.row, cell.column);

                }
            });
        }
        if (this.uncovered_cells === this.rows * this.columns - this.number_bombs) {
            return this.endGame(true);
        }
    }

    /**
     * Toggle this.flagButton and html flag-button 
     */
    flagToggle(){
        if (this.flagButton) {
            this.flagButton = false;
            let flagButton_html = document.querySelector('#flag-button');
            flagButton_html.innerHTML = 'Flag is Off';
            flagButton_html.style.backgroundColor = "red";
        } else {
            this.flagButton = true;
            let flagButton_html = document.querySelector('#flag-button');
            flagButton_html.innerHTML = 'Flag is On';
            flagButton_html.style.backgroundColor = "green";
        }
    }

    /**
     * Toggle flag of cell i,j, both in Cell class and html page.
     * @param {number} i 
     * @param {number} j 
     */
    flag(i,j) {
        let cell = this.table[`${i},${j}`];
        let cell_html = document.querySelector(`#pos${i}-${j}`);
        if (!cell.covered){
            return;
        }
        if (cell.flag) {
            cell.flag = false;
            cell_html.innerHTML = '';
        } else {
            cell.flag = true;
            cell_html.innerHTML = 'F';
        }
    }

    /**
     * Computes the number of flags adjacent to a cell.
     * @param {number} i 
     * @param {number} j 
     */
    adjacentFlags(i,j){
        let numberFlags = 0;
        this.getAdjacents(i,j).forEach(cell => {
            if (cell.flag){
                numberFlags++;
            }
        });
        return numberFlags;
    }

    /**
     * Uncovers all cells which should be uncovered together with i,j
     * Note: cell i,j is assured to not have number -1!
     * @param {number} i 
     * @param {number} j 
     */
    uncover(i,j){
        let cell = this.table[`${i},${j}`];
        let cell_id = document.querySelector(`#pos${i}-${j}`);
        if (cell.flag){
            return;
        }
        if (cell.number === -1){
            return this.endGame(false);
        }
        cell.covered = false;
        this.uncovered_cells++;
        cell_id.innerHTML = cell.number;
        if (cell.number === 0) {
            let adjacents = this.getAdjacents(i,j);
            adjacents.forEach(cell => {
                if (cell.covered && !cell.flag){
                    this.uncover(cell.row, cell.column);
                }
            });
        }
    }

    /**
     * If win is true, then the player won, else game over.
     * @param {boolean} result 
     */
    endGame(win){
        this.show_numbers();
        let result = document.createElement('h2')
        if (win){
            result.innerHTML = 'Congratulations, you won!'
        } else {
            result.innerHTML = 'Game Over!'
        }
        document.querySelector('body').append(result)
    }


    show_numbers(){
        Object.values(this.table).forEach(cell => {
            let cell_id = `#pos${cell.row}-${cell.column}`
            if (cell.number !== -1){
                document.querySelector(cell_id).innerHTML = `${cell.number}`;
            } else {
                document.querySelector(cell_id).innerHTML = 'b';
            }
        });
    }

}

const ROWS = 15;
const COLS = 10;
const SIZE_CELLS = 40;
const BOMBS = 20

document.addEventListener("DOMContentLoaded", function() {
    let game = new MineweeperGame(ROWS,COLS,SIZE_CELLS,BOMBS);
    game.createTable();

    Object.values(game.table).forEach(cell => {
        let cell_id = `#pos${cell.row}-${cell.column}`;

        document.querySelector(cell_id).addEventListener("click", function() {
            game.play(cell.row, cell.column);
        });
    });
    
    document.querySelector('#flag-button').addEventListener("click", function() {
        game.flagToggle();
    });

    document.addEventListener('keypress', function() {
        document.querySelector('#flag-button').focus();
        game.flagToggle();
    });
});
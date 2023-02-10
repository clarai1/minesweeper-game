class Cell{
    constructor(row, column){
        this.row = row;
        this.column = column;
        this.covered = true;
        this.number = 0; // if number === -1 -> it is a mine
        this.flag = false;
    }
}

// Variables to store the time, the interval starts when playing the first cell
// and stops when the game ends.

let interval;

class MinesweeperGame{
    constructor(rows, columns, size_cell, number_mines){
        this.rows = rows;
        this.columns = columns;
        this.size_cell = size_cell;
        this.number_mines = number_mines;
        this.flagButton = false;
        this.table = new Object(); // dict with keys 'i,j' for each cell.
        this.tableIsGenerated = false;
        this.uncovered_cells = 0;
        this.remaining_mines = number_mines;
        this.flagEmoji = '&#128681';
        this.bombEmoji = '&#128163';
        this.time = 0;
    }

    /**
     * Creates html table and at the same time initialize Minesweeper table 
     * with default Cells objects.
     * The HTML contains a button for each cell in position i,j which has id: #posi-j.
     * The table in MinesweeperGame is an Object with string keys: 'i,j'.
     */
    createTable() {
        let body = document.querySelector('#game-table');
        let table = document.createElement('table');

        for (let i = 1; i <= this.rows; i ++){
            let tr = document.createElement('tr');
            table.append(tr);
            for (let j = 1; j <= this.columns; j++){

                // Create button for html
                let td = document.createElement('td');
                tr.append(td);
                let button = document.createElement('button');
                button.setAttribute('style', `height: ${this.size_cell}px; width: ${this.size_cell}px;font-size: ${this.size_cell / 2}px;`);
                button.dataset.row = i;
                button.dataset.col = j;
                button.id = `pos${i}-${j}`;
                button.innerHTML = '';
                td.append(button);

                // Create Cell object in table
                this.table[`${i},${j}`] = new Cell(i,j)
            }
        }
        body.append(table);
    }

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
     * Initializes Minesweeper table cells, first picks random places for the mines, 
     * ensuring no mine is in the i,j position or in adjacent neighborhood,
     * then insert the correct number of adjacent mines in each cell. 
     * @param {number} i Row of starting cell
     * @param {number} j Column of starting cell
     */
    start(i,j) {
        let mines = []
        let initial_cells = this.getAdjacents(i,j);
        initial_cells.push(this.table[`${i},${j}`]);

        while (mines.length < this.number_mines){
            let l = Math.floor(Math.random() * (this.rows)) + 1;
            let k = Math.floor(Math.random() * (this.columns)) + 1;
            let cell = this.table[`${l},${k}`]
            if (!mines.includes(cell) && !initial_cells.includes(cell)) {
                cell.number = -1;
                mines.push(cell);
            }
        }  

        mines.forEach( mine => {
            let adjacents = this.getAdjacents(mine.row,mine.column)
            adjacents.forEach(cell =>{
                if (cell.number !== -1) {
                    cell.number++;
                }
            });
        });

        // Start timer
        interval = setInterval(this.count.bind(this), 1000);
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
        if (this.uncovered_cells === this.rows * this.columns - this.number_mines) {
            return this.endGame(true);
        }
    }

    /**
     * Toggle this.flagButton and html flag-button 
     */
    flagToggle(){
        if (this.flagButton) {
            this.flagButton = false;
            let flagButton_html = document.querySelector('.flag-button');
            flagButton_html.classList.add("crossed-out");
            flagButton_html.style.backgroundColor = "red";
        } else {
            this.flagButton = true;
            let flagButton_html = document.querySelector('.flag-button');
            flagButton_html.classList.remove("crossed-out");
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
        let cell_html = document.querySelector(`[data-row='${i}'][data-col='${j}']`);
        if (!cell.covered){
            return;
        }
        if (cell.flag) {
            cell.flag = false;
            cell_html.innerHTML = '';
            this.remaining_mines++;
        } else {
            cell.flag = true;
            cell_html.innerHTML = this.flagEmoji;
            this.remaining_mines--;
        }
        document.querySelector('#remaining-mines').innerHTML = `${this.remaining_mines}`;
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
        let cell_html = document.querySelector(`[data-row='${i}'][data-col='${j}']`);
        if (cell.flag){
            return;
        }
        if (cell.number === -1){
            cell_html.style.backgroundColor = 'red';
            return this.endGame(false);
        }
        cell.covered = false;
        // Here we uncover a cell, change styles:
        this.uncovered_cells++;
        cell_html.innerHTML = cell.number;
        cell_html.style.color = this.color(cell.number);
        cell_html.style.backgroundColor = 'lightgray';

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
     * Given integer x, returns color desired in string format.
     * @param {number} x 
     */
    color(x){
        switch (x){
            case 1: 
                return 'blue';
            case 2:
                return 'green';
            case 3: 
                return 'red';
            case 4:
                return 'darkblue';
            case 5: 
                return 'darkgreen';
            case 6:
                return 'pink';
            case 7:
                return 'violet';
            case 8: 
                return 'yellow';
        }
    }

    /**
     * If win is true, then the player won, else game over.
     * @param {boolean} result 
     */
    endGame(win){
        clearInterval(interval);
        this.show_numbers();
        let result = document.createElement('h2');
        result.id = 'result';
        if (win){
            result.innerHTML = 'Congratulations, you won!';
        } else {
            result.innerHTML = 'Game Over!';
        }
        document.querySelector('body').prepend(result);
        document.querySelectorAll('#game-table button').forEach(button =>{
            button.disabled = true;
        });

    }

    show_numbers(){
        Object.values(this.table).forEach(cell => {
            let cell_id = `[data-row='${cell.row}'][data-col='${cell.column}']`;
            let cell_html = document.querySelector(cell_id);
            if (cell.number !== -1 && !cell.flag){
                cell_html.innerHTML = `${cell.number}`;
                cell_html.style.color = this.color(cell.number);
            } else if (cell.number !== -1 && cell.flag){
                cell_html.className = 'crossed-out';
            } else if (cell.number === -1 && !cell.flag){
                document.querySelector(cell_id).innerHTML = this.bombEmoji;
            }
        });
    }

    /**
     * Function to count the time of the game.
     */
    count(){
        this.time++;
        let minutes = Math.floor(this.time / 60)
        let seconds = this.time % 60
        document.querySelector('#minutes').innerHTML = minutes.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        document.querySelector('#seconds').innerHTML = seconds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    }

}
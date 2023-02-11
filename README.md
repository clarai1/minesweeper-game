# Minesweeper game

A classic minesweeper game implemented with JavaScript, HTML and CSS, with a simple design. It is based on a single-page application, a new game starts when the page is reloaded.

There are essentially three parts: the game, the options and the help page.

## The game

The game is implemented in the file minesweeper.js, where a class called MinesweeperGame defines all functions the game needs. 
In the app.js file we create an instance of MinesweeperGame every time the page is reloaded. The method ```createTable``` is called to create the table of the game, together with the HTML table. Then the only functions needed for the game to run are ```play``` and ```flagToggle```.

The ```play``` function takes the coordinates of the cell clicked as parameters and returns different functions of the class, depending on the case.

The ```flagToggle``` function is needed to change between the flag-mode of the game, where no cell can be uncovered and flags are placed/removed, and the play-mode of the game where cells are uncovered.

The position of the mines is determined only when the first cell is clicked, in this way, the first move will always be safe. In fact, the mines are randomly placed on the entire table through a while loop, if a mine falls in the first clicked cell or in its adjacent cells, the while loop will just continue without placing any mine.

## Options section

There are two options for now: one for the size of the cells, just for a visual reason, and one for the levels of difficulties.
There are three levels of difficulties which are the classic ones: 
1. Beginner: 9x9 table with 10 mines,
2. Intermediate: 16x16 table with 40 mines,
3. Expert: 16x30 table with 99 mines.

The options values are stored in the local storage, so that when reloading the page, the preferences will not be deleted. 

## Help section

Just an explanation of how to play, how to toggle the flag and a tip to play faster. 

## Further possible improvements:

- The graphics could be improved, in particular the cross over the flags and the header of the game where time and remaining mines are displayed.
- Other options could be added, such as options to modify the size of the table by keeping the level of difficulty unvaried.
- Make the application mobile-responsive.
- Store the best score of the player. 

This is my first project to learn JavaScript, any suggestion or improvement is welcome!  





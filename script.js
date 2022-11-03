// Set up human readable const variables
// EMPTY_TILE for index value of empty tile space:
const EMPTY_TILE = 0;
// Board moves (each represents the step through the tiles array to go in that direction):
const UP = -4;
const RIGHT = 1;
const DOWN = 4;
const LEFT = -1;
// Key press codes:
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const UP_ARROW = 38;
const DOWN_ARROW = 40;

// Get reference to 'new game' button
const newGameButton = document.querySelector("#new-game-button");

// Declare constructor for pairs of foreground background colours for tiles
class ColourPair {
    constructor(foreground, background) {
        this.foreground = foreground;
        this.background = background;
    }
}

// Set up colour pair values with WCAG compliant contrast (first one is blank tile)
const colourPairs = [
    new ColourPair("#eee", "#eee"),
    new ColourPair("#000", "#ddd8b8"),
    new ColourPair("#000", "#c8d2b9"),
    new ColourPair("#000", "#b3cbb9"),
    new ColourPair("#000", "#9cbabd"),
    new ColourPair("#000", "#84a9c0"),
    new ColourPair("#fff", "#7e99b9"),
    new ColourPair("#fff", "#7788b2"),
    new ColourPair("#fff", "#6a66a3"),
    new ColourPair("#fff", "#5f4a8a"),
    new ColourPair("#fff", "#64417e"),
    new ColourPair("#fff", "#542e71")
];

// Class to represent state of one Tile
class Tile {
    // Constructor receives index value from 0 to 11
    constructor(index) {
        this.index = index;
        this.hasCombinedThisTurn = false;
    }
    // Getter for 'text' property to be displayed on the tile (index of 0 is empty tile so no text)
    get text() {
        if (this.index == EMPTY_TILE) {
            return "";
        }
        // raise 2 to the power of index value to get tile display number (2, 4, 8, 16...)
        return `${2 ** (this.index)}`;
    }

    // Getter for colourPair object which gives foreground and background colours matched to tile index
    get colourPair() {
        return colourPairs[this.index];
    }
}

// Class to hold game state and actions
class Board {
    constructor(canvas) {
        this.tiles = new Array(16);
        this.canvas = canvas;
        this.setup();
    }

    // Fills board with empty tiles
    clearBoard() {
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i] = new Tile(EMPTY_TILE);
        }
    }

    // Clears board and places two tiles with '2' or '4' value (index of 1 or 2)
    setup() {
        this.clearBoard();

        for (let i = 0; i < 2; i++) {
            this.placeRandomTile();
        }
    }

    // Returns array of all remaining empty board squares
    getEmptySquares() {
        let emptySquares = [];
        this.tiles.forEach(tile => {
            if (tile.index == EMPTY_TILE) {
                emptySquares.push(tile);
            }
        });
        return emptySquares;
    }

    // Draw board array of tiles on the canvas supplied in the constructor
    draw() {
        let canvasWidth = this.canvas.width;
        let tileWidth = (canvasWidth / 4) * 0.90;
        let gap = (canvasWidth * 0.1) / 5;
        let xPos = 0;
        let yPos = 0;
        let x = 0;
        let y = 0;

        let context = this.canvas.getContext("2d");
        let fontSize = (tileWidth / 8) * 2;

        context.fontKerning = "none";
        context.font = `${fontSize}px sans`;

        for (let i = 0; i < this.tiles.length; i++) {
            let tile = this.tiles[i];
            if (tile != null) {
                // Calculate x and y coordinate offsets to get the text in the middle of the tile
                let textPositionOffsetX = (3 - tile.text.length) * (fontSize * 0.4) + fontSize;
                let textPositionOffsetY = fontSize * 2.35;
                // Calculate xPos and yPos positions of tile based on tiles array index
                if (tile.text.length == 1) {
                    textPositionOffsetX -= fontSize / 12;
                }

                xPos = i % 4;
                yPos = Math.floor(i / 4);
                // Calculate 2D context coordinates of tile
                x = gap + (xPos * (tileWidth + gap));
                y = gap + (yPos * (tileWidth + gap));

                context.beginPath();
                context.rect(x, y, tileWidth, tileWidth);
                context.fillStyle = tile.colourPair.background;
                context.fill();
                context.fillStyle = tile.colourPair.foreground;
                context.fillText(tile.text, x + textPositionOffsetX, y + textPositionOffsetY);
                context.closePath();
            }
        }
    }

    // Represents one game move
    // Moves all movable tiles as far as they can go in the supplied direction
    move(direction) {
        // Set up the order in which tiles (array elements) need to be moved to allow tile combinations
        // N.B. First row/column in move direction does not need to be moved as it is on the edge
        let tileMoveOrder = [];
        switch (direction) {
            case UP:
                tileMoveOrder = [4, 8, 12, 5, 9, 13, 6, 10, 14, 7, 11, 15];
                break;
            case RIGHT:
                tileMoveOrder = [2, 1, 0, 6, 5, 4, 10, 9, 8, 14, 13, 12];
                break;
            case DOWN:
                tileMoveOrder = [8, 4, 0, 9, 5, 1, 10, 6, 2, 11, 7, 3];
                break;
            case LEFT:
                tileMoveOrder = [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15];
        }

        // Set up counter of actual moves
        let tileMovesThisTurn = 0;

        // Iterate through tiles in tileMoveOrder[] order
        for (let i = 0; i < tileMoveOrder.length; i++) {

            let tileIndex = tileMoveOrder[i];
            let tileFrom = this.tiles[tileIndex];

            // If the tile being moved is empty, don't bother moving anything
            if (tileFrom.index == EMPTY_TILE) {
                continue;
            }

            // Calculate number of moves needed using position in tileMoveOrder array
            let numberOfMoves = Math.floor(i % 3) + 1;

            // Loop through each tile and move it as far as it can go in the specified direction
            for (let m = 0; m < numberOfMoves; m++) {
                let tileTo = this.tiles[tileIndex + direction];
                tileFrom = this.tiles[tileIndex]

                // If the tile being moved to is empty, swap the tileFrom into that space
                if (tileTo.index == EMPTY_TILE) {
                    this.swapTiles(tileIndex, tileIndex + direction);
                    tileIndex += direction;
                    tileMovesThisTurn++;
                }
                // If the tile being moved to is the same value as the tile being moved, AND neither tile
                // has been combined already, then combine the tiles into one and increment its index by 1
                else if ((
                tileFrom.index == tileTo.index) &&
                !tileFrom.hasCombinedThisTurn &&
                !tileTo.hasCombinedThisTurn) {
                    tileFrom.index += 1;
                    // Remember that a 'combine' action has been performed
                    tileFrom.hasCombinedThisTurn = true;
                    tileTo.index = 0;
                    this.swapTiles(tileIndex, tileIndex + direction);
                    tileIndex += direction;
                    tileMovesThisTurn++;
                }
                // Can't move the current tile in the specified direction so move onto the next
                else break;
            }
        }
        this.resetHasCombinedFlags();

        // If >=1 tiles were moved this turn, add a '2' or '4' tile at a random free space
        if (tileMovesThisTurn > 0) {
            this.placeRandomTile();
        }

        // End of turn, redraw the board
        this.draw();

        if (this.isGameOver()) {
            this.displayGameOver();
        }
    }

    // Swap the two tiles in the tiles array with the supplied array subscripts
    swapTiles(item1, item2) {
        let temp = board.tiles[item1];
        board.tiles[item1] = board.tiles[item2];
        board.tiles[item2] = temp;
    }

    placeRandomTile() {
        // Get array of empty squares
        let emptySquares = this.getEmptySquares();
        // Randomly generate index of 1 or 2 (1 = tile '2', 2 = tile '4')
        const index = Math.floor(Math.random() * 2) + 1;
        // Generate random location for tile in empty squares
        const location = Math.floor(Math.random() * emptySquares.length);
        // Add new tile to board
        emptySquares[location].index = index;
    }
    // Resets all tiles to 'not combined this turn' status ready for next turn
    resetHasCombinedFlags() {
        this.tiles.forEach(tile => {
            tile.hasCombinedThisTurn = false;
        });
    }

    // Check board for any spaces left and combinable tiles
    isGameOver() {
        for (let i = 0; i < this.tiles.length; i++) {
            let tile = this.tiles[i];
            // Check for empty space
            if (tile.index == 0) {
                return false;
            }

            // If not right hand column, check tile to right for same value
            if (i % 4 != 3) {
                if (tile.index == this.tiles[i + 1].index) {
                    return false;
                }
            }
            // If not bottom row, check tile below for same value
            if (i < 12) {
                if (tile.index == this.tiles[i + 4].index) {
                    return false;
                }
            }
        }
        return true;
    }

    displayGameOver() {
        alert("GAME OVER!");
    }
}

function keyDownHandler(event) {

    if (event.keyCode == UP_ARROW) {
        board.move(UP);
    }
    if (event.keyCode == DOWN_ARROW) {
        board.move(DOWN);
    }
    if (event.keyCode == LEFT_ARROW) {
        board.move(LEFT);
    }
    if (event.keyCode == RIGHT_ARROW) {
        board.move(RIGHT);
    }
}


const canvas = document.querySelector("#game-canvas");

let board = new Board(canvas);
document.addEventListener("keydown", keyDownHandler, false);

newGameButton.addEventListener("click", function () { board.setup(); board.draw(); }, false);

board.draw();



/*
NEXT STEPS:
===========

1. Create a nicer game over message!
2. Implement swipe controls for touch enabled devices
*/
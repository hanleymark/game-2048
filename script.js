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

// Declare constructor for pairs foreground background colours for tiles
class ColourPair {
    constructor(foreground, background) {
        this.foreground = foreground;
        this.background = background;
    }
}

// Set up WCAG compliant colour pair values
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

// Tile constructor function
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

class Board {
    constructor(canvas) {
        this.tiles = new Array(16);
        this.canvas = canvas;
        this.setup();
    }

    // Fill board with empty tiles
    clearBoard() {
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i] = new Tile(EMPTY_TILE);
        }
    }

    setup() {
        this.clearBoard();

        for (let i = 0; i < 2; i++) {
            this.placeRandomTile();
        }
    }

    getEmptySquares() {
        let emptySquares = [];
        this.tiles.forEach(tile => {
            if (tile.index == EMPTY_TILE) {
                emptySquares.push(tile);
            }
        });
        return emptySquares;
    }

    draw() {
        let canvasWidth = this.canvas.width;
        let tileWidth = (canvasWidth / 4) * 0.95;
        let gap = (canvasWidth / 4) * 0.05;
        let xPos = 0;
        let yPos = 0;
        let x = 0;
        let y = 0;

        let context = this.canvas.getContext("2d");

        for (let i = 0; i < this.tiles.length; i++) {
            let tile = this.tiles[i];
            if (tile != null) {
                // Calculate xPos and yPos positions of tile based on tiles array index
                xPos = i % 4;
                yPos = Math.floor(i / 4);
                // Calculate 2D context coordinates of tile
                x = (xPos * (tileWidth + gap));
                y = (yPos * (tileWidth + gap));


                context.font = "18px sans";
                context.beginPath();
                context.rect(x, y, tileWidth, tileWidth);
                context.fillStyle = tile.colourPair.background;
                context.fill();
                context.fillStyle = tile.colourPair.foreground;
                context.fillText(tile.text, x + 3, y + 30);
                context.closePath();
            }
        }
    }


    move(direction) {
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

        let tileMovesThisTurn = 0;

        for (let i = 0; i < tileMoveOrder.length; i++) {

            let tileIndex = tileMoveOrder[i];
            let tileFrom = this.tiles[tileIndex];

            if (tileFrom.index == EMPTY_TILE) {
                continue;
            }

            // Calculate number of moves needed using position in tileMoveOrder array
            let numberOfMoves = Math.floor(i % 3) + 1;

            for (let m = 0; m < numberOfMoves; m++) {
                let tileTo = this.tiles[tileIndex + direction];
                tileFrom = this.tiles[tileIndex]

                if (tileTo.index == EMPTY_TILE) {
                    this.swapTiles(tileIndex, tileIndex + direction);
                    tileIndex += direction;
                    tileMovesThisTurn++;
                }
                else if ((tileFrom.index == tileTo.index) && tileFrom.hasCombinedThisTurn == false) {
                    tileFrom.index += 1;
                    tileFrom.hasCombinedThisTurn = true;
                    tileTo.index = 0;
                    this.swapTiles(tileIndex, tileIndex + direction);
                    tileIndex += direction;
                    tileMovesThisTurn++;
                }
                else break;
            }
        }
        this.resetHasCombinedFlags();

        if (tileMovesThisTurn > 0) {
            this.placeRandomTile();
        }
        this.draw();
    }

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

    resetHasCombinedFlags() {
        this.tiles.forEach(tile => {
            tile.hasCombinedThisTurn = false;
        });
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
board.draw();

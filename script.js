let EMPTY_TILE = 0;

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
    }
    // Getter for 'text' property to be displayed on the tile (index of 0 is empty tile so no text)
    get text() {
        if (this.index == EMPTY_TILE) {
            return "";
        }
        return `${2 ** (this.index)}`;
    }

    getColourPair() {
        return colourPairLookups(i);
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

        let emptySquares = [];
        for (let i = 0; i < 2; i++) {
            // Get array of empty squares
            emptySquares = this.getEmptySquares();
            // Randomly generate index of 1 or 2 (1 = tile '2', 2 = tile '4')
            const index = Math.floor(Math.random() * 2) + 1;
            // Generate random location for tile in empty squares
            const location = Math.floor(Math.random() * emptySquares.length);
            // Add new tile to board
            emptySquares[location].index = index;
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
        let xPos, yPos;
        let x, y;

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
                context.fillStyle = colourPairs[tile.index].background;
                context.fill();
                context.fillStyle = colourPairs[tile.index].foreground;
                context.fillText(tile.text, x + 3, y + 30);
                context.closePath();
            }
        }
    }


    move(direction) {
        ;
    }
}

const canvas = document.querySelector("#game-canvas");

let board = new Board(canvas);

board.draw();
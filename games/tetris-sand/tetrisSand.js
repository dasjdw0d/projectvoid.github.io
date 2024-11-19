let tiles;
fetch('tiles.json').then(response => response.json()).then(data => tiles = data);

const TILESIZE = 13;
const GRIDWIDTH = 100;
const GRIDHEIGHT = 160;
const SQUARESIZE = 5;

let globalScore = 0;

class SandParticle {
    
    constructor(x, y, colour, size, type){
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.size = size;
        this.isVisited = false;
        this.toBeRemoved = false;
        this.type = type
        this.flashing = false;
    }

    draw(){
        if (this.flashing){
            fill(255);
        } else {
            fill(this.colour);
        }

        // if (this.isVisited){
        //     fill(255);
        // }
        rect(this.x*this.size, this.y*this.size, this.size, this.size);
        
    }
}

class SandGrid {
    constructor(WIDTH, HEIGHT, size){
        this.width = WIDTH; 
        this.height = HEIGHT;
        this.grid = [...Array(this.height)].map(e => Array(this.width));
        this.size = size;
        this.justRemoved = false;
    }

    draw(){
        background(100,100,100);
        rectMode(CORNER);
        // stroke(0, 0, 0);
        for (let i = 0; i < this.height; i++){
            for (let j = 0; j < this.width; j++){
                if (this.grid[i][j] != undefined){
                    this.grid[i][j].draw();
                }
            }
        }
    }

    update(){
        let anyMoved = false;
        for (let i = this.height-2; i >= 0; i--){
            for (let j = 0; j < this.width; j++){
                if (this.grid[i][j] != undefined){
                    if (this.grid[i+1][j] == undefined){
                        this.grid[i][j].y++;
                        this.grid[i+1][j] = this.grid[i][j];
                        this.grid[i][j] = undefined;
                        anyMoved = true;
                    } else {

                        let order = random();
                        if (order < 0.5){
                            if (j < this.width-1 && this.grid[i+1][j+1] == undefined){
                                this.grid[i][j].y++;
                                this.grid[i][j].x++;
                                this.grid[i+1][j+1] = this.grid[i][j];
                                this.grid[i][j] = undefined;
                                anyMoved = true;
                            } else if (j > 0 && this.grid[i+1][j-1] == undefined) {
                                this.grid[i][j].y++;
                                this.grid[i][j].x--;
                                this.grid[i+1][j-1] = this.grid[i][j];
                                this.grid[i][j] = undefined;
                                anyMoved = true;
                            }
                        } else {
                            if (j > 0 && this.grid[i+1][j-1] == undefined) {
                                this.grid[i][j].y++;
                                this.grid[i][j].x--;
                                this.grid[i+1][j-1] = this.grid[i][j];
                                this.grid[i][j] = undefined;
                                anyMoved = true;
                            } else if (j < this.width-1 && this.grid[i+1][j+1] == undefined){
                                this.grid[i][j].y++;
                                this.grid[i][j].x++;
                                this.grid[i+1][j+1] = this.grid[i][j];
                                this.grid[i][j] = undefined;
                                anyMoved = true;
                            } 
                        }
                    }
                }
            }
        }
        if (anyMoved == false){

            for (let i = 0; i < this.grid.length; i++){
                for (let j = 0; j < this.grid[0].length; j++){
                    if (this.grid[i][j] == undefined){
                        continue;
                    }
                    this.grid[i][j].isVisited = false;
                }
            }
            
            for (let i = 0; i < this.grid.length; i++){
                if (this.grid[i][0] == undefined){
                    continue;
                }
                let nextTiles = [this.grid[i][0]];
                let visitedTiles = [];
                let hasFound = false;

                while (nextTiles.length != 0){
                    let currentTile;

                    currentTile = nextTiles.pop();
                    currentTile.isVisited = true;
                    visitedTiles.push(currentTile);
                    if (currentTile.x == GRIDWIDTH-1){
                        hasFound = true;
                    }
                    let thisRound = []
                    if (currentTile.x > 0){
                        thisRound.push(this.grid[currentTile.y][currentTile.x-1]);
                    }
                    
                    if (currentTile.x < GRIDWIDTH-1){
                        thisRound.push(this.grid[currentTile.y][currentTile.x+1]);
                    }
                    if (currentTile.y > 0){
                        thisRound.push(this.grid[currentTile.y-1][currentTile.x]);
                    }
                    if (currentTile.y < GRIDHEIGHT-1){
                        thisRound.push(this.grid[currentTile.y+1][currentTile.x]);
                    }

                    while (thisRound.length > 0){
                        let nextTile = thisRound.pop();
                        if (nextTile != undefined && nextTile.isVisited == false && nextTile.type == this.grid[i][0].type){
                            nextTiles.push(nextTile);
                        }
                    }
                }
                if (hasFound){
                    console.log(this.grid[i][0].type)
                    for (let i = 0; i < visitedTiles.length; i++){
                        visitedTiles[i].toBeRemoved = true;
                        // this.grid[visitedTiles[i].y][visitedTiles[i].x] = undefined; // REMOVE THIS FOR BETTER REMOVE ANIMNATION.
                    }
                    return true;  // Do not remove any other tiles, removes excess computation. 
                }


            }
        }
        return false;
        
    }

    addParticle(i,j,colour, type){
        if (i < 0 || i >= this.width || j < 0 || j >= this.height){
            return;
        }
        this.grid[j][i] = new SandParticle(i,j,colour,SQUARESIZE, type);
    }

    isEmpty(x, y){
        if (x < 0 || x >= this.width || y <= 0 || y >= this.height-1){
            return false;
        }
        if (this.grid[y][x] == undefined){
            return true;
        }
        return false;
    }

    flash(num){
        if (num % 2 == 0){
            for (let i = 0; i < this.width; i++){
                for (let j = 0; j < this.height; j++){
                    if (this.grid[j][i] != undefined&& this.grid[j][i].toBeRemoved){
                        this.grid[j][i].flashing = true;
                    }
                }
            }
        } else {
            for (let i = 0; i < this.width; i++){
                for (let j = 0; j < this.height; j++){
                    if (this.grid[j][i] != undefined&& this.grid[j][i].toBeRemoved){
                        this.grid[j][i].flashing = false;
                    }
                }
            }
        }
    }

    removeDeleted(){
        for (let i = 0; i < this.width; i++){
            for (let j = 0; j < this.height; j++){
                if (this.grid[j][i] != undefined&& this.grid[j][i].toBeRemoved){
                    this.grid[j][i] = undefined
                    globalScore++;
                }
            }
        }
    }

}

class TileGrid {
    constructor(WIDTH, HEIGHT, size){
        this.width = WIDTH;
        this.height = HEIGHT;
        this.size = size;
        this.currentTile = [];
        this.currentType = '';
        this.currentRotation = 0;
        this.centerPos = []
    }

    moveTile(currentGrid){
        if (this.currentTile.length == 0){
            return;
        }
        let isTrue = false;
        for (let i = 0; i < this.currentTile.length; i++){
            if (!currentGrid.isEmpty(this.currentTile[i][0], this.currentTile[i][1]+1)){
                isTrue = true;
            }
        }
        if (!isTrue){
            for (let i = 0; i < this.currentTile.length; i++){
                this.currentTile[i] = [this.currentTile[i][0], this.currentTile[i][1]+1,this.currentTile[i][2]];
            }
        }
        this.centerPos[1]++;
        return isTrue;
    }

    update(currentGrid){
        if (this.moveTile(currentGrid)){
            let current;
            while (this.currentTile.length != 0){
                current = this.currentTile.pop();
                currentGrid.addParticle(current[0], current[1], current[2], this.currentType);
            }
            return true;
        }
        return false;
    }

    toGrid(type, rotation, xOff, yOff){
        let retval = [];
        let tile = tiles[type][rotation];
        let colour = tiles["colours"][type]
        for (let i = 0; i < 4; i++){
            for (let j = 0; j < 4; j++){
                if (tile[i][j] != 0){
                    for (let k = 0; k < TILESIZE; k++){
                        for (let h = 0; h < TILESIZE; h++){
                            let index = 2-min(h,k,TILESIZE-h-1,TILESIZE-k-1);
                            if (index < 0){
                                index = 0;
                            }
                            retval.push([i*TILESIZE+k+xOff, j*TILESIZE+h+yOff,colour[index]]); // change colour based off distance from center.
                        }
                    }
                }
            }
        }
        return retval;
    }
    
    draw(){
        for (let i = 0; i < this.currentTile.length; i++){
            fill(this.currentTile[i][2])
            rect(this.currentTile[i][0]*this.size, this.currentTile[i][1]*this.size, this.size,this.size)
        }
    }

    addTile(x, y, type, grid){ // start at top left
        this.centerPos = [x,y];
        this.currentTile = []
        this.currentType = type;
        this.currentRotation = 0;
        this.currentTile = this.toGrid(type, 0, x, y);
        for (let i = 0; i < this.currentTile.length; i++){
            if (grid.grid[this.currentTile[i][1]][this.currentTile[i][0]] != undefined){
                return false;
            }
        }
        return true;
    }

    moveLeft(){
        if (this.currentTile.filter(a => a[0] == 0).length > 0){
            return;
        }
        this.currentTile = this.currentTile.map(a => [a[0]-1, a[1], a[2]]);
        this.centerPos[0]--;
    }

    moveRight(){
        if (this.currentTile.filter(a => a[0] == (GRIDWIDTH-1)).length > 0){
            return;
        }
        this.currentTile = this.currentTile.map(a => [a[0]+1, a[1], a[2]]);
        this.centerPos[0]++;
    }

    rotateTile(grid){
        let newTile = this.toGrid(this.currentType, ++this.currentRotation % 4, this.centerPos[0], this.centerPos[1]);
        if (newTile.filter(a => {
            return (a[0] < 0 || a[0] >= GRIDWIDTH || a[1] < 0 || a[1] >= GRIDHEIGHT);
        }).length > 0){
            return;
        }

        if (newTile.filter(a => {
            return (grid.grid[a[1]][a[0]] != undefined);
        }).length > 0){
            return;
        }
        this.currentTile = newTile;
    }
}

let grid;
let tileGrid;
let holdCount = 0;
let deletedCount = -1;
function setup(){
    createCanvas(500,800);
    grid = new SandGrid(GRIDWIDTH, GRIDHEIGHT, SQUARESIZE);
    tileGrid = new TileGrid(GRIDWIDTH,GRIDHEIGHT,SQUARESIZE);
}

function draw(){
    frameRate(40)
    noStroke();
    grid.draw();
    if (deletedCount == -1 && grid.update()){
        deletedCount++;
    };
    tileGrid.draw();
    if (deletedCount > -1){
        if (frameCount%3 == 0){
            deletedCount++;

            grid.flash(deletedCount);
        }
        if (deletedCount == 10){
            grid.removeDeleted();
            deletedCount = -1;
        }
    }else if (holdCount == 20){
        if (!tileGrid.addTile(floor(GRIDWIDTH/3), 0, ["L","T","I","J","O","Z","S"][parseInt(random(7))], grid)){
            // GAME OVER
            textSize(32);
            textAlign(CENTER, CENTER);
            text("GAME OVER: Score " + globalScore, width/2, height/3);

            noLoop();
        };
        holdCount++;
    } else if (holdCount == 50){
        if (tileGrid.update(grid)){
            // Tile has been converted. Display new tile for 10 frames then begin updating.
            holdCount = 0;
        };
    } else {
        holdCount++;
    }
    
    if (keyIsDown(LEFT_ARROW)){
        tileGrid.moveLeft();
    } else if (keyIsDown(RIGHT_ARROW)){
        tileGrid.moveRight();
    } else if (keyIsDown(DOWN_ARROW)){
        if (tileGrid.update(grid)){
            // Tile has been converted. Display new tile for 10 frames then begin updating.
            holdCount = 0;
        };
    }
}

function keyPressed(){
    if (key == "ArrowUp"){
        tileGrid.rotateTile(grid);
    }
}
let canvas; //refrence to game canvas
let ctx; //ctx context will provide refrence to game functions
let gBArrayHeight = 20; //20 squares down the canvas
let gBArrayWidth = 12; //12 squares across array
let startX = 4;
let startY = 0; //where the tertromino will be drawn on the canvas
/*
Coordinate Array will set our array equal to gBArraHeight and 
gNArrayWidth to draw our squares for the terominos
*/
let score = 0; //game score
let level = 1; //level
let winOrLose = "Playing"; //win lose condition
let tetrisLogo; //tetris logo
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));
let curTetromino = [[1,0], [0,1], [1,1], [2,1]]; //shape storage in multi array

/*
tetromino and tetrominoColors will hold all of the teromino shapes
and complementing colors for the figures that will be drawn on to the
game canvas
*/
let tetrominos = [];
let tetrominoColors = ['purple', 'cyan', 'blue', 'yellow', 'orange', 'green', 'red'];
let curTetrominoColor; //what color the tertromino will hold

let gameBoardArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

let stoppedShapeArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

//key press direction for terominos
let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;




//coordinate array class for drawing tetrominos
class Coordinates{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

//event listener to begin drawing the canvas content upon loading page
document.addEventListener('DOMContentLoaded', SetupCanvas);


function CreateCoordArray(){
    let xR = 0, yR = 19;
    //values to populate array
    let i = 0, j = 0;

    //loop to populate array vertically and horizontally
    for(let y = 9; y <= 446; y += 23){
        for(let x = 11; x <= 264; x += 23){
            coordinateArray[i][j] = new Coordinates(x, y); //new array coordinate values
            i++;
        }
        j++;
        i = 0;
    }
}



//function to set up the game canvas
function SetupCanvas(){
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;

    //zoom elements for browser
    ctx.scale(2,2);

    //draw in canvas background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //drawing the game board
    ctx.strokeStyle = 'black';
    ctx.strokeRect(8, 8, 280, 462);

    //draws tetris logo on canvas
    tetrisLogo = new Image(161, 54);
    tetrisLogo.onload = DrawTetrisLogo;
    tetrisLogo.src = "tetrislogo.png"

    //score board
    ctx.fillStyle = 'black';
    ctx.font = '21px Arial';
    ctx.fillText("SCORE", 300, 98);

    ctx.strokeRect(300, 107, 161, 24);

    ctx.fillText(score.toString(), 310, 127);

    ctx.fillText("LEVEL", 300, 157);
    ctx.strokeRect(300, 171, 161, 24);
    ctx.fillText(level.toString(), 310, 190);

    ctx.fillText("WIN / LOSE", 300, 221);
    ctx.fillText(winOrLose, 310, 261);
    ctx.strokeReact(300, 232, 161, 95);
    ctx.fillText("CONTROLS", 300, 354);
    ctx.strokeRect(300, 366, 161, 104);
    ctx.font = '19px Arial';
    ctx.fillText("A: Move Left", 310, 388);
    ctx.fillText("D: Move Right", 310, 413);
    ctx.fillText("S: Move Down", 310, 438);
    ctx.fillText("E: Rotate Right", 310, 463);

    //keyboard press reaction
    document.addEventListener('keydown', HandleKeyPress);
    CreateTetrominos();
    CreateTetromino();

    CreateCoordArray();
    DrawTetromino();
}



//function to draw tetris logo
function DrawTetrisLogo(){
    ctx.drawImage(tetrisLogo, 300, 8, 161, 54);
}



//draw teromino function
function DrawTetromino(){
    for(let i = 0; i < curTetromino.length; i++){
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        //mark square in specific pos
        gameBoardArray[x][y] = 1;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        //fills tetromino will specific color
        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, 21, 21);

    }

}



//key press function
/*
A = LEFT, keyCode = 65
D = RIGHT, keyCode = 68
S = DOWN, keyCode = 83
*/
function HandleKeyPress(key){
    //situational for player movement
    //and adjusting tetromino accordingly
    if(winOrLose != "Game Over"){
        if(key.keyCode === 65){
            direction = DIRECTION.LEFT;
            if(!HittingTheWall() && !CheckForHorizontalCollision()){
                DeleteTetromino();
                startX--;
                DrawTetromino();
            }
        } else if(key.keyCode === 68){
            direction = DIRECTION.RIGHT;
            if(!HittingTheWall() && !CheckForHorizontalCollision()){
                DeleteTetromino();
                startX++;
                DrawTetromino();
            }
        } else if(key.keyCode === 83){
            MoveTetrominoDown();
        } else if(key.keyCode === 69){
            RotateTetromino();
        }
    }
}




//down movement function
function MoveTetrominoDown(){
    direction = DIRECTION.DOWN;
    if(!CheckForVerticalCollision()){
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }

}



//function for speed of tetromino
window.setInterval(function(){
    if(winOrLose != "Game Over"){
        MoveTetrominoDonw();
    }
}, 1000);



//function to delete tetromino squares
function DeleteTetromino(){
    for(let i = 0; i < curTetrominoColor.length; i++){
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 0;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = 'white';
        ctx.fillRect(coorX, coorY, 21, 21);

    }
}



//function to store all possible tetromino shapes
function CreateTetrominos(){
    //T shape
    tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
    //I shape
    tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
    //J shape
    tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
    //Square shape
    tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
    //L shape
    tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
    //S shape
    tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
    //Z shape
    tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);

}



//function to create random tetromino
function CreateTetromino(){
    //uses random function to get random number equal to 
    //tetromino array size length
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    //sets curTetromino
    curTetromino = tetrominos[randomTetromino];
    curTetrominoColor = tetrominoColors[randomTetromino];
}



//prevents player pasing the wall horizontally
function HittingTheWall(){
    for(let i = 0; i < curTetromino.length; i++){
        let newX = curTetromino[i][0] + startX;
        if(newX <= 0 && direction === DIRECTION.LEFT){
            return true;
        } else if(newX >= 11 && direction === DIRECTION.RIGHT){
            return true;
        }  
    }
    return false;
}



//checks for vertical collision
function CheckForVerticalCollision(){
    let tetrominoCopy = curTetromino;
    let collision = false;
    for(let i = 0; i < tetrominoCopy.length; i++){
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        if(direction == DIRECTION.DOWN){
            y++;
        }
        if(typeof stoppedShapeArray[x][y+1] === 'string'){
            DeleteTetromino();
            startY++;
            DrawTetromino();
            collision = true;
            break;
        }
        if(y >= 20){
            collision = true;
            break;
        }
        //collision condition due to playing/lose
        if(collision){
            if(startY <= 2){
                winOrLose = "Game Over";
                ctx.fillStyle = 'white';
                ctx.fillRect(310, 242, 140, 30);
                ctx.fillStyle = 'black';
                ctx.fillText(winOrLose, 310, 261);
            } else{
                for(let i = 0; i < tetrominoCopy.length; i++){
                    let square = tetrominoCopy[i];
                    let x = square[0] + startX;
                    let y = square[1] + startY;
                    stoppedShapeArray[x][y] = curTetrominoColor;
                }
                CheckForCompletedRows();
                CreateTetromino();
                direction = DIRECTION.IDLE;
                startX = 4;
                startY = 0;
                DrawTetromino();
            }
        }
    }
}



//horziontal collision function
function CheckForHorizontalCollision(){
    let tetrominoCopy = curTetromino;
    let collision = false;
    for(let i = 0; i < tetrominoCopy.length; i++){
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;

        if(direction === DIRECTION.LEFT){
            x--;
        } else if(direction === DIRECTION.RIGHT){
            x++;
        }
        var stoppedShapeVal = stoppedShapeArray[x][y];
        if(typeof stoppedShapeVal === 'string'){
            collision = true;
            break;
        }
    }
    return collision;
}


function CheckForCompletedRows(){
    let rowsToDelete = 0;
    let startOfDeletion = 0;
    for(let y = 0; y < gBArrayHeight; y++){
        let completed = true;
        for(let x = 0; x < gBArrayWidth; x++){
            let square = stoppedShapeArray[x][y];
            if(square === 0 || (typeof square === 'undefined')){
                completed = false;
                break;
            }
        }

        if(completed){
            if(startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;
            for(let i = 0; i < gBArrayWidth; i++){
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;
                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
            
        }
    }

    if(rowsToDelete > 0){
        score += 10;
        ctx.fillStyle = 'white';
        ctx.fillRect(310, 109, 140, 19);
        ctx.fillStyle = 'black';
        ctx.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }
}



//function to move all rows down upon deletion from getting a tertis
function MoveAllRowsDown(rowsToDelete, startOfDeletion){
    for(var i = startOfDeletion - 1; i >= 0; i--){
        for(var x = 0; x , gBArrayWidth; x++){
            var y2 = i + rowsToDelete;
            var square = stoppedShapeArray[x][i];
            var nextSquare = stoppedShapeArray[x][y2];
            if(typeof square === 'string'){
                nextSquare = square;
                gameBoardArray[x][y2];
                stoppedShapeArray[x][y2] = square;
                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = nextSquare;
                ctx.fillRect(coorX, coorY, 21, 21);

                square = 0;
                gameBoardArray[x][i] = 0;
                stoppedShapeArray[x][i] = 0;
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);

            }
        }
    }
}




//rotating the terominos
function RotateTetromino(){
    let newRotation = new Array();
    let tetrominoCopy = curTetromino;
    let curTetrominoBU;
    for(let i = 0; i < tetrominoCopy.length; i++){
        curTetrominoBU = [...curTetromino];
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }
    DeleteTetromino();
    try{
        curTetromino = newRotation;
        DrawTetromino();
    }
    catch(e){
        if(e instanceof TypeError){
            curTetromino = curTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }

}



//function to get last previous drawn square
function GetLastSquareX(){
    let lastX = 0;
    for(let i = 0; i < curTetromino.length; i++){
        let square = curTetromino[i];
        if(square[0] > lastX){
            lastX = square[0];
        }
    }
    return lastX;
}
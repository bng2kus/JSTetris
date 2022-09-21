let canvas;
let ctx;
let gBArrayHeight = 20; //array shape height
let gBArrayWidth = 12; //array shape width
let startX = 4; //starting pos for x
let startY = 0; //starting pos for y
let score = 0; //game score
let level = 1; //game level
let winOrLose = "Playing";

let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

let curTetromino = [[1,0], [0,1], [1,1], [2,1]];

let tetrominos = []; //array to hold all tetrominos 
let tetrominoColors = ['purple','cyan','blue','yellow','orange','green','red']; //tetromino colors
let curTetrominoColor; //holds the current tetromino color

let gameBoardArray = [...Array(20)].map(e => Array(12).fill(0)); //gameboard array to identify other squares

let stoppedShapeArray = [...Array(20)].map(e => Array(12).fill(0)); //array for stopped shapes



let highScore = 0; //highscore
let speed = 1; //speed of tetromino
let levelUp = 20; //level up threshold
let timer;  //timer to clear interval
let isPaused = false; //pause button



localStorage.setItem('highscore', 0);
if (localStorage.getItem('highscore')){
    highScore = localStorage.getItem('highscore');
} 
else{
    localStorage.setItem('highscore', 0);
}

//directional movement for tracking shape and for collision detection
let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;

let KEYS = {
    LEFT: 65,
    RIGHT: 68,
    DOWN: 83,
    ROTATE: 87,
    PAUSE: 80
}


//coordinate array class for drawing tetrominos
class Coordinates{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

//event listener that sets up canvas upon loading screen
document.addEventListener('DOMContentLoaded', SetupCanvas);


function CreateCoordArray(){
    let xR = 0, yR = 19;
    let i = 0, j = 0;

    for (let y = 9; y <= 446; y += 23){
        for (let x = 11; x <= 264; x += 23){
            coordinateArray[i][j] = new Coordinates(x, y);
            i++;
        }
        j++;
        i = 0;
    }
}

function SetupCanvas(){
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;

    //zoom elements for browser
    ctx.scale(2, 2);

    //draw in canvas background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //drawing the game board
    ctx.strokeStyle = 'white';
    ctx.strokeRect(8, 8, 280, 462);

    //draws tetris logo onto canvas
    tetrisLogo = new Image(160, 54);
    tetrisLogo.onload = DrawTetrisLogo;
    tetrisLogo.src = "tetrislogo.png";

    //score board
    ctx.fillStyle = 'white';
    ctx.font = '21px Arial';
    ctx.fillText("HIGHSCORE", 300, 100);


    ctx.strokeRect(300, 105, 160, 25);
    ctx.fillText(highScore.toString(), 305, 125);

    //draw score rectangle
    ctx.fillText("SCORE", 300, 155);
    ctx.strokeRect(300, 160, 160, 25);
    ctx.fillText(score.toString(), 305, 180);

    //draw level label and rectangle
    ctx.fillText("LEVEL", 300, 210);
    ctx.strokeRect(300, 215, 160, 25);
    ctx.fillText(level.toString(), 305, 235);

    //next level label
    ctx.fillText("WIN / LOSE", 300, 265);
    ctx.strokeRect(300, 270, 160, 25);
    ctx.fillText(winOrLose, 305, 288);

    //control label text and rectangle
    ctx.fillText("CONTROLS", 300, 335);
    ctx.strokeRect(300, 341, 160, 129);
    ctx.font = '19px Arial';
    ctx.fillText("A: Move Left", 305, 363);
    ctx.fillText("D: Move Right", 305, 388);
    ctx.fillText("S: Move Down", 305, 413);
    ctx.fillText("W: Rotate Right", 305, 438);
    ctx.fillText("P: Pause", 305, 463);

    //keyboard press reaction
    document.addEventListener('keydown', HandleKeyPress);
    CreateTetrominos();
    CreateTetromino();

    CreateCoordArray();
    DrawTetromino();
}



//function to draw tetris logo
function DrawTetrisLogo(){
    ctx.drawImage(tetrisLogo, 300, 8, 160, 54);
}



//draw tetromino function
function DrawTetromino(){
    //cycles through x and y array for tetromino value
    for (let i = 0; i < curTetromino.length; i++){
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        //put tetromino shape in game array
        gameBoardArray[x][y] = 1;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
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
// We also delete the previously drawn shape and draw the new one
function HandleKeyPress(e){
    if (winOrLose != "Game Over"){
        let key = e.keyCode;
        //LEFT
        if (key === KEYS.LEFT && !isPaused){
            direction = DIRECTION.LEFT;//HIT DETECTION
            if (!HittingTheWall() && !CheckForHorizontalCollision()){
                DeleteTetromino();
                startX--;
                DrawTetromino();
            }
        //RIGHT
        } else if (key === KEYS.RIGHT && !isPaused){
            direction = DIRECTION.RIGHT;
            if (!HittingTheWall() && !CheckForHorizontalCollision()){
                DeleteTetromino();
                startX++;
                DrawTetromino();
            }
        //DOWN
        } else if (key === KEYS.DOWN && !isPaused){
            MoveTetrominoDown();
        } else if (key === KEYS.ROTATE && !isPaused){
            RotateTetromino();

            //PAUSE
        } else if (key === KEYS.PAUSE){
            isPaused = !isPaused;
        }
    }
}



//down movement
function MoveTetrominoDown(){
    direction = DIRECTION.DOWN;
    if (!CheckForVerticalCollison()){
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }
}



//function to call tetromino to screen every second
function setSpeed(speed){
    timer = window.setInterval(() =>{
        if (!isPaused){
            if (winOrLose != "Game Over"){
                MoveTetrominoDown();
            }
        }
    }, 1000 / speed);
}

//sets speed
setSpeed(speed);




//function to clear tetromino squares
function DeleteTetromino() {
    for (let i = 0; i < curTetromino.length; i++){
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 0;
        //draws white over where the old squares were
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = 'black';
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}




//Generate all possible tetromino shapes
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
    //z shape
    tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}




//creates random tetromino
function CreateTetromino(){
    //uses random function to get random number equal to 
    //tetromino array size length
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    //set shape
    curTetromino = tetrominos[randomTetromino];
    //set color
    curTetrominoColor = tetrominoColors[randomTetromino];
}





//prevents players from passing the canvas wall
function HittingTheWall(){
    for (let i = 0; i < curTetromino.length; i++){
        let newX = curTetromino[i][0] + startX;
        if (newX <= 0 && direction === DIRECTION.LEFT){
            return true;
        } else if (newX >= 11 && direction === DIRECTION.RIGHT){
            return true;
        }
    }
    return false;
}




//check for vertical collison
function CheckForVerticalCollison(){
    //checks for collisions before moving real tetromino
    let tetrominoCopy = curTetromino;
    let collision = false;
    // Cycle through all Tetromino squares
    for (let i = 0; i < tetrominoCopy.length; i++){
        //position to check for collisions
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        //if I'm moving down increment y to check for a collison
        if (direction === DIRECTION.DOWN){
            y++;
        }
        //chekc weather I will hit a set piece
        if (typeof stoppedShapeArray[x][y + 1] === 'string'){
            //if yes delete tetromino
            DeleteTetromino();
            //increment to put in place and draw
            startY++;
            DrawTetromino();
            collision = true;
            break;
        }
        if (y >= 20){
            collision = true;
            break;
        }
    }
    //collision check
    if (collision){
        //g=state for gaem over
        if (startY <= 2) {
            winOrLose = "Game Over";
            ctx.fillStyle = 'black';
            ctx.fillRect(305, 272, 140, 22);
            ctx.fillStyle = 'white';
            ctx.fillText(winOrLose, 305, 288);
        } else {
            for (let i = 0; i < tetrominoCopy.length; i++){
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                stoppedShapeArray[x][y] = curTetrominoColor;
            }
            //checks for completed rows
            CheckForCompletedRows();
            CreateTetromino();
            //creates next tetromino in place of previous
            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            DrawTetromino();
        }

    }
}




//horizontal collision function
function CheckForHorizontalCollision(){
    var tetrominoCopy = curTetromino;
    var collision = false;
    // Cycle through all Tetromino squares
    for (var i = 0; i < tetrominoCopy.length; i++){
        //moves new square based on upper left coordiantes
        var square = tetrominoCopy[i];
        var x = square[0] + startX;
        var y = square[1] + startY;
        //move tetromino clone square into directed position
        if (direction == DIRECTION.LEFT){
            x--;
        } else if (direction == DIRECTION.RIGHT){
            x++;
        }
        //get stopped square
        var stoppedShapeVal = stoppedShapeArray[x][y];
        if (typeof stoppedShapeVal === 'string'){
            collision = true;
            break;
        }
    }
    return collision;
}





//check for completed rows
function CheckForCompletedRows(){
    //tracks where to start deleting row and 
    //how many rows will be deleted
    let rowsToDelete = 0;
    let startOfDeletion = 0;
    //checks for every row to see what is filled
    for (let y = 0; y < gBArrayHeight; y++){
        let completed = true;
        //cycle through x values
        for (let x = 0; x < gBArrayWidth; x++){
            //get values in stopped block array
            let square = stoppedShapeArray[x][y];
            //cehcks if nothing is there
            if (square === 0 || (typeof square === 'undefined')) {
                //if nothing is there than break
                completed = false;
                break;
            }
        }

        //in the case of a completed row
        if (completed) {
            //shifts down rows
            if (startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;
            //deletes lines
            for (let i = 0; i < gBArrayWidth; i++) {
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;
                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;
                //draw the deleted squares as black
                ctx.fillStyle = 'black';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
    if (rowsToDelete > 0){
        score += 10;
        //updates highscore
        if (score > localStorage.getItem('highscore')) {
            localStorage.setItem('highscore', score);
            ctx.fillStyle = 'black';
            ctx.fillRect(301, 109, 140, 20);
            ctx.fillStyle = 'white';
            ctx.fillText(score.toString(), 305, 125);
        }
        //update score
        ctx.fillStyle = 'black';
        ctx.fillRect(301, 162, 140, 20);
        ctx.fillStyle = 'white';
        ctx.fillText(score.toString(), 305, 180);
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
        //increments difficulty based on level
        if (score % levelUp == 0) {
            speed++;
            level++;
            ctx.fillStyle = 'black';
            ctx.fillRect(302, 218, 150, 20);
            ctx.fillStyle = 'white';
            ctx.fillText(level.toString(), 305, 235);
            clearInterval(timer);
            setSpeed(speed);
        }
    }
}

//move the rows down after deletion
function MoveAllRowsDown(rowsToDelete, startOfDeletion) {
    for (var i = startOfDeletion - 1; i >= 0; i--) {
        for (var x = 0; x < gBArrayWidth; x++) {
            var y2 = i + rowsToDelete;
            var square = stoppedShapeArray[x][i];
            var nextSquare = stoppedShapeArray[x][y2];

            if (typeof square === 'string') {
                nextSquare = square;
                gameBoardArray[x][y2] = 1;
                //draws color into stopped block
                stoppedShapeArray[x][y2] = square;

                //x and y values in lookup table
                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = nextSquare;
                ctx.fillRect(coorX, coorY, 21, 21);

                square = 0;
                gameBoardArray[x][i] = 0;
                stoppedShapeArray[x][i] = 0;
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                ctx.fillStyle = 'black';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}




//function to rotate tetromino shape
function RotateTetromino() {
    let newRotation = new Array();
    let tetrominoCopy = curTetromino;
    let curTetrominoBU;

    for (let i = 0; i < tetrominoCopy.length; i++) {
        //error handler for tetromino
        curTetrominoBU = [...curTetromino];
        //rotates shape based on x pos
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }

    DeleteTetromino();

    //try to draw the rotated shape
    try {
        curTetromino = newRotation;
        DrawTetromino();
    }
    //backup shape incase of error
    catch (e) {
        if (e instanceof TypeError) {
            curTetromino = curTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}




//function to stimulate shape roation
function GetLastSquareX() {
    let lastX = 0;
    for (let i = 0; i < curTetromino.length; i++) {
        let square = curTetromino[i];
        if (square[0] > lastX)
            lastX = square[0];
    }
    return lastX;
}
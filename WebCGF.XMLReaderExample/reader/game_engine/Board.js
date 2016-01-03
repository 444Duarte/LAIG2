/**
 * Class responsible for all the Board logics and display. 
 * @constructor
 * @param scene {MyScene} - scene
 * @param x {number} - The length of the board
 * @param y {number}- The width of the board
 */
function Board(scene, x,y,state){
    Object.call(this);

    this.scene = scene;
    this.x = x;
    this.y = y;
    this.dimensions = Vector.fromArray([x,0,y]);
    
    if(state == null)
        this.state = new BoardState([x,0,y]);
    else
        this.state = state;
        
    this.boardTable = new BoardDraw(scene, x,y);

    this.boardHistory=[];

    this.pieces = [];

    this.rewindIndex = 0;
    this.rewind = false;
};

/**
 * Stances that Board has the properties of a CGFobject. 
 */
Board.prototype = Object.create(Object.prototype);

/**
 * Creates a Board.
 */
Board.prototype.constructor = Board;



/**
 * Draw the board
 */
Board.prototype.display = function(time){
    if(this.rewind == true){
        this.rewindGame(time);
    }
    
    this.scene.pushMatrix();
        this.scene.translate(-this.boardTable.getLength()/2,0,-this.boardTable.getWidth()/2);
        this.boardTable.display();
        for(var i = 0; i < this.pieces.length; i++){
            this.pieces[i].display(time);
        }
    this.scene.popMatrix();
}

/**
 * Set the animations speed.
 * @param speed {string} - "slow", "normal", "fast" or "superfast".
 * @return {boolean} - false if it doesn't recognize the given speed. Else true.
 */
Board.prototype.setSpeed= function(speed){
    switch(speed){
        case "slow":
            this.speed = 10;
            break;
        case "normal":
            this.speed = 5;
            break;
        case "fast":
            this.speed = 2;
            break;
        case "superfast":
            this.speed = 1;
            break;
        default:
            console.erro("Selected speed doesn't exist");
            return false;
    }

    return true;
};

/**
 * Add a piece to the board
 * @param {number} player - player making the play 
 * @param {number} x - The x position where the piece will be placed 
 * @param {number} y - The y position where the piece will be placed
 * @return - true if the piece was correctly placed. False if there is already a piece in that position  
 */
Board.prototype.play= function(player,x,y){
    
    var board = this.dimensions.toArray();
    var position = [x,0,y];

    for(var i = 0; i < this.pieces.length; i++){
        if(this.pieces[i].boardPiecePosition.equals(Vector.fromArray(position))){
            console.error="There already is a piece in the position ("+x+","+y+")";
            return false;
        }
    }

    var piece = new Piece(this.scene, board, position, player, this.speed);
    if(piece == false)
        return false;
    this.pieces.push(piece);
    return true;
};

/**
 * Make a new play by giving the board a new state.
 * Executes the Board.prototype.switchBoards but as the oldBoard uses the current state of the board.
 * @param newBoard {BoardState} - new state of the board.
 * @param {boolean} - true if successful, else returns false.
 */
Board.prototype.newPlay= function(newBoard){
    return this.switchBoards(this.state, newBoard);
};

/**
 * Compare the two states and applies the differences. It then adds the oldBoard to the history and sets the newBoard as the current state.
 * @param oldBoard {BoardState} - board state with which will compare the new state.
 * @param newBoard {BoardState} - new state of the board.
 * @result {boolean} - false if there is a problem applying the differences. Else returns true.
 */
Board.prototype.switchBoards= function(oldBoard, newBoard){
    var differences = BoardState.boardDifferences(oldBoard, newBoard);
    for(var i = 0; i < differences.length; i++){
        if(!this.applyBoardDifference(differences[i]))
            return false;
    }

    this.boardHistory.push(oldBoard);
    this.state = newBoard;
    return true;
};

/**
 * Removes the visual representation of a piece from the board.
 * @param x {number} - x position of the piece in the board
 * @param y {number} - y position of the piece in the board
 * @return - false if there isn't a piece in that position. Else returs true
 */
Board.prototype.removeBoardPiece= function(x,y){
    var position = [x,0,y];
    for(var i = 0; i < this.pieces.length; i++){
        if(this.pieces[i].boardPiecePosition.equals(Vector.fromArray(position))){
            this.pieces.splice(i,1);
            return true;
        }
    }

    return false;
};

/**
 * Applies a difference in the board.
 * If the given difference is an empty cell removes a piece from the board in that position. If the difference is a new cell adds a piece to that position.
 * @param difference {array} - Each difference has the 3 elements. x - x coordinate on the board. y - y coordinate on the board. cell - new state of the position. See BoardState.prototype.boardDifferences for better understanding.
 * @result {boolean} - true if the operation is successful, else returns false.
 */
Board.prototype.applyBoardDifference= function(difference){
    if(difference.cell[1] == null || difference.cell[1] == 0){
        return this.removeBoardPiece(difference.x, difference.y);
    }else{
        return this.play(difference.cell[1],difference.x,difference.y); 
    }
};

/**
 * Starts the rewind state of the Board. The Board will start from the 
 * first element of the boardHistory and execute all the following states as if the game would be played again.
 * The animations speed increases from normal to fast.
 * @result {boolean} - False if the history is empty. Else returns true.
 */
Board.prototype.startRewind= function(){
    if(this.boardHistory[0] == null){
        console.error("There are no plays in the history that can be rewind");
        return false;
    }
    this.setSpeed("fast");
    
    if(this.boardHistory.indexOf(this.state) == -1)
        this.boardHistory.push(this.state);
    this.newPlay(this.boardHistory[0]);
    this.pieces =[];
    this.rewind = true;
    this.rewindIndex = 1;
    this.rewindInitTime = null;
};

/**
 * Stops the rewind state of the Board. 
 */
Board.prototype.stopRewind= function(){
    this.rewind = false;
}

/**
 * Handles the exchange of states during the rewind state.
 * @param time {number} - Current system time.
 * @return {boolean} - returns false if it finished rewind, else returns true.
 */
Board.prototype.rewindGame= function(time){
    if(this.rewindInitTime == null){
        this.rewindInitTime = time;
    }

    var seconds = (time- this.rewindInitTime)*1e-3;
    if(this.rewindIndex >= this.boardHistory.length){
        console.log("Finished rewind");
        return false;
    }

    if(seconds >= this.rewindIndex*this.speed){
        this.newPlay(this.boardHistory[this.rewindIndex]);
        this.rewindIndex++;  
    }
    return true;
};


/**
 * Goes to the boardHistory vector, removes the latest element and sets it as the current state
 * @return - Returns false if the boardHistory vector is empty, else returns true
 */
Board.prototype.undoPlay= function(){
    if(this.boardHistory.length == 0){
        console.error("You can't undo to an empty game");
        return false;
    }
    if(this.rewind){
        console.log("Can't undo after the game has finished");
    }
    
    var index = this.boardHistory.length - 1;
    this.switchBoards(this.state,this.boardHistory[index]);
    this.boardHistory.splice(index+1,1);
    this.boardHistory.splice(index,1);
    return true;
};
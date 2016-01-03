/**
 * Creates an empty board with the given dimensions.
 * @constructor
 * @param dimensions {array} - board dimensions 
 */
function BoardState(dimensions, board){
    Object.call(this);
    if(dimensions != null){
        this.dimensions = Vector.fromArray(dimensions);
    }else{
        this.dimensions = BoardState.getDimensionsFromState(board);
    }
    if(board != null)
        this.board = board;
    else
        this.board = this.createEmptyBoard(this.dimensions.x, this.dimensions.z);
};

/**
 * Stances that BoardState has the properties of a Object. 
 */
BoardState.prototype = Object.create(Object.prototype);

/**
 * Creates a BoardState.
 */
BoardState.prototype.constructor = BoardState;

/**
 * Create an empty board.
 * @param {number} x - The length of the board
 * @param {number} y - The width of the board
 */
BoardState.prototype.createEmptyBoard= function(x,y){
    var board=[];

    for(var i = 0; i < x; i++){
        var row = [];
        for(var j = 0; j < y; j++){
            var cell = [0,0];
            row.push(cell);
        }
        board.push(row);
    }

    return board;
};

BoardState.prototype.addPiece= function(x,y,player){
    this.board[x-1][y-1]=[0, player];
};

/**
 * Get the dimensions of the board according to the given a state.
 * @param state {array[array]} - state 
 */
BoardState.getDimensionsFromState= function(state){
    var x = state.length;
    var y = state[0].length;
    for(i = 0; i < x; i++){
        if(state[0].length != y){
            console.error("Board y length different accross x");
            return false;
        }
    }
    
    return new Vector(x,0,y);
};


/** 
 * Get the differences between the state of two boards.
 * @param oldBoard {BoardState} - oldBoard.
 * @param newBoard {BoardState} - newBoard.
 * @return {array} - differences. Each element of the array is a difference. Each difference has the 3 elements. x - x coordinate on the board. y - y coordinate on the board. cell - new state of the position. 
 * The cell element is an array[2]. The cell first element designates the position of the piece (1 - piece is normal, 2- the piece is inverted, 0- not designated). The second element is the player that has a piece in that position or 0 if the position is empty.  
 */
BoardState.boardDifferences= function(oldBoard, newBoard){
    if(oldBoard.dimensions.x != newBoard.dimensions.x || oldBoard.dimensions.z != newBoard.dimensions.z){
        console.error("Comparison between boards with different dimensions is not possible");
        return false;
    }

    var differences=[];
    
    for(var i = 0; i < oldBoard.dimensions.x; i++){

        for(var j = 0; j < oldBoard.dimensions.z; j++){
            if(oldBoard.board[i][j][1] == newBoard.board[i][j][1]){
                continue;
            }else{
                var diff = [];
                diff["x"] = i+1;
                diff["y"] = j+1;

                diff["cell"] = newBoard.board[i][j];
                differences.push(diff);
            }
        }
    }
    
    return differences;
}

/**
 * Transform the response received from the prolog server into an array
 * @param response {string} - response.
 * @return {array} - state.
 */
BoardState.getStateFromResponse= function(response){
    var jsonResponse = response.replace(/\|/g,",");
    var array = JSON.parse(jsonResponse);
    return array;
};

/**
 * Get the JSON string of the current state to send to the prolog server 
 * @return {string} - board.
 */
BoardState.prototype.getJSONString= function(){
    var string = JSON.stringify(this.board);
    //var jsonString = string.replace(/,/g,"|");
    return string;
};
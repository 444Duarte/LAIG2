/**
 * Start a spangles game
 * @constructor
 * @param scene {CGFScene} - scene 
 */
function Spangles(scene){
    Object.call(this);

    this.scene = scene;

    this.turnTime = Spangles.defaultTurnDuration();
    this.picking = true;
    this.results = [];
    this.results['winner'] = null;
    this.results['emptyCells'] = null;

    this.connection = new Connection(this);
    this.scoreBoard = this.scene.scoreBoard;
    this.newGame(5,5,"pvp");

    this.score =[0,0];

};

/**
 * Stances that Spangles has the properties of a Object. 
 */
Spangles.prototype = Object.create(Object.prototype);

/**
 * Creates a Spangles.
 */
Spangles.prototype.constructor = Spangles;

Spangles.prototype.display= function(time){
    this.board.display(time);  
};

/**
 * Start a new game
 * @param x {number} - The length of the board
 * @param y {number}- The width of the board
 * @param mode {string} - game mode. Can be either "pvp" or "bot"
 * @param time {number} - duration of each turn. If null 20 seconds is the predefined duration.
 * @param difficulty {number} - predefined bot difficulty. Can be either 1(easy) or 2(hard). If null 1 is predefined difficulty.
 * @return {boolean} - false if the game mode isn't recognized, else returns true. 
 */
Spangles.prototype.newGame= function(x,y,mode, time,difficulty){
    this.turnTime = time || 20;
    this.resetTimer();
    this.stopTimer();
    switch(mode){
        case "pvp":
            this.stateMachine = new Pvp(this);
            break;
        case "bot":
            this.stateMachine = new Pvb(this);
            this.difficulty = difficulty || 1; 
            break;
        default:
            console.error("Trying to start a game with the following mode: " + mode);
            return false;
    }
    this.board = new Board(this.scene, x,y);
    this.scoreBoard.resetBoard();
    return true;
};

/**
 * Reset and activate the timer of the game
 */
Spangles.prototype.resetTimer = function(){
    this.timeLastCount = null;
    this.time = 0;
    this.timerActiv = true;
};

/**
 * Resume the timer of the game
 */
Spangles.prototype.resumeTimer = function(){
    this.timeLastCount = null;
    this.timerActiv = true;
};

/**
 * Stop the timer of the game
 */
Spangles.prototype.stopTimer= function(){
    this.timerActiv = false;
};

/**
 * Update the game time count.
 * @param time {number} - system time
 * @return {boolean} - return false if the timer is not activated, else returns true.
 */
Spangles.prototype.update= function(time){
    if(this.timerActiv == false)
        return false;


    if(this.timeLastCount == null)
        this.timeLastCount = time;
    
    var timePassed = (time - this.timeLastCount)*1e-3; 
    this.time += timePassed;

    this.scoreBoard.updateTurn(Math.floor(timePassed));

    if(timePassed >= this.turnTime){
        this.stateMachine.update("endTurn");
        console.log("Player "+this.stateMachine.currPlayer+" missed his turn");
    }

    return true;
};

/**
 * Send a request to the server indicating that a player wants to make a move.
 * @param {number} x - The x position where the piece will be placed 
 * @param {number} y - The y position where the piece will be placed
 */
Spangles.prototype.PlayerMakePlay= function(x,y){
    var player = this.stateMachine.currPlayer;
    board = this.board.state.getJSONString();
    var type = 1;
    if(BoardDraw.isPieceInverted([x,0,y]))
        type = 2;
    this.stateMachine.update("sendRequest");
    console.log("Player "+player+" will play in ("+x+","+y+")");
    this.connection.playerMakeMove(board, player,x,y,type);
};

/**
 * Send a request to the server asking for the bot to make move.
 * @param player {number} - Bots player number.
 */
Spangles.prototype.botMakePlay= function(player){
    var difficulty = this. difficulty;
    board = this.board.state.getJSONString(); 
    this.stateMachine.update("sendRequest");
    console.log("Bot "+player+" will try to play.");   
    this.connection.botMove(board, player, difficulty);
}

/**
 * Handle the reception of a new board state from the server and signal the state machine
 * @param response {array} - new board state.  
 */
Spangles.prototype.receiveBoard= function(response){
    var newBoardState = new BoardState(null,BoardState.getStateFromResponse(response));
    this.board.newPlay(newBoardState);
    console.log("Valid play by player "+this.stateMachine.currPlayer);
    this.stateMachine.update("validPlay");
};

/**
 * Notifies the state machine that the previous request has failed.
 */
Spangles.prototype.failResponse= function(){
    console.log("Failed play by player "+this.stateMachine.currPlayer);
    this.stateMachine.update("fail");  
};

/**
 * Notify the game that a tile as been picked. Sends request to the server to attempt to play on the selected tile.
 * @param id {number} - id of the picked tile
 */
Spangles.prototype.pickTile= function(id){
    if(this.picking == false)
        return false;
    var position = this.board.boardTable.getPosFromCoords(id);
    console.log("Pick tile with position ("+position[0]+","+position[1]+")")
    this.PlayerMakePlay(position[0],position[1]);
};

/**
 * Handle the result of the winner verification request made to the server.
 * @param state {number} - Player that won the game. If no player has won, should be false.
 */
Spangles.prototype.receiveWinner= function(state){
    if(state != false){
        this.results.winner = true;
        this.stateMachine.currPlayer = state;
        this.stateMachine.update("won");
    }else{
        this.results.winner = false;
        if(isVerificationComplete(this.results)){
            this.stateMachine.update("continue");
        }
    }      
};

/**
 * Handle the result of the available cells verification request made to the server.
 * @param state {boolean} - Should be true if there are available cell. False if there are no available cells.
 */
Spangles.prototype.receiveHasAvailabeCells= function(state){
    if(state){
        this.results.emptyCells = true;
        if(isVerificationComplete(this.results)){
            this.stateMachine.update("continue");
        }
    }else{
        this.results.emptyCells = false;
        this.stateMachine.update("full");        
    } 
};

/**
 * Makes a number of requests to the server verify if the current game has finished. 
 */
Spangles.prototype.startVerification= function(){
    var board = this.board.state.getJSONString();
    this.connection.verifyWinner(board);
    this.connection.hasAvailableCells(board);
};

/**
 * Resets the result of the verification requests made to the server 
 */
Spangles.prototype.resetResults= function(){
    this.results.winner = null;
    this.results.emptyCells = null;  
};

/**
 * Update the score of a player on the scoreBoard
 * @param player {number} - player number.
 * @param points {number} - number of points that the player has.
 */
Spangles.prototype.updateScore= function(player,points){
    this.score[player-1] = (points < 0) ? 0 : points;
    switch(player){
        case 1:
            
            this.scoreBoard.setPlayer1Points(this.score[player-1]);
            break;
        case 2:
            this.scoreBoard.setPlayer2Points(this.score[player-1]);        
            break;
        default:
            connsole.error("Unidentified player. Trying to change score for player: "+player);
            break;
    }
};

/**
 * Resets the scores on the scoreBoard
 */
Spangles.prototype.resetScores=function(){
    this.scoreBoard.setPlayer1Points(0);
    this.scoreBoard.setPlayer2Points(0);
}

/**
 * Signals the stateMachine that the Undo of a play has been requested.
 */
Spangles.prototype.undo= function(){
    this.stateMachine.update("undo");
}

/**
 * Signals the board to undo a play.
 */
Spangles.prototype.undoPlay= function(){
    if(!this.board.undoPlay()){
        alert("You can't undo to an empty game");
        return false;
    }
    return true;
}

/**
 * Retrieve the difficulty list available for the bot.
 */
Spangles.getDifficultyList= function(){
    return [1,2];
};

/**
 * Retrieve the default turn duration of the game.
 */
Spangles.defaultTurnDuration= function(){
    return 20;
}

/**
 * Verify if the game has finished.
 * @param results {array} - current state of the results verification
 * @return {boolean} - True if the game has finished. If not, returns false.
 */
function isGameFinished(results){
    if(results.winner || !results.emptyCells){
        return false;
    }else{
        return true
    }
};

/**
 * Verifies if the results verification is finished
 * @param results {array} - current state of the results verification
 * @return {boolean} - True if the verification has finished. If not, returns false.
 */
function isVerificationComplete(results){
    if(results.winner == null || results.emptyCells == null){
        return false;
    }else{
        return true;
    }
};


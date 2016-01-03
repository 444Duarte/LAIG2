/**
 * Class responsible for handling the connection to the prolog. 
 * @constructor
 */
function Connection(game,port){
    Object.call(this);
    
    this.port = port;
    this.game = game;
    this.establishConnection();
};

/**
 * Stances that Connection has the properties of a Object. 
 */
Connection.prototype = Object.create(Object.prototype);

/**
 * Creates a Connection.
 */
Connection.prototype.constructor = Connection;

/**
 * Establishes a connection with the prolog server
 */
Connection.prototype.establishConnection= function(){
    this.getPrologRequest('handshake',connectionSuccessful,null,this.port);
};

/**
 * Ask the prolog server for an empty board. NOT FULLY IMPLEMENTED- MISSING this.sendBoardToGame function. NOT USED BY DURING THE GAME 
 * @param {number} x - The length of the board
 * @param {number} y - The width of the board
 */
Connection.prototype.createBoard = function(x,y){
    this.getPrologRequest('createBoard('+x+','+y+')',this.sendBoardToGame,null,this.port);
};

/**
 * Verify if the given state of the game has a winner.
 * @param board {string} - JSON string that represents the current state of the board.
 */
Connection.prototype.verifyWinner= function(board){
    this.getPrologRequest('checkWinner('+board+ ')',this.receiveWinner,null,this.port);
};

/**
 * Receive a successful response from the prolog server after the Connection.prototype.verifyWinner is called.
 * Sends the player that won the game to Game engine. If there are no winners sends false.
 */
Connection.prototype.receiveWinner = function(data){
    var response = data.target.response;
    if(response == "Syntax Error"){
        console.error(response);
        return;
    }

    if(response == "Bad Request" || response == "false"){
        this.connection.game.receiveWinner(false);
    }else{
        this.connection.game.receiveWinner(response);
    }
};

/**
 * Verify if the given state of the game has available cells to play.
 * @param board {string} - JSON string that represents the current state of the board.
 */
Connection.prototype.hasAvailableCells= function(board){
    this.getPrologRequest('hasAvailableCells('+board+ ')',this.receiveHasAvailabeCells,null,this.port);
};

/**
 * Receive a successful response from the prolog server after the Connection.prototype.hasAvailableCells is called.
 * Sends true to the Game engine if there are still empty cells. Else sends false.
 */
Connection.prototype.receiveHasAvailabeCells= function(data){
    var response = data.target.response;
    if(response == "Syntax Error"){
        console.error(response);
        return;
    }

    if(response == "Bad Request" || response == "false"){
        this.connection.game.receiveHasAvailabeCells(false);
    }else{
        this.connection.game.receiveHasAvailabeCells(true);
    }
};

/**
 *
 *
 */
Connection.prototype.playerMakeMove = function(board, player, x,y,type){
    var request = 'playerMakeMove('+board+','+player+','+(x-1)+','+(y-1)+','+type+')';
    this.getPrologRequest(request, this.sendResponseToGame, null, this.port);
};

/**
 * Send the current state of the game and expects to receive a new state after the bot plays.
 * @param board {string} - JSON string that represents the current state of the board.
 * @param player {number} - bots player number. 
 * @param difficulty {number} -difficulty of the bot. Can be either 1 or 2.
 */
Connection.prototype.botMove= function(board, player,difficulty){
    this.getPrologRequest('botMakeMove('+board+','+player+',' +difficulty+ ')', this.sendResponseToGame, null, this.port);
};

/**
 * Receives a new board from the prolog server and sends it to the game.
 */
Connection.prototype.sendResponseToGame= function(data){
    var response = data.target.response;
    if(response == "Bad Request" || response == "Syntax Error"){
        console.error(response);
        this.connection.game.failResponse();
        return;
    }
    this.connection.game.receiveBoard(response);
};

/**
 * Handles the reception of the connection result.
 */
function connectionSuccessful(data){
    if(data.target.response == "handshake")
        console.log('Connection successful!');
    else
        console.error("Error establishing a connection. Received " + data.target.response);
};

/**
 * Make an XMLHttpRequest.
 * @param requestString {string} - request to the server.
 * @param onSuccess {function pointer} - function pointer to the function that will be executed if the request is successful. If null the function will be function(data){console.log("Request successful. Reply: " + data.target.response);}
 * @param onErro {function pointer} - function pointer to the function that will be executed if the request is not successful. If null the function will be function(){console.log("Error waiting for response"); return false;}
 * @param port {number} - request Port. If null the request port will be 8081.
 */
Connection.prototype.getPrologRequest= function(requestString, onSuccess, onError, port){
    var requestPort = port || 8081
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);
    request['connection'] = this;
    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
    request.onerror = onError || function(){console.log("Error waiting for response"); return false;};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
};
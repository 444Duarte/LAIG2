/**
 * Class that handles PvP state machine
 * @constructor
 * @param game {Spangles} - game
 */
function Pvp(game){
    Object.call(this);

    this.game = game;
    
    this.currPlayer = 2;
    this.switchState("StartTurn");
    this.game.stopTimer();
    this.playsHistory=[];
};

/**
 * Stances that Pvp has the properties of a Object. 
 */
Pvp.prototype = Object.create(Object.prototype);

/**
 * Update the state machine in response to a certain action.
 * @param action {string} - action. Can be "endTurn","sendRequest","undo","validPlay","fail","won","full","continue"
 */
Pvp.prototype.update= function(action){
    switch(this.state){       
        case "Turn":
            switch(action){
                case "endTurn":
                    this.switchState("StartTurn");
                    break;
                case "sendRequest":
                    this.switchState("WaitResponse");
                    break;
                case "undo":
                    if(this.game.undoPlay()){
                        this.undoPlay();
                    }
                    break;
                default:
                    console.error("Action not recognized " + action);
                    break;                    
            }
            break;
        case "WaitResponse":
            switch(action){
                case "validPlay":
                    this.playsHistory.push(this.currPlayer);
                    this.game.updateScore(this.currPlayer, this.game.score[this.currPlayer-1]+1);
                    this.switchState("BoardCheck");
                    break;
                case "fail":
                    this.switchState("Turn");
                    break;
                case "undo":
                    console.log("Undo doesn't work while waiting a response from server");
                    break;
                default:
                    console.error("Action not recognized" + action);
                    break; 
            }
            break;
        case "BoardCheck":
            switch(action){
                case "won":
                    var message = "Player "+this.currPlayer+" has won this game. You will now see a recap of the game"; 
                    this.switchState("Finished");
                    console.log(message);
                    alert(message);
                    break;
                case "full":
                    var message = "There are no more empty cells. It's a tie. You will now see a recap of the game";
                    console.log(message);
                    this.switchState("Finished");
                    alert(message);
                    break;
                case "continue":
                    this.switchState("StartTurn");
                    break;
                case "undo":
                    console.log("Undo doesn't work while waiting a response from server");
                    break;
                default:
                    console.error("Action not recognized" + action);
                    break;
            }
            break;
        case "Finished":
            break;
        default:
            console.error("State not recognized "+this.state);
            break;
    }  
};

/**
 * Handle the state of the game in order to undo a play.
 */
Pvp.prototype.undoPlay=function(){
    this.game.updateScore(this.previousPlayer(), this.game.score[this.previousPlayer()-1]-1);
    this.currPlayer = Pvp.enemyPlayer(this.previousPlayer());
    this.playsHistory.splice(this.playsHistory.length-1,1);
    this.switchState("StartTurn");
};

/**
 * Get the enemy player of the given player
 * @param player {number} - player
 * @return - enemy player
 */
Pvp.enemyPlayer= function(player){
    if(player == 1)
        return 2;
    if(player == 2)
        return 1;
};

/**
 * Get the last player who made a successful play
 * @return - False if there are no successful plays in the game history. Else returns the last player who made a successful play 
 */
Pvp.prototype.previousPlayer=function(){
    if(this.playsHistory.length <= 0)
        return false;
    return this.playsHistory[this.playsHistory.length -1];  
};


/**
 * Switch to a certain state and activates all the events that happen when you switch to the given state.
 * @param state {string} - new state. Can be "StartTurn", "Turn", "WaitResponse", "BoardCheck", "Finished".
 */
Pvp.prototype.switchState= function(state){
    switch(state){
        case "StartTurn":
            this.game.resetTimer();
            this.game.resetResults();
            if(this.currPlayer == 1){
                this.currPlayer = 2;
                console.log("Player 2 now playing");
            }else{
                this.currPlayer = 1;
                console.log("Player 1 now playing");
            }
            this.switchState("Turn");
            break;        
        case "Turn":
            this.state = state;
            this.game.picking = true;
            if(!this.game.timerActiv)
                this.game.resumeTimer();
            break;
        case "WaitResponse":
            this.state = state;
            this.game.stopTimer();
            this.game.picking = false;
            break;
        case "BoardCheck":
            this.game.startVerification();
            this.state = state;
            break;
        case "Finished":
            this.game.scoreBoard.stopClock();
            this.state = state;
            this.game.board.startRewind();
            this.game.stopTimer();
            this.game.picking = false;
            break;
        default:
            console.error("State change failed. Didn't expect state: "+state)
    }         
};
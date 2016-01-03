/**
 * Class that handles PvB state machine
 * @constructor
 * @param game {Spangles} - game
 */
function Pvb(game){
    Object.call(this);

    this.game = game;
    
    this.currPlayer = 2;
    this.switchState("StartTurn");
    this.game.stopTimer();
    this.playsHistory = [];
};

/**
 * Stances that Pvb has the properties of a Object. 
 */
Pvb.prototype = Object.create(Object.prototype);

/**
 * Update the state machine in response to a certain action.
 * @param action {string} - action. Can be "endTurn","sendRequest","undo","validPlay","fail","won","full","continue"
 */
Pvb.prototype.update= function(action){
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
                    this.undoPlay();
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
 * Handle the state of the game in order to undo a play. Returns to the last successful play made by the player 1, erasing all posterior plays made by the bot.
 * @return - false if there are no successful plays made by the player 1 or if it's the bot turn.
 */
Pvb.prototype.undoPlay=function(){
    if(this.currPlayer != 1){
        console.log("Can't undo during the bots turn");
        return false;
    }
    
    var index = this.playsHistory.lastIndexOf(this.currPlayer);
    if(index < 0){
        var message = "Can't undo if you still haven't played";
        console.log(message);
        alert(message);
        return false;
    }

    
    var numberDeletedPlays = this.playsHistory.length - index;
    for(var i = (index + numberDeletedPlays-1); i >= index ; i--){
        if(!this.game.undoPlay()){
            console.error("Can't undo play i="+i);
        }
    } 


    var bot = Pvb.enemyPlayer(this.currPlayer);
    var deletedBotPoints = this.game.score[bot -1] - (numberDeletedPlays -1);
    this.game.updateScore(bot, deletedBotPoints);
    this.game.updateScore(this.currPlayer, this.game.score[this.currPlayer-1]-1);

    this.currPlayer = bot;
    this.playsHistory.splice(index,numberDeletedPlays);
    this.switchState("StartTurn");
};

/**
 * Get the enemy player of the given player
 * @param player {number} - player
 * @return - enemy player
 */
Pvb.enemyPlayer= function(player){
    if(player == 1)
        return 2;
    if(player == 2)
        return 1;
};


/**
 * Switch to a certain state and activates all the events that happen when you switch to the given state.
 * @param state {string} - new state. Can be "StartTurn", "Turn", "WaitResponse", "BoardCheck", "Finished".
 */
Pvb.prototype.switchState= function(state){
    switch(state){
        case "StartTurn":
            this.game.resetTimer();
            this.game.resetResults();
            if(this.currPlayer == 1){
                this.currPlayer = 2;
                console.log("Bot 2 now playing");
            }else{
                this.currPlayer = 1;
                console.log("Player 1 now playing");
            }
            this.switchState("Turn");
            break;        
        case "Turn":
            this.state = state;
            
            if(this.currPlayer == 2){
                this.game.picking = false;
                this.game.botMakePlay(this.currPlayer);
            }else{
                this.game.picking = true;
            }

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
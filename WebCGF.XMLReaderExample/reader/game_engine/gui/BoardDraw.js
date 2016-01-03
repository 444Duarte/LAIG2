/**
 * Creates a BoardDraw with the given coordinates.
 * @constructor
 * @param scene {CGFscene} - The scene
 * @param x {number} - The length of the board
 * @param y {number}- The width of the board
 */
function BoardDraw(scene, x,y){
    Object.call(this);

    this.scene = scene;
    this.x = x;
    this.y = y;
    this.size=1;

    this.id = 1;

    this.plate = this.scene.nodes['plate'];
    this.mosaic= this.scene.nodes['plate_mosaic'];
    this.piece1= this.scene.nodes['player1'];
    this.piece2= this.scene.nodes['player2'];

    this.tiles = this.createTiles(x,y);
};

/**
 * Stances that BoardDraw has the properties of a CGFobject.
 */
BoardDraw.prototype = Object.create(Object.prototype);

/**
 * Creates a BoardDraw.
 */
BoardDraw.prototype.constructor = BoardDraw;

/**
 * Draw the plates
 */
BoardDraw.prototype.drawPlates = function(x,y){
    this.scene.pushMatrix();
        this.scene.scale(x,1,(y+1)/2);
        this.plate.display();

        this.scene.pushMatrix();
            this.scene.translate(1,-1,0);
            this.scene.rotate(Math.PI,0,0,1);
            this.plate.display();
        this.scene.popMatrix();
    this.scene.popMatrix();
}

/**
 * Create the tiles for the board
 * @param {number} x - The length of the board
 * @param {number} y - The width of the board
 */
BoardDraw.prototype.createTiles = function(x,y){
    board = [x,0,y];

    var tiles = [];

    for(var i = 1; i <= x; i++){
        var row = [];
        for(var j = 1; j <= y; j++){
            var tile = new Tile(this.scene, board, [i,0,j]);
            row.push(tile);
        }
        tiles.push(row);
    }
    return tiles;
};

/**
 * Draw the board
 */
BoardDraw.prototype.display = function(){
    this.id = 1;
    this.scene.pushMatrix();
    this.scene.scale(this.size, this.size, this.size);

    this.placePieces(this.x, this.y);
    this.boardBody(this.x, this.y);
        this.scene.pushMatrix();
            this.scene.translate(1,0,0);
            for(var i = 0; i < this.x; i++)
                for(var j = 0; j < this.y; j++){
                    this.scene.registerForPick(this.id, this.tiles[i][j]);
                    this.id++;
                    this.tiles[i][j].display();
                }
        this.scene.popMatrix();

    this.scene.popMatrix();
    this.scene.clearPickRegistration();
};

/**
 * Place the pieces in the border of the board
 */
BoardDraw.prototype.placePieces= function(x,y){
    this.scene.pushMatrix();
        var piece2 = BoardDraw.pieceInitPositions([x,0,y],2);
        this.scene.translate(piece2[0],0,piece2[2]);
        this.scene.rotate(BoardDraw.playerOrientation(2),0,1,0);
        this.piece2.display();
    this.scene.popMatrix();
    this.scene.pushMatrix();
        var piece1 = BoardDraw.pieceInitPositions([x,0,y],1);
        this.scene.translate(piece1[0]-1,0,piece1[2]);
        this.scene.rotate(BoardDraw.playerOrientation(1),0,1,0);
        this.piece1.display();
    this.scene.popMatrix();
};


/**
 * Set the board scale size
 */
BoardDraw.prototype.setSize= function(size){
    this.size = size;
};

/**
 * Draw the body of the board.
 * @param {number} x - The length of the board
 * @param {number} y - The width of the board
 */
BoardDraw.prototype.boardBody= function(x,y){
    x +=2;
    this.scene.pushMatrix();
        this.scene.scale(1,0.5,1);
        this.drawPlates(x,y);
        this.drawBorders(x,y);
    this.scene.popMatrix();
};

/**
 * Draw the borders of the board.
 * @param {number} x - The length of the board
 * @param {number} y - The width of the board
 */
BoardDraw.prototype.drawBorders= function(x,y){

    this.scene.pushMatrix();

        this.scene.translate(0,-1,0);
        this.scene.rotate(Math.PI/2,0,0,1);
        this.scene.scale(1,1,(y+1)/2);
        this.plate.display();

        this.scene.pushMatrix();
            this.scene.translate(1,-x,0);
            this.scene.rotate(-Math.PI,0,0,1);
            this.plate.display();
        this.scene.popMatrix();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0,-1,(y+1)/2);
        this.scene.rotate(Math.PI/2,0,1,0);
        this.scene.rotate(Math.PI/2,0,0,1);
        this.scene.scale(1,1,x);
        this.plate.display();

        this.scene.pushMatrix();
            this.scene.translate(1,-(y+1)/2,0);
            this.scene.rotate(-Math.PI,0,0,1);
            this.plate.display();
        this.scene.popMatrix();
    this.scene.popMatrix();
};

/**
 * Get the initial position of a players piece in the board.
 * @param board {array} - Array of length equal to 3. The first element is the length of the board and the third element the width of the board. The second element must be a 0
 * @param player {number} - player
 * @return {array} - Array of length equal to 3. The first element is the x position of the piece. The third element is the z position of the piece. The second element is 0.
 */
BoardDraw.pieceInitPositions= function(board, player){
    switch(player){
        case 1:
            var boardDimensions = Vector.fromArray(board);
            var x = boardDimensions.x + 3;
            var y =(boardDimensions.z +1)/4;
            return [x,0,y];
            break;
        case 2:
            var boardDimensions = Vector.fromArray(board);
            var x = 0;
            var y =(boardDimensions.z +1)/4;
            return [x,0,y];
            break;
        default:
            console.error("Player "+player+" doesn't exist");
            break;
    }
};

/**
 * Given the coordinates on the board returns the corresponding coordinates in the scene. 
 * @param board {array} - Array of length equal to 3. The first element is the length of the board and the third element the width of the board. The second element must be a 0
 * @param coordinates {array} - Array of length equal to 3. The first element is the x position of the piece. The third element is the z position of the piece. The second element is 0.
 * @return {array} - Array of length equal to 3. The first element is the x position of the piece in the scene. The third element is the z position of the piece in the scene. The second element is 0.
 */
BoardDraw.realCoordinates= function(board,coordinates){
    var x = coordinates[0];
    var y = (board[2] - coordinates[2]+1)*0.5;
    return [x,0,y];
};

/**
 * Invert the given coordinates as if the board was beeing seen by the player on the other side table.
 * @param board {array} - Array of length equal to 3. The first element is the length of the board and the third element the width of the board. The second element must be a 0
 * @param coordinates {array} - Array of length equal to 3. The first element is the x position of the piece. The third element is the z position of the piece. The second element is 0.
 * @return {array} - Array of length equal to 3. The first element is the x position of the piece. The third element is the z position of the piece. The second element is 0.
 */
BoardDraw.invertCoordinates= function(board, coordinates){
    var x = board[0] - coordinates[0] + 1;
    var y = board[2] - coordinates[2] + 1;
    return [x,0,y];
};

/**
 * Returns if a piece is inverted(triangle pointing in the x direction). According to the view of the player 1.
 * @param coordinates {array} - Array of length equal to 3. The first element is the x position of the piece. The third element is the z position of the piece. The second element is 0.
 * @return - true if the piece is inverted. False if not.
 */
BoardDraw.isPieceInverted= function(coordinates){
    if((coordinates[2]%2 == 0 && coordinates[0]%2 != 0) || (coordinates[2]%2 != 0 && coordinates[0]%2 == 0) ){
        return true;
    }else{
        return false;
    }
};

/**
 * Starting orientation fo the player piece.
 * @param player {number} - player.
 * @return - angle according to the Y axis.
 */
BoardDraw.playerOrientation= function(player){
    switch(player){
        case 1:
            return -Math.PI/2;
        case 2:
            return Math.PI/2;

    }
};

/**
 * Get the position of the piece according to its id.
 * @param id {number} - id.
 * @return {array} - Array of length 2. The first element is the x position of the piece. The second element is the y position of the piece. 
 */
BoardDraw.prototype.getPosFromCoords= function(id){
    var x = Math.ceil(id/this.y);
    var y = id % this.y;
    if(y == 0)
        y = this.y;
    return [x,y];
};


/**
 * Get the width of the board.
 * @return {number} - width.
 */
BoardDraw.prototype.getWidth=function(){
    return (this.y + 1)/2;
};

/**
 * Get the Length of the board.
 * @return {number} - length.
 */
BoardDraw.prototype.getLength=function(){
    return this.x+2;
};
/**
 * Creates a Tile with the given coordinates.
 * @constructor
 * @param scene {CGFscene} - The scene
 * @param {number} x - The height of the board
 * @param {number} y - The width of the board
 */
function Tile(scene, board,position){
    Object.call(this);

    this.scene = scene;
    this.board = Vector.fromArray(board);
    this.position = Vector.fromArray(position);
    this.size=1;

    this.tile= this.scene.nodes['plate_mosaic'];
}

/**
 * Stances that Tile has the properties of a CGFobject. 
 */
Tile.prototype = Object.create(Object.prototype);

/**
 * Creates a Tile.
 */
Tile.prototype.constructor = Tile;

/**
 * Display the tile
 */
Tile.prototype.display = function(){
    this.scene.pushMatrix();
        var position = BoardDraw.realCoordinates(this.board.toArray(),this.position.toArray());
        var x = position[0];
        var y = position[2];
        
        //Place the tile in the corresponding position
        this.scene.translate(x,0,y);

        //Change the tile from up or down according to its position on the board
        if(BoardDraw.isPieceInverted(this.position.toArray())){
            this.scene.translate(-1,0,0);
            this.scene.rotate(Math.PI/2,0,1,0);
        }else{
            this.scene.rotate(-Math.PI/2,0,1,0);
        }
        this.tile.display();
    this.scene.popMatrix();
};
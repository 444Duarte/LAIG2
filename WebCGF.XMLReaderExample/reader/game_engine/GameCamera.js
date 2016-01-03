/**
 * GameCamera
 * @constructor
 */
function GameCamera(scene) {
    Object.call(this);
	this.scene = scene;
    this.init();
};

GameCamera.prototype = Object.create(Object.prototype);
GameCamera.prototype.constructor = GameCamera;

/**
 * init
 */
GameCamera.prototype.init = function() {
	this.rotateCamera = false;
	this.previousView = "Player1";
    this.currentView = "Player1";
	this.cameraRotation = 0;
};

/**
 * Get the angle to the Y axis that corresponds to the view.
 * @param view {string} - "Player1", "Player2", "Scoreboard".
 * @return {number} - angle. Returns false if the given view doesn't have an associated angle.
 */
GameCamera.prototype.getViewAngle = function(view){
    switch(view){
        case "Player1":
            return 0;            
        case "Player2":
            return -Math.PI;
        case "Scoreboard":
            return -Math.PI/2;
        default:
            console.error("There is no angle associated for view: "+view);
            return false;
    }
};

/**
 * Get the current rotation being animated by the camera.
 * @return {number} - angle
 */
GameCamera.prototype.getRotation=function(){
    prevViewAngle = this.getViewAngle(this.previousView);
    currAngle = this.getViewAngle(this.currentView);

    return currAngle - prevViewAngle;
};

/**
 * Rotate the camera.
 */
GameCamera.prototype.animateCamera = function() {
	if (this.rotateCamera) {
		var rotation = this.getRotation();

		if (Math.abs(this.cameraRotation) >= Math.abs(rotation)) {
			this.rotateCamera = false;
			this.cameraRotation = 0;
		}
		else {
			var theta = (rotation < 0) ? -this.scene.timeElapsed/1000 : this.scene.timeElapsed / 1000;
			if (Math.abs(this.cameraRotation + theta ) >= Math.abs(rotation))
				this.scene.camera.orbit(vec3.fromValues(0, 1, 0), rotation - this.cameraRotation);
			else
				this.scene.camera.orbit(vec3.fromValues(0, 1, 0),theta);
			this.cameraRotation = this.cameraRotation + theta;
		}
	}
};

/**
 * Set the currentView as the previous view and the given view as the current one.
 * @param newView {string} - The new view. 
 */
GameCamera.prototype.switchViews= function(newView){
    this.previousView = this.currentView;
    this.currentView = newView;
};

/**
 * Handle inputs received
 * @param key {string} - pressed key.
 */
GameCamera.prototype.inputHandler = function(key) {
	if(this.rotateCamera){
		return false;
	}
	
	switch(key){
		case "Space":
			if(this.currentView == "Player1"){
				this.switchViews("Player2");
			}else{
				this.switchViews("Player1");
			}
			this.rotateCamera = true;
			break;
		case "R":
			this.switchViews("Scoreboard");
			this.rotateCamera = true;
			break;
		default: 
			break;
	}
};
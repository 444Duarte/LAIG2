/**
 * GameInterface
 * @constructor
 */


function GameInterface(scene) {
	//call CGFinterface constructor
	CGFinterface.call(this);
	this.scene = scene;
};

GameInterface.prototype = Object.create(CGFinterface.prototype);
GameInterface.prototype.constructor = GameInterface;

/**
 * init
 * @param {CGFapplication} application
 */
GameInterface.prototype.init = function(application) {
	CGFinterface.prototype.init.call(this, application);

	this.gui = new dat.GUI();

    this.gui.add(this.scene, 'NewGamePVP');
    this.gui.add(this.scene, 'NewGameBot');
	this.gui.add(this.scene, 'Undo');

    var group=this.gui.addFolder("Definitions");
	group.open();

	group.add(this.scene, 'botDifficulty', this.scene.botDiffList);
    group.add(this.scene, 'turnDuration', 5,30);
    group.add(this.scene, 'boardX', 5,15);
    group.add(this.scene, 'boardY', 5,15);

    var ambients = this.gui.addFolder("Ambients");
    ambients.open();

    ambients.add(this.scene, 'FirstAmbient');
    ambients.add(this.scene, 'SecondAmbient');
    ambients.add(this.scene, 'ThirdAmbient');

	return true;
};

GameInterface.prototype.processKeyboard = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyboard.call(this,event);
	// Check key codes e.g. here: http://www.asciitable.com/
	// or use String.fromCharCode(event.keyCode) to compare chars

	// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
	switch (event.keyCode) {
		case 32:
			this.scene.cameraController.inputHandler("Space");
			break;
		case 82:
			this.scene.cameraController.inputHandler("R");
			break;
		case 114:
			this.scene.cameraController.inputHandler("R");
			break;
		default:
			console.log("Pressed keyCode: " + event.keyCode);
			break;
	}
};

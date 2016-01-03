/**
 * Creates the interface of the lights.
 * @constructor
 * @param scene {CGFscene} - the scene
 */
function MyLightsInterface(scene) {
	CGFinterface.call(this);
	this.scene = scene;
};

/**
 * Stances that MyLightsInterface has the properties of a CGFinterface.
*/
MyLightsInterface.prototype = Object.create(CGFinterface.prototype);

/**
 * Creates a MyLightsInterface.
 */
MyLightsInterface.prototype.constructor = MyLightsInterface;

/**
 * Initiates the interface, empty.
 * @param application - the application
 */
MyLightsInterface.prototype.init = function(application) {
	CGFinterface.prototype.init.call(this, application);
	this.gui = new dat.GUI();
};

/**
 * Fills the interface, after the graph is loaded.
 */
MyLightsInterface.prototype.onGraphLoaded = function(){
    var group = this.gui.addFolder('Lights');
    group.open();
    var lights = this.scene.enabledLights;

	for(light in lights){
	    var self = this;
	    var controller = group.add(lights,light);
	    controller.onChange(function(enable) {
	    	self.scene.updateLight(this.property, enable);
	    });
	}
}

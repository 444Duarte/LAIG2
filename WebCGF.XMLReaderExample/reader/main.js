//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

/**
 * Decodes the URL.
 */
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}

serialInclude(['../lib/CGF.js', 'MyScene.js', 'MySceneGraph.js', 'data/MyMaterial.js', 'data/MyNode.js', 'data/MyRotation.js', 'data/MyScale.js', 'data/MyTexture.js', 'data/MyTranslation.js', 'primitives/MyCylinder.js', 'primitives/MyRectangle.js', 'primitives/MySphere.js', 'primitives/MyTriangle.js', 'data/MyLightsInterface.js', 'data/MyLight.js', 'data/Animation.js', 'data/LinearAnimation.js','data/CircularAnimation.js', 'primitives/Plane.js','primitives/Patch.js','data/ComposedAnimation.js', 'primitives/Terrain.js',
 'game_engine/gui/BoardDraw.js','game_engine/gui/Piece.js', 'game_engine/gui/Tile.js', 'game_engine/gui/Number.js' , 'game_engine/gui/ScoreBoard.js',
 'game_engine/Board.js','game_engine/Connection.js','game_engine/Spangles.js','game_engine/Pvp.js', 'game_engine/Pvb.js' ,'game_engine/GameInterface.js', 'game_engine/GameCamera.js',
 'game_engine/models/BoardState.js' ,
 'dependencies/vector.js','primitives/Vehicle.js',

/**
 * Standard main function. Creates a CGFapplication and sets in it a scene and an interface.
 * Activates the camera, reads a given file and loads the graph.
 */
main=function()
{
	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myScene = new MyScene();
    var myInterface = new GameInterface(myScene);

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);
    myScene.setInterface(myInterface);
    myInterface.setActiveCamera(myScene.camera);

	// get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml
	// or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) ;

	var filename=getUrlVars()['file'] || "myScene/scene.lsx";

	// create and load graph, and associate it to scene.
	// Check console for loading errors
	var myGraph = new MySceneGraph(filename, myScene, 0);

  myGraph.loadSecondaryScenes(["Ambient 1", "Ambient 2", "Ambient 3"], myScene);

	// start
    app.run();
}
]);

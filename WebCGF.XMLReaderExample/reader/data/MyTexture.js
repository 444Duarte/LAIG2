/**
 * MyTexture
 * @constructor
 */
function MyTexture(scene, id, path, s, t) {
    CGFtexture.call(this, scene,path);

    this.id = id;
    this.s = s;
    this.t = t;
}

/**
 * Stances that MyTexture has the properties of a CGFtexture.
*/
MyTexture.prototype = Object.create(CGFtexture.prototype);

/**
 * Creates a MyTexture.
 */
MyTexture.prototype.constructor = MyTexture;
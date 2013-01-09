var spritesmith = require('spritesmith'),
    fs = require('fs'),
    path = require('path');


module.exports = function (grunt) {

    "use strict";

    var SpriteImporter = function () {};

    // Export the SpriteMaker function
    grunt.registerMultiTask( 'spriteimporter', 'Create sprites and updates css.', SpriteImporter );

};

grunt-oversprite
================

Grunt wrapper for [spritesmith](https://github.com/Ensighten/spritesmith).

Difference from [grunt-spritesmith](https://github.com/Ensighten/grunt-spritesmith) are following: Instead of creating a set of variables for preprocessor, like stylus, this plugin will take an array of css files and replace old background-images in them to a new sprite paths + image coordinates.



Requirements
============

This is Grunt 0.4.0 plugin (Current release version is 0.3.x). Follow this [instructions](https://github.com/gruntjs/grunt/wiki/Getting-started) to install and use it.

This plugin uses one of these libraries for image manipulations: [gm](https://github.com/aheckmann/gm), [node-canvas](https://github.com/LearnBoost/node-canvas). For them to be installed correctly, you first need to install either [graphicsmagick](http://www.graphicsmagick.org/) image library (for gm), OR cairo, pixiv and node-gyp (for node-canvas, see [instruction](https://github.com/LearnBoost/node-canvas/wiki/_pages) for installation instructions).

**Warning!** Plugin will try to install both image libraries, if you don't have all dependency libraries (for BOTH gm and node-canvas) in your system, one of this libraries will probably fails to install and will display errors. It is normal, you can use plugin even is you have only one of them installed.

Installation
============

After you have all required libraries install it with:

    npm install grunt-oversprite


For grunt to see it, add this line to your gruntfile:

    grunt.loadNpmTasks('grunt-oversprite');


Usage
=====

For css replace to work you need to follow this rules:

  1. "background-image" must be set as separate rule and not as part of "background".
  2. Script will add "background-position" rule right after but will not remove any existing one. So either not use one in original file, or use it before "background-image".
  3. If you need to add "background-repeat" of image dimensions, do in manually in the original file.

Use the following config:

    grunt.initConfig({
        oversprite: {
            // This is are multitask, you can create multiple sprite generators buy copying all 
            // object with other name, see grunt.js docs for details
            all: {
                // List of sprites to create
                spritelist: [
                    {
                        // List of images to add to sprite
                        'src': [ 'images/*.png' ],
                        // Address of target image
                        'dest': 'publish/sprite.jpg',
                        // OPTIONAL: Image placing algorithm: top-down, left-right, diagonal, alt-diagonal, binary-tree
                        'algorithm': 'binary-tree',
                        // OPTIONAL: Padding between imagesm
                        'padding': 1,
                        // OPTIONAL: Rendering engine: auto, canvas, gm
                        'engine': 'gm',
                        // OPTIONAL: Preferences for resulting image
                        'exportOpts': {
                            // Image formst (buy default will try to use dest extension)
                            'format': 'jpg',
                            // Quality of image (gm only)
                            'quality': 90
                        }
                    },
                    // Second sprite config
                    {
                        'src': [ 'images/img2.jpg', 'images/img3.gif' ],
                        'dest': 'publish/sprite.png',
                    }

                ],
                // List of css to replace images
                csslist: [
                    {
                        // Source css file
                        'src':  'style.css',
                        // Target css file, can be the same as source
                        'dest': 'style.sprite.css',
                        // OPTIONAL: Normalization string. Will be added to css dir path, before paths in css. 
                        // Use if you move the css and paths to images aren't resolving correctly now.
                        'base': '../blocks/'
                    },
                    // Second css config
                    {
                        'src':  'style.ie.css',
                        'dest': 'sprite.ie.css'
                    }
                ]
            }
        }

    });

Changelog
=========
### 0.1.7
  - Updated to spritesmith 3.0.1. Now supports pixelsmith

### 0.1.6
  - Updated to spritesmith 0.18.0. Now supports pngsmith. thnx to @ jsmarkus .

### 0.1.5
  - Updated to spritesmith 0.10. Now supports padding attribute.
  - Fix for #5 (Case not ignored then searching for files). Thanks to @orand.

### 0.1.4
  - Fixed x offset than using non-default algorithm. Thanks to @diorcety .

License
=======

Copyright © 2013 Alexey Ivanov. Licensed under the MIT license.

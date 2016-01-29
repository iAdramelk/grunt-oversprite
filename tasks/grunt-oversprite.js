var Spritesmith = require('spritesmith'),
    fs = require('fs'),
    path = require('path');


module.exports = function (grunt) {
    "use strict";

    // Export the SpriteMaker function
    grunt.registerMultiTask('oversprite', 'Create sprites and updates css.', function () {
        var imageReplaces = [],
            that = this,
            done = this.async(),
            spriteList = this.data.spritelist,
            spriteListLength = spriteList.length,
            cssList = this.data.csslist,
            cssListLength = cssList.length,
            ifErrors = false,
            i,
            m;

        // Normalize data and validate paths of images
        for (i = 0; i < spriteListLength; i++) {
            spriteList[i].src = grunt.file.expand({nonull: true}, spriteList[i].src);
            spriteList[i].engine = spriteList[i].engine || 'pixelsmith';
            spriteList[i].algorithm = spriteList[i].algorithm || 'top-down';
            spriteList[i].exportOpts = spriteList[i].exportOpts || {};

            var tmpExt = path.extname(spriteList[i].dest);

            tmpExt = tmpExt.slice(1, tmpExt.length);

            spriteList[i].exportOpts.format = spriteList[i].exportOpts.format || tmpExt;

            for (var k = 0; k < spriteList[i].src.length; k++) {
                if (!grunt.file.exists(spriteList[i].src[k])) {
                    grunt.log.error('Image "' + spriteList[i].src[k] + '" doesn\'t exist."');
                    ifErrors = true;
                }
            }
        }

        // Check if css files exits
        for (m = 0; m < cssListLength; m++) {
            if (!grunt.file.exists(cssList[m].src)) {
                grunt.log.error('Css "' + cssList[m].src + '" doesn\'t exist."');
                ifErrors = true;
            }
        }

        // If css or image files don't exists, throw error
        if (ifErrors) {
            done(false);
        }

        // Sprite creating function
        var _spriteSmithWrapper = function (config, callback) {
            var sprite = config.dest,
                tmpResult,
                newKey;

            delete config.sprite;

            Spritesmith.run(config, function (err, result) {
                if (err) {
                    grunt.fatal(err);
                    return callback(err);
                } else {
                    grunt.file.write(sprite, result.image, {encoding: 'binary'});
                    tmpResult = result.coordinates;
                    for (var key in result.coordinates) {
                        newKey = path.join(process.cwd(), key).toLowerCase();
                        imageReplaces[newKey] = tmpResult[key];
                        imageReplaces[newKey].sprite = path.join(process.cwd(), sprite);
                    }
                    callback(false);
                }
            });
        };

        // Path resolving function
        var _insertSprites = function (css) {
            var regex = new RegExp('background-image:[\\s]?url\\(["\']?(?!http[s]?|/)([\\w\\d\\s!./\\-\\_]*\\.[\\w?#]+)["\']?\\)[^;]*;', 'ig'),
                dir = path.join(process.cwd(), path.dirname(css.src)),
                data = grunt.file.read(css.src),
                base = ( css.base ) ? path.join(dir, css.base) : false,
                resources = data.match(regex),
                pathToResource,
                absolutePath,
                newPath,
                img,
                x,
                max = resources.length;

            if (resources !== null) {
                for (x = 0; x < max; x++) {
                    pathToResource = resources[x].replace(regex, '$1');
                    absolutePath = ( base ) ? path.join(base, pathToResource) : path.join(dir, pathToResource);
                    absolutePath = absolutePath.toLowerCase();

                    if (imageReplaces[absolutePath] !== undefined) {
                        img = imageReplaces[absolutePath];
                        newPath = ( base ) ? path.relative(base, img.sprite) : path.relative(dir, img.sprite);
                        newPath = newPath.replace(/\\/ig, '/');
                        data = data.replace(resources[x], 'background-image: url("' + newPath + '"); background-position: -' + img.x + 'px -' + img.y + 'px;');
                    }
                }
            }

            grunt.file.write(css.dest, data);

            return;
        };

        // Process starter
        grunt.util.async.forEach(this.data.spritelist, _spriteSmithWrapper, function (err) {
            var j,
                max = that.data.csslist.length;

            for (j = 0; j < max; j++) {
                _insertSprites(that.data.csslist[j]);
            }

            done();
        });
    });
};

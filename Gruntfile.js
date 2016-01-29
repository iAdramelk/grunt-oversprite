module.exports = function (grunt) {

    "use strict";

    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'tasks/**/*.js'],
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: true
            }
        },
        clean: {
            dist: {
                options: {
                    force: true
                },
                src: [
                    'examples/publish/sprite1.png',
                    'examples/publish/sprite2.jpg',
                    'examples/publish/style.sprite.css',
                    'examples/publish/style.sprite.ie.css'
                ]
            }
        },
        oversprite: {
            publish: {
                spritelist: [
                    {
                        'src': ['examples/blocks/b-images-1/*'],
                        'dest': 'examples/publish/sprite1.png',
                        'algorithm': 'alt-diagonal',
                        'padding': 10,
                        'exportOpts': {
                            'format': 'png',
                            'quality': 90
                        }
                    },
                    {
                        'src': ['examples/blocks/b-images-2/*'],
                        'dest': 'examples/publish/sprite2.jpg',
                        'exportOpts': {
                            'format': 'jpg',
                            'quality': 90
                        }
                    }

                ],
                csslist: [
                    {
                        'src': 'examples/publish/style.css',
                        'dest': 'examples/publish/style.sprite.css'
                    },
                    {
                        'src': 'examples/publish/style.ie.css',
                        'dest': 'examples/publish/style.sprite.ie.css',
                        'base': '../blocks/'
                    }
                ]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask("default", ["jshint", "clean", "oversprite"]);

    grunt.loadTasks("tasks");

};

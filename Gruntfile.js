/*
 * This file is part of the Sonatra package.
 *
 * (c) François Pluchino <francois.pluchino@sonatra.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*  global module */
/*  global grunt */

module.exports = function (grunt) {
    'use strict';

    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        watch: {
            options: {
                nospawn: true
            },
            default: {
                files: [
                    '/*.html',
                    '/*.css',
                    '**/*.less'
                ],
                tasks: ['less']
            }
        },
        browserSync: {
            options: {
                notify: false,
                port: 9000,
                open: true,
                startPath: "/"
            },
            seed: {
                options: {
                    watchTask: true,
                    injectChanges: false,
                    server: {
                        baseDir: ['examples'],
                        routes: {
                            "/bower_components": "bower_components",
                            "/js": "js",
                            "/css": "css"
                        }
                    }
                },
                bsFiles: {
                    src: [
                        './**/*.{css,html,js}'
                    ]
                }
            }
        },
        less: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    "css/table-select.css": "less/table-select.less"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('serve', function () {
        grunt.task.run([
            'less',
            'browserSync:seed',
            'watch'
        ]);
    });

    grunt.registerTask('default', [
        'serve'
    ]);
};
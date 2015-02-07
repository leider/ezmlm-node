module.exports = function (grunt) {
  'use strict';

  // set up common objects for jslint
  var jsLintStandardOptions = {edition: 'latest', errorsOnly: true, failOnError: true},

    libDirectives = function () {
      return {indent: 2, node: true, nomen: true, todo: true, unparam: true, vars: true};
    },
    jsLintLibDirectives = libDirectives(),
    jsLintLibTestDirectives = libDirectives();
  jsLintLibTestDirectives.ass = true;
  jsLintLibTestDirectives.predef = ['afterEach', 'after', 'beforeEach', 'before', 'describe', 'it'];

  grunt.initConfig({
    clean: {
      coverage: ['coverage'],
      options: {force: true}
    },
    jslint: {
      lib: {
        src: [
          'lib/**/*.js'
        ],
        directives: jsLintLibDirectives,
        options: jsLintStandardOptions
      },
      libtests: {
        src: [
          'spec/**/*.js'
        ],
        directives: jsLintLibTestDirectives,
        options: jsLintStandardOptions
      }
    },

    mocha_istanbul: {
      test: {
        src: 'spec',
        options: {
          coverageFolder: 'coverage',
          timeout: 6000,
          slow: 100,
          mask: '**/*.js',
          root: 'lib',
          reporter: 'dot',
          check: {
            lines: 90,
            statements: 90
          }
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-jslint');

  grunt.registerTask('tests', ['clean', 'jslint', 'mocha_istanbul']);

  // Default task.
  grunt.registerTask('default', ['tests']);

  // Travis-CI task
  grunt.registerTask('travis', ['default']);
};

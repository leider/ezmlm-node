'use strict';
module.exports = function (grunt) {
  /*eslint camelcase: 0*/
  grunt.initConfig({
    clean: {
      coverage: ['coverage'],
      options: {force: true}
    },
    eslint: {
      options: {quiet: true},
      target: ['**/*.js']
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
  grunt.loadNpmTasks('grunt-eslint');

  grunt.registerTask('tests', ['clean', 'eslint', 'mocha_istanbul']);

  // Default task.
  grunt.registerTask('default', ['tests']);

  // Travis-CI task
  grunt.registerTask('travis', ['default']);
};

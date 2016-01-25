'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    eslint: {
      src: ['Gruntfile.js', 'server.js', 'libs/*.js', 'src/*.js', 'config/*.js'],
      options: {
        configFile: 'grunt-config/eslint.json'
      }
    }
  });

  //Register task(s)
  grunt.loadNpmTasks('gruntify-eslint');
  grunt.registerTask('default', ['eslint']);
};

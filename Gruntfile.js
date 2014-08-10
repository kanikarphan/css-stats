module.exports = function(grunt) {

  grunt.initConfig({
    csscss: {
      output: {
        options: {
          verbose: true,
          outputJson: true
        },
        files: {
          './output/csscss.json': grunt.option('target')
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-csscss');

  grunt.registerTask('duplicate', ['csscss']);
};
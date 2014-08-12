module.exports = function(grunt) {

  grunt.initConfig({
    csscss: {
      output: {
        options: {
          verbose: true,
          outputJson: true
        },
        files: {
          './tmp/csscss.json': grunt.option('css')
        }
      }
    },
    copy: {
      output: {
        src: './tmp/csscss.json',
        dest: grunt.option('path') + '/csscss.json'
      }
    },
    clean: {
      temp: ['./tmp']
    }
  });

  grunt.loadNpmTasks('grunt-csscss');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('duplicate', ['csscss', 'copy', 'clean']);
};
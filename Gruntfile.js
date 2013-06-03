module.exports = function(grunt) {
  // - Read in --browsers CLI option; split it on commas into an array if it's a string, otherwise ignore it
  var browsers = typeof grunt.option('browsers') == 'string' ? grunt.option('browsers').split(',') : undefined;

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    srcFiles: 'src/**/*.js',

    defaultBrowsers: ['PhantomJS'],

    clean: {
      build: {
        src: ['dist/']
      }
    },

    karma: {
      unit: {
        options: {
          configFile: 'test/config/karma.conf.js',
          autoWatch: false,
          singleRun: true,
          browsers: browsers || '<%= defaultBrowsers %>'
        },
      },
      watch: {
        options: {
            configFile: 'test/config/karma.conf.js',
            autoWatch: false,
            browsers: browsers || '<%= defaultBrowsers %>'
        },
        background: true
      },
    },

    watch: {
      // Auto-build when source files change
      build: {
          files: ['src/**/*.js'],
          tasks: ['build']
      },
      // Run unit test with karma
      karma: {
          files: ['dist/**/*.js'],
          tasks: ['karma:watch:run']
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/**/*.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },

    jshint: {
      options: {
        boss: true,
        browser: true,
        camelcase: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        forin: true,
        immed: true,
        // indent: 2,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        globals: {
          angular: false,
          $: false
        }
      },
      src: [ '<%= srcFiles %>' ],
      spec: {
        options: {
          camelcase: false,
          globals: {
            $: false,
            angular: false,
            beforeEach: false,
            browser: false,
            browserTrigger: false,
            describe: false,
            expect: false,
            inject: false,
            input: false,
            it: false,
            module: false,
            repeater: false,
            runs: false,
            spyOn: false,
            waits: false,
            waitsFor: false,

            ngGridWYSIWYGPlugin: false,
            ngMidwayTester: false
          }
        },
        files: {
          spec: ['test/**/*.js', '!test/lib/**/*.js']
        },
      }
    }
  });

  grunt.registerTask('test', [ 'jshint', 'build', 'karma:run' ]);
  grunt.registerTask('debug', ['karma:watch', 'watch']);

  grunt.registerTask('build', [ 'uglify' ]);

  grunt.registerTask('default', [ 'test' ]);
};
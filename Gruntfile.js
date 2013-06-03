module.exports = function(grunt) {
  // - Read in --browsers CLI option; split it on commas into an array if it's a string, otherwise ignore it
  var browsers = typeof grunt.option('browsers') == 'string' ? grunt.option('browsers').split(',') : undefined;

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
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

    concat: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: [ '<%= srcFiles %>' ],
        dest: 'dist/<%= pkg.name %>.js'
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
      // Re-lint test and sourc files when they change
      jshint: {
        files: ['test/**/*.js', 'dist/**/*.js', '!test/config/*'],
        tasks: ['jshint']
      },
      // Auto-build when source files change
      build: {
        files: ['src/**/*.js'],
        tasks: ['build']
      },
      // Run unit test with karma
      karma: {
        files: ['test/**/*.js', 'dist/**/*.js', '!test/config/*'],
        tasks: ['karma:watch:run']
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
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
        // unused: true,
        globals: {
          angular: false,
          // $: false,
          matchMedia: false,
          dump: false,
          console: false
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
            dump: false,
            expect: false,
            inject: false,
            input: false,
            it: false,
            module: false,
            repeater: false,
            runs: false,
            spyOn: false,
            waits: false,
            waitsFor: false
          }
        },
        files: {
          spec: ['test/**/*.js', '!test/lib/**/*.js', '!test/config/*']
        },
      }
    }
  });

  grunt.registerTask('test', [ 'jshint', 'build', 'karma:run' ]);
  grunt.registerTask('debug', ['karma:watch', 'watch']);

  grunt.registerTask('build', [ 'jshint', 'concat', 'uglify' ]);

  grunt.registerTask('default', [ 'test' ]);
};

// TODO: add grunt-contrib-connect

// connect: {
//   server: {
//     options: {
//       port: 9001,
//       base: 'test/assets' // <-- put images here!
//     }
//   }
// }
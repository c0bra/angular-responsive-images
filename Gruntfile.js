module.exports = function(grunt) {
  // - Read in --browsers CLI option; split it on commas into an array if it's a string, otherwise ignore it
  var browsers = typeof grunt.option('browsers') == 'string' ? grunt.option('browsers').split(',') : undefined;

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    srcFiles: 'src/**/*.js',
    builddir: 'dist',
    buildtag: '-dev-' + grunt.template.today('yyyy-mm-dd'),

    copy: {
      release: {
        files: [
          { src: 'bower.json', dest: 'release/bower.json' },
          { expand: true, src: '**/*.js', cwd: 'dist/', dest: 'release/js/' }
        ]
      }
    },

    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: ['pkg'],
        commitFiles: ['package.json', 'bower.json'],
        commit: true,
        createTag: false,
        push: false
      }
    },

    'gh-pages': {
      release: {
        options: {
          base: 'release',
          tag: 'v<%= pkg.version %>',
          message: 'Release v<%= pkg.version %>',
          add: true,
          push: true
        },
        src: ['**/*']
      }
    },

    defaultBrowsers: ['PhantomJS'],

    clean: ['<%= builddir %>', 'release'],

    concat: {
      options: {
        banner: '/**\n' +
                ' * <%= pkg.description %>\n' +
                ' * @version v<%= pkg.version %>\n' +
                ' * @link <%= pkg.repository.url %>\n' +
                ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
                ' */'
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
            singleRun: false,
            background: true,
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
        files: ['<%= srcFiles %>'],
        tasks: ['build'],
        options: {
          livereload: true
        }
      },
      // Run unit test with karma
      karma: {
        files: ['test/**/*.js', 'dist/**/*.js', '!test/config/*'],
        tasks: ['karma:watch:run']
      },
    },

    uglify: {
      options: {
        // banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        banner: '<%= concat.options.banner %>'
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    release: {
      files: ['<%= pkg.name %>.js', '<%= pkg.name %>.min.js'],
      src: '<%= builddir %>',
      dest: 'release'
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
            ddescribe: false,
            dump: false,
            expect: false,
            inject: false,
            input: false,
            it: false,
            iit: false,
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
  
  grunt.registerTask('default', [ 'test' ]);
  grunt.registerTask('test', "Jshint, build, and run unit tests", [ 'jshint', 'clean', 'build', 'karma:unit' ]);
  grunt.registerTask('debug', "Run watches and live reload server", ['karma:watch:start', 'watch']);
  grunt.registerTask('build', "Jshint, build from source and minify", ['jshint', 'concat', 'uglify' ]);
  grunt.registerTask('release', 'Tag and perform a release', ['clean', 'bump', 'build', 'copy:release', 'gh-pages']);
};
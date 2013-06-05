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
            singleRun: false,
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

  grunt.registerTask('test', "Jshint, build, and run unit tests", [ 'jshint', 'build', 'karma:unit' ]);
  grunt.registerTask('debug', "Run watches and live reload server", ['karma:watch', 'watch']);

  grunt.registerTask('build', "Jshint build from source and minify", [ 'jshint', 'concat', 'uglify' ]);

  grunt.registerTask('publish-pages', 'Publish a clean build, docs, and sample to github.io', function () {
    promising(this,
      ensureCleanMaster().then(function () {
        shjs.rm('-rf', 'build');
        return system('git checkout gh-pages');
      }).then(function () {
        return system('git merge master');
      }).then(function () {
        return system('grunt build');
      }).then(function () {

        // return system('git commit', '-a -m \'Automatic gh-pages build\'');
        cexec('git commit -a -m \'Automatic gh-pages build\'', function (error, stdout, stderr) {
          grunt.log.writeln('stdout: ' + stdout);
          grunt.log.writeln('stderr: ' + stderr);
          if (error !== null) {
            grunt.log.writeln('exec error: ' + error);
          }
        });

      }).then(function () {
        return system('git checkout master'); 
      })
    );
  });


  // Helpers for custom tasks, mainly around promises / exec
  var exec = require('faithful-exec'), shjs = require('shelljs');
  var cexec = require('child_process').exec;

  function system(cmd, opts) {
    if (opts) {
      grunt.log.write('% ' + cmd + ' ' + opts + '\n');
      return exec(cmd, opts).then(function (result) {
        grunt.log.write(result.stderr + result.stdout);
      }, function (error) {
        grunt.log.write(error);
        grunt.log.write(error.stderr + '\n');
        throw 'Failed to run \'' + cmd + '\'';
      });
    }
    else {
      grunt.log.write('% ' + cmd + '\n');
      return exec(cmd).then(function (result) {
        grunt.log.write(result.stderr + result.stdout);
      }, function (error) {
        grunt.log.write(error.stderr + '\n');
        throw 'Failed to run \'' + cmd + '\'';
      });
    }
  }

  function promising(task, promise) {
    var done = task.async();
    promise.then(function () {
      done();
    }, function (error) {
      grunt.log.write(error + '\n');
      done(false);
    });
  }

  function ensureCleanMaster() {
    return exec('git symbolic-ref HEAD').then(function (result) {
      if (result.stdout.trim() !== 'refs/heads/master') throw 'Not on master branch, aborting';
      return exec('git status --porcelain');
    }).then(function (result) {
      if (result.stdout.trim() !== '') throw 'Working copy is dirty, aborting';
    });
  }
};

function finished(code){ return this(code === 0); }
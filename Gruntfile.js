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
    builddir: 'dist',
    buildtag: '-dev-' + grunt.template.today('yyyy-mm-dd'),

    defaultBrowsers: ['PhantomJS'],

    clean: ['<%= builddir %>'],

    concat: {
      options: {
        banner: '/**\n' +
                ' * <%= pkg.description %>\n' +
                ' * @version v<%= pkg.version %><%= buildtag %>\n' +
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
  grunt.registerTask('test', "Jshint, build, and run unit tests", [ 'jshint', 'build', 'karma:unit' ]);
  grunt.registerTask('debug', "Run watches and live reload server", ['karma:watch', 'watch']);
  grunt.registerTask('build', "Jshint build from source and minify", [ 'jshint', 'concat', 'uglify' ]);
  grunt.registerTask('release', 'Tag and perform a release', ['prepare-release', 'build', 'perform-release']);

  var path = require('path');
  var makePromise = require('make-promise');
  // grunt.registerTask('publish-pages', 'Publish a clean build, docs, and sample to github.io', function () {
  //   promising(this,
  //     ensureCleanMaster().then(function () {
  //       // Remove anything in the build dir
  //       shjs.rm('-rf', 'dist');

  //       // Move to the gh-pages branch
  //       return system('git checkout gh-pages');
  //     }).then(function () {
  //       // Merge the master branch changes in
  //       return system('git merge master');
  //     }).then(function () {
  //       // Build from source
  //       return system('grunt build');
  //     }).then(function () {
  //       // Copy the built files to their versioned counterparts
  //       var version = grunt.config('pkg.version');



  //       var bigfile = grunt.config('uglify.build.src');
  //       var bigFileDir = path.dirname(bigfile);
  //       var bigfileName = path.basename(bigfile, path.extname(bigfile));

  //       var bigfile = grunt.config('uglify.build.src');
  //       var bigFileDir = path.dirname(bigfile);
  //       var bigfileName = path.basename(bigfile, path.extname(bigfile));

  //       return system('cp ' + grunt.config('uglify.build.src') +  );
  //     }).then(function () {
  //       return system('git diff --exit-code', {}, true).then(function(){},
  //         function(){
  //           return system('git commit --allow-empty-message -a');
  //         });

  //     }).then(function () {
  //       return system('git checkout master');
  //     })
  //   );
  // });

  grunt.registerTask('prepare-release', function () {
    var bower = grunt.file.readJSON('bower.json'),
        version = bower.version;
    if (version != grunt.config('pkg.version')) throw 'Version mismatch in bower.json';

    promising(this,
      ensureCleanMaster().then(function () {
        return exec('git tag -l \'' + version + '\'');
      }).then(function (result) {
        if (result.stdout.trim() !== '') throw 'Tag \'' + version + '\' already exists';
        grunt.config('buildtag', '');
        grunt.config('builddir', 'release');
      })
    );
  });

  grunt.registerTask('perform-release', function () {
    grunt.task.requires([ 'prepare-release', 'build' ]);

    var version = grunt.config('pkg.version'), releasedir = grunt.config('builddir');
    promising(this,
      system('git add \'' + releasedir + '\'').then(function () {
        return system('git commit -m \'release ' + version + '\'');
      }).then(function () {
        return system('git tag \'' + version + '\'');
      })
    );

    // Update the versioned files in the gh-pages repo
  });

  // grunt.registerTask('version', 'Change the version to X' function() {
  //   // Get the version argument

  //   // Change version with npm
  //   promising(this,
  //     system('npm version').then(function(){
  //       // Change version in bower file
  //     })
  //   );
  // });

  // Helpers for custom tasks, mainly around promises / exec
  var exec = require('faithful-exec'), shjs = require('shelljs');
  var cexec = require('child_process').exec;

  function system(cmd, opts, allowError) {
    grunt.log.write('% ' + cmd + '\n');
    return exec(cmd, opts).then(function (result) {
      grunt.log.write(result.stderr + result.stdout);
    }, function (error) {
      if (!allowError) {
        grunt.log.write(error);
        grunt.log.write(error.stderr + '\n');
        throw 'Failed to run \'' + cmd + '\'';
      }
    });
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
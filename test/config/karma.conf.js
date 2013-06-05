basePath = '../../';

files = [
  JASMINE,
  JASMINE_ADAPTER,

  // 3rd-party code
  'test/lib/angular.js',
  'test/lib/angular-mocks.js',
  // 'test/lib/angular/browserTrigger.js',

  // App code
  'dist/angular-responsive-images.js',
  
  // Test specs
  // 'test/unit/**/*.js'
  'test/**/*.js'
];

exclude = ['test/config/*']; // , 'test/lib/*'

autoWatch = true;

singleRun = true;

browsers = ['PhantomJS'];

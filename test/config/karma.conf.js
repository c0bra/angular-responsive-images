basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,

  // 3rd-party code
  'lib/angular.js',
  'test/lib/angular/angular-mocks.js',
  'test/lib/angular/browserTrigger.js',

  // App code
  'build/ng-res-img.js',
  
  // Test specs
  'test/unit/**/*.js'
];

autoWatch = true;

browsers = ['PhantomJS'];

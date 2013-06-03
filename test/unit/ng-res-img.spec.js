(function() {

"use strict";

describe('ngSrcResponsive', function () {
  var elm, $scope, $compile;

  beforeEach(module('ngResImg'));

  beforeEach(inject(['$rootScope', '$compile', function ($rootScope, _$compile_) {
    // TODO: create and compile the directive here
    $scope = $rootScope;
    $compile = _$compile_;

    elm = angular.element('<img src="orig.jpg" ng-src-responsive="{ \'(min-width: 0px)\': \'default.jpg\' }" />');

    $compile(elm)($scope);
    $scope.$digest();
  }]));

  // TODO: It must
  //   1. Not prevent the loading of the initial src attribute value
  //   2. Accept a media query and href value to the ng-src-responsive="" attribute
  //   3. Correctly run matchMedia queries to get which href to load
  //   4. Load the correct href based on the viewport size
  //   5. Handle viewport change events for swapping out images
  //      a. I think this means we'll need to cache the image? Or maybe the browser should handle it?

  describe('with a single always-matching query', function() {
    it('should set the src to the appropriate image', function() {
      dump(elm);

      expect(elm.attr('src')).toEqual('default.jpg');
    });
  });

  // QUESTION: do we need to use $httpBackend to receive the image requests and then respond with data: tags? Will that work? Or can we just watch the src="" attr?
});

})();
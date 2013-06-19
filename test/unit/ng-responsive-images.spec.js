(function() {

"use strict";

describe('ngSrcResponsive', function () {
  var elm, $scope, $compile, $timeout,
      recompile,
      htmlWrap,
      viewportWidth, viewportHeight;

  beforeEach(module('ngResponsiveImages'));

  beforeEach(inject(['$rootScope', '$compile', '$timeout', function ($rootScope, _$compile_, _$timeout_) {
    // TODO: create and compile the directive here
    $scope = $rootScope;
    $compile = _$compile_;
    $timeout = _$timeout_;

    elm = angular.element('<img src="orig.jpg" ng-src-responsive="[ [ \'(min-width: 0px)\', \'default.jpg\' ] ]" />');

    $compile(elm)($scope);
    $scope.$digest();
    $timeout.flush(); // Have to call $timeout.flush() because we update the image source within a timeout to prevent concurrent updates during media query changes

    // Re-usable function to recompile the element
    recompile = function(elm) {
      elm = angular.element(elm);
      $compile(elm)($scope);
      $scope.$digest();
      $timeout.flush();
      return elm;
    };

    // TODO: can probably remove this as we can't force viewport size
    htmlWrap = function(elm) {
      var htmlHead = '<html><head><meta name="viewport" content="width=9px; initial-scale=1.0; maximum-scale=1.0;"></head><body>';
      var htmlFoot = '</body></html>';
      elm = recompile(htmlHead + elm + htmlFoot);
      return elm;
    };

    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
  }]));

  // TODO: It must
  //   1. Not prevent the loading of the initial src attribute value
  //   2. Accept a media query and href value to the ng-src-responsive="" attribute
  //   3. Correctly run matchMedia queries to get which href to load
  //   4. Load the correct href based on the viewport size
  //   5. Handle viewport change events for swapping out images
  //      a. I think this means we'll need to cache the image? Or maybe the browser should handle it?

  describe('when the directive does not evaluate to an array', function() {
    it('should throw an exception', function() {
      expect(function(){
        recompile('<img src="orig.jpg" ng-src-responsive="{ \'(min-width: 0px)\': \'default.jpg\' }" />');
      }).toThrow();
    });
  });

  describe('with a single query of min-width: 0', function() {
    describe('and one responsive source and a global media query', function() {
      it('should set the src to the only available image', function() {
        expect(elm.attr('src')).toEqual('default.jpg');
      });
    });
  });

  describe('with two responsive sources where the final one is innerWidth+1', function() {
    beforeEach(function(){
      elm = recompile('<img src="orig.jpg" ng-src-responsive="[ [ \'(min-width: 10px)\', \'default1.jpg\' ], [ \'(min-width: ' + (viewportWidth+1) + 'px)\', \'default2.jpg\' ] ]" />');
    });

    it('should choose the first (smaller) one', function() {
      expect(elm.attr('src')).toEqual('default1.jpg');
    });
  });

  describe('with two responsive sources where the final one is innerWidth-1', function() {
    beforeEach(function(){
      elm = recompile('<img src="orig.jpg" ng-src-responsive="[ [ \'(min-width: 10px)\', \'default1.jpg\' ], [ \'(min-width: ' + (viewportWidth-1) + 'px)\', \'default2.jpg\' ] ]" />');
    });

    it('should choose the second (larger) one', function() {
      expect(elm.attr('src')).toEqual('default2.jpg');
    });
  });

  describe('when using an expression as an image source', function() {
    beforeEach(function() {
      $scope.imgSrc = 'evaluated.jpg';
      elm = recompile('<img src="orig.jpg" ng-src-responsive="[ [ \'(min-width: 0px)\', \'{{ imgSrc }}\' ] ]" />');
    });

    it('should evaluate the expression to get the value', function() {
      expect(elm.attr('src')).toEqual('evaluated.jpg');
    });
  });

  // TODO: add specs for event-based media queries. But how do we do that?
});

})();
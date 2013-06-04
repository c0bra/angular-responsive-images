(function() {

"use strict";

describe('ngSrcResponsive', function () {
  var elm, $scope, $compile,
      recompile,
      htmlWrap;

  beforeEach(module('ngResImg'));

  beforeEach(inject(['$rootScope', '$compile', function ($rootScope, _$compile_) {
    // TODO: create and compile the directive here
    $scope = $rootScope;
    $compile = _$compile_;

    elm = angular.element('<img src="orig.jpg" ng-src-responsive="[ [ \'(min-width: 0px)\', \'default.jpg\' ] ]" />');

    $compile(elm)($scope);
    $scope.$digest();

    // Re-usable function to recompile the element
    recompile = function(elm) {
      elm = angular.element(elm);
      $compile(elm)($scope);
      $scope.$digest();
      return elm;
    };

    htmlWrap = function(elm) {
      var htmlHead = '<html><head><meta name="viewport" content="width=9px; initial-scale=1.0; maximum-scale=1.0;"></head><body>';
      var htmlFoot = '</body></html>';
      elm = recompile(htmlHead + elm + htmlFoot);
      return elm;
    }
  }]));

  // TODO: It must
  //   1. Not prevent the loading of the initial src attribute value
  //   2. Accept a media query and href value to the ng-src-responsive="" attribute
  //   3. Correctly run matchMedia queries to get which href to load
  //   4. Load the correct href based on the viewport size
  //   5. Handle viewport change events for swapping out images
  //      a. I think this means we'll need to cache the image? Or maybe the browser should handle it?

  describe('with a single always-matching query', function() {
    describe('and one responsive source and a global media query', function() {
      it('should set the src to the only available image', function() {
        expect(elm.attr('src')).toEqual('default.jpg');
      });
    });

    describe('with two responsive sources and a viewport of 10px', function() {
      beforeEach(function(){
        elm = htmlWrap('<img src="orig.jpg" ng-src-responsive="[ [ \'(min-width: 10px)\', \'default1.jpg\' ], [ \'(min-width: 20px)\', \'default2.jpg\' ] ]" />');
      });

      it('should choose the smaller one', function() {
        var img = elm.find('img');
        dump(elm);
        expect(img).toBeDefined();

        expect(img.attr('src')).toEqual('default1.jpg');
        expect(1).toBe(2);
      });
    });
  });

  // QUESTION: do we need to use $httpBackend to receive the image requests and then respond with data: tags? Will that work? Or can we just watch the src="" attr?
});

})();
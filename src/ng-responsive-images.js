(function(){

var app = angular.module('ngResImg', []);

// Default queries (stolen from Zurb Foundation)
app.value('defaultQueries', {
  'default':   'only screen and (min-width: 1px)',
  'small':     'only screen and (min-width: 768px)',
  'medium':    'only screen and (min-width: 1280px)',
  'large':     'only screen and (min-width: 1440px)',
  'landscape': 'only screen and (orientation: landscape)',
  'portrait':  'only screen and (orientation: portrait)',
  'retina':    'only screen and (-webkit-min-device-pixel-ratio: 2), ' +
               'only screen and (min--moz-device-pixel-ratio: 2), ' +
               'only screen and (-o-min-device-pixel-ratio: 2/1), ' +
               'only screen and (min-device-pixel-ratio: 2), ' +
               'only screen and (min-resolution: 192dpi), ' +
               'only screen and (min-resolution: 2dppx)'
});

app.directive('ngSrcResponsive', ['defaultQueries', function(defaultQueries) {
  // console.log('WELL HI!');

  return {
    restrict: 'A',
    scope: {
      src: '@'
      // resSrc: '@ngSrcResponsive'
    },
    link: function(scope, elm, attrs) {
      // Double-check that the matchMedia function matchMedia exists
      if (typeof(matchMedia) !== 'function') {
        throw "Function 'matchMedia' does not exist";
      }

      // console.log('Hi there!');

      // var mqs = [];

      // Query that gets run on link, whenever the directive attr changes, and whenever 
      function updateFromQuery(querySets) {
        // Destroy registered listeners, we will re-register them below
        // angular.forEach(listenerDeregs, function(dereg) {
          
        // });

        var lastTrueQuerySet;

        // for (var query in querySets) {
        angular.forEach(querySets, function(set) {
          // if (querySets.hasOwnProperty(query)) {

          var queryText = set[0];

          var query = queryText;
          if (defaultQueries.hasOwnProperty(queryText)) {
            query = defaultQueries[queryText];
          }

          var mq = matchMedia(query);

          if (mq.matches) {
            lastTrueQuerySet = set;
          }

          // Add a listener for when this query matches
          // mq.addListener(function() {
          //   setSrc(src);
          // });
          // }
        });

        if (lastTrueQuerySet) {
          setSrc( lastTrueQuerySet[1] );
        }
      }

      function setSrc(src) {
        elm.attr('src', src);
      }

      attrs.$observe('ngSrcResponsive', function(value) {
        var querySets = scope.$eval(value);
        if (! querySets instanceof Array) {
          throw "Expected evaluate ng-src-responsive to evaluate to an Array, instead got: " + querySets;
        }
        updateFromQuery(querySets);
      });
    }
  };
}]);

})();
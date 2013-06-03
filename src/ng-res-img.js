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

        var lastTrueQuery;

        for (var query in querySets) {
          if (querySets.hasOwnProperty(query)) {
            if (defaultQueries.hasOwnProperty(query)) {
              query = defaultQueries[query];
            }

            var mq = matchMedia(query);
            dump(query);

            if (mq.matches) {
              lastTrueQuery = query;
            }

            // Add a listener for when this query matches
            // mq.addListener(function() {
            //   setSrc(src);
            // });
          }
        }

        if (lastTrueQuery) {
          setSrc( querySets[lastTrueQuery] );
        }
      }

      function setSrc(src) {
        elm.attr('src', src);
      }

      attrs.$observe('ngSrcResponsive', function(value) {
        var querySets = scope.$eval(value);
        updateFromQuery(querySets);
      });
    }
  };
}]);

})();
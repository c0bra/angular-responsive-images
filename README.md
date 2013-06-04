# Angular Responsive Images

Angular directive for handling responsive images.

# Requirements

* [AngularJS](http://angularjs.org)
* Paul Irish's [matchMedia() polyfill](https://github.com/paulirish/matchMedia.js/) if you want to support older browsers

# Usage

The `ng-src-responsive` directive takes an array of arrays. The inner arrays each have two elements, the first being the media query and the second being the href of the image to load if that media query matches. The *last* matcing media query gets used so order your array from smallest to largest.

Also you can use a default small image for `src=""` as that will always get loaded, and can prevent weird page reflows when we alter the `src` after your angular app is loaded.

```javascript
// In your script file, inject the ngResponsiveImages module
var app = angular.module('yourModule', ['ngResponsiveImages']);
```

```html
<!-- Use the ng-src-responsive directive to set up your queries and sources -->
<img src="small_image.jpg" ng-src-responsive="[ [ '(min-width: 960px)': 'larger_image.jpg' ], [ '(min-width: 1700px': 'much_larger_image.jpg' ] ]" />
```

# Media Query Presets

Here are some useful presets that you can use, which were stolen from [Foundation](http://foundation.zurb.com/docs/components/interchange.html).

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Media Query</th>
    </tr>
  <tbody>
    <tr>
      <td><strong>default</strong></td>
      <td>only screen and (min-width: 1px)</td>
    </tr>
    <tr>
      <td><strong>small</strong></td>
      <td>only screen and (min-width: 768px)</td>
    </tr>
    <tr>
      <td><strong>medium</strong></td>
      <td>only screen and (min-width: 1280px)</td>
    </tr>
    <tr>
      <td><strong>large</strong></td>
      <td>only screen and (min-width: 1440px)</td>
    </tr>
    <tr>
      <td><strong>landscape</strong></td>
      <td>only screen and (orientation: landscape)</td>
    </tr>
    <tr>
      <td><strong>portrait</strong></td>
      <td>only screen and (orientation: portrait)</td>
    </tr>
    <tr>
      <td><strong>retina</strong></td>
      <td>
        only screen and (-webkit-min-device-pixel-ratio: 2),
        <br>
        only screen and (min--moz-device-pixel-ratio: 2),
        <br>
        only screen and (-o-min-device-pixel-ratio: 2/1),
        <br>
        only screen and (min-device-pixel-ratio: 2),
        <br>
        only screen and (min-resolution: 192dpi),
        <br>
        only screen and (min-resolution: 2dppx)
      </td>
    </tr>
  </tbody>
</table>

## Example

```html
<img src="blah.jpg" ng-src-responsive="[ [ 'retina': 'big_retina_image.jpg' ] ]" />
```

# Testing

It's difficult to test different viewport sizes, or at least difficult enough that a moron like me can't figure it out. So right now I dynamically get the `window` `innerWidth` and `innerHeight` properties to know what the testing browser has, then my tests run off that.

The test tasks a pretty simple:

    grunt test # Lint, build from source, and run the test suite

    grunt debug # Start a watch for the files. Re-lint, re-build, and run tests when the source files change;
                # re-lint and run tests when the test spec files change.

You can also pass a --browsers option to these tasks (the default browser is PhantomJS):

    grunt debug --browsers=Chrome,Firefox,PhantomJS,IE # Automatically run the test suite in all 4 browsers

# Todo

* Remove weird Gruntfile tasks that I added*
* Handle updates g-src-responsive bound values...
* Add handling of ng-src
* Add pretty auto-generated gh-pages branch with examples of the same code in a bunch of different iframes``
* Add bower.json

# Acknowledgements

The idea for this directive came from Foundation's [interchange](http://foundation.zurb.com/docs/components/interchange.html) attribute. Also their media query preset were merciless stolen.
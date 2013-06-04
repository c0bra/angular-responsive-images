var page = require('webpage').create();
page.open('http://localhost:9876', function () {
  page.evaluate(function () {});
  // phantom.exit();
});
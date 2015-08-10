if(!require.config){
	var require = require('requirejs');
} else {
	window.onerror = function(e) {
		console.error(e);
	};
}
require.config({
	baseDir: './',
	paths: {
		domReady: "bower_components/requirejs-domready/domReady",
		json: "bower_components/requirejs-json/json",
		text: "bower_components/requirejs-text/text",
		stache: "bower_components/requirejs-mustache/stache",
		mustache: "bower_components/mustache/mustache",
	},
	stache: {
		extension: ".stache",
		path: "templ/"
	},
	packages: [

	]
});
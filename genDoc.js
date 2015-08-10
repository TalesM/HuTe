#!/usr/bin/nodejs
fs = require('fs');
conf = require('./config.js')
require = require('requirejs')
var input = 'movi.json';
var template = 'teste';
var output = 'gen/roteiroTests.html';
require(['json!tests/'+input, 'stache!'+template], function(inputJson, template) {
	inputJson.pages.forEach(function(elem) {
		var j = 1;
		elem.tests.forEach(function(test){
			test.index = j++;
		});
	})
	var outputHtml = template(inputJson);
	fs.writeFile(output, outputHtml, {encoding: 'ascii'}, function(err) {
		if (err) throw err;
		console.log('It\'s saved!');
	});
});

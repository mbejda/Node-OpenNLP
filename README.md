NodeJs OpenNLP
===============
[![NPM](https://travis-ci.org/mbejda/Node-OpenNLP.svg?branch=master)](https://nodei.co/npm/opennlp/)
Apache OpenNLP wrapper for NodeJs <br>
To learn more about Apache OpenNLP [Click Here](https://opennlp.apache.org). <br>

## Installation : 
This Library use Node Java. Make sure you have properly installed and configured [Node Java](https://github.com/joeferner/node-java) in your setup.

Run  ** npm install opennlp **

Opennlp comes with **Apache OpenNLP 1.5.3.** along with the following trained models **(1.5 Series)**. 

 * en-chunker.bin
 * en-ner-person.bin
 * en-pos-maxent.bin
 * en-sent.bin
 * en-token.bin

More models can be found here.  
http://opennlp.sourceforge.net/models-1.5/


## Getting Started With The Utility Methods: 
The utility methods do simple Java castings for you. 
```javascript
var openNLP = require("opennlp");
var sentence = 'Pierre Vinken , 61 years old , will join the board as a nonexecutive director Nov. 29 .';
var tokenizer = new openNLP().tokenizer;
tokenizer.tokenize(sentence, function(err, results) {
	console.log(results)
});
var nameFinder = new openNLP().nameFinder;
nameFinder.find(sentence, function(err, results) {
	console.log(results)
});
var posTagger = new openNLP().posTagger;
posTagger.tag(sentence, function(err, results) {
	console.log(results)
});
var sentenceDetector = new openNLP().sentenceDetector;
sentenceDetector.sentDetect(sentence, function(err, results) {
	console.log(results)
});
var posTagger = new openNLP().posTagger;
var chunker = new openNLP().chunker;
posTagger.tag(sentence, function(err, tokens) {
	chunker.chunk(sentence, tokens, function(err, results) {
		console.log(results)
	});
});
```
## Instances:
You can get the OpenNLP API instance through the instance parameter.
```javascript
var o = new openNLP();
o.instance.nameFinder(function(err instance){
});
```
## Models:
You can use your own models by defining their paths.
```javascript
var options = {
    models : {
        posTagger: __dirname + '/models/en-pos-maxent.bin',
		tokenizer: __dirname + '/models/en-token.bin',
		nameFinder: __dirname + '/models/en-ner-person.bin',
		sentenceDetector: __dirname + '/models/en-sent.bin',
		chunker: __dirname + '/models/en-chunker.bin'
	},
	openNLP = {
		jar: __dirname + "/lib/opennlp-tools-1.5.3.jar"
	}
}
var o = new openNLP(options);
```
[![Support via Gratipay](https://cdn.rawgit.com/gratipay/gratipay-badge/2.3.0/dist/gratipay.svg)](https://gratipay.com/mbejda/)
[![NPM](https://nodei.co/npm/opennlp.png)](https://nodei.co/npm/opennlp/)

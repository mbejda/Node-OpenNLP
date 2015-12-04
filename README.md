
NodeJs OpenNLP
===============
[![NPM](https://travis-ci.org/mbejda/Node-OpenNLP.svg?branch=master)](https://nodei.co/npm/opennlp/)

# Node OpenNLP - (OpenNLP 1.6.0)
## OpenNLP Wrapper For Node.js
Node-OpenNLP is depended on `Node-Java`. Please take make sure your environment is properly configured to run `Node-Java`.  Click [here](https://github.com/joeferner/node-java) to learn more about `Node-Java`.

### Installation
```
 npm install opennlp --save
```
Node-OpenNLP comes with **Apache OpenNLP 1.6.0** along with the following trained 1.5 series models:

 * en-chunker.bin
 * en-ner-person.bin
 * en-pos-maxent.bin
 * en-sent.bin
 * en-token.bin

More trained models can be found here:
http://opennlp.sourceforge.net/models-1.5

### Sentence Detector
The OpenNLP Sentence Detector can detect that a punctuation character marks the end of a sentence or not. In this sense a sentence is defined as the longest white space trimmed character sequence between two punctuation marks.

```Javascript
var openNLP = require("opennlp");
var sentence = 'Pierre Vinken , 61 years old , will join the board as a nonexecutive director Nov. 29 .';
var sentenceDetector = new openNLP().sentenceDetector;
sentenceDetector.sentDetect(sentence, function(err, results) {
  /// To get probabilities
    sentenceDetector.probs(function(error,probability){
      console.log(error,probability)
    })
	console.log(results)
});
```

### Configurations 
The following default configurations can be overrided during initialization. 
```Javascript
var openNLP = require("opennlp");
var opennlp = new openNLP({
    models : {
        doccat:__dirname + '/models/en-doccat.bin',
        posTagger: __dirname + '/models/en-pos-maxent.bin',
        tokenizer: __dirname + '/models/en-token.bin',
        nameFinder: __dirname + '/models/en-ner-person.bin',
        sentenceDetector: __dirname + '/models/en-sent.bin',
        chunker: __dirname + '/models/en-chunker.bin'
    },
    openNLP = {
        jar: __dirname + "/lib/opennlp-tools-1.6.0.jar"
    }
});

```

### Tokenizer
The OpenNLP Tokenizers segment an input character sequence into tokens. Tokens are usually words, punctuation, numbers, etc.

```Javascript
var openNLP = require("opennlp");
var sentence = 'Pierre Vinken , 61 years old , will join the board as a nonexecutive director Nov. 29 .';
var tokenizer = new openNLP().tokenizer;
tokenizer.tokenize(sentence, function(err, results) {
    console.log(err, results);
    tokenizer.getTokenProbabilities(function(error, response) {
            console.log(error, response
            });
    });
})
```

### Name Finder
The Name Finder can detect named entities and numbers in text. To be able to detect entities the Name Finder needs a model. The model is dependent on the language and entity type it was trained for.

```Javascript
var openNLP = require("opennlp");
var sentence = 'Pierre Vinken , 61 years old , will join the board as a nonexecutive director Nov. 29 .';
var nameFinder = new openNLP().nameFinder;
nameFinder.find(sentence, function(err, tokens_arr) {
    console.log(error, response)
    nameFinder.probs(function(error, response) {
        console.log(error, response)
    });
});
```


### Document Categorizer
The OpenNLP Document Categorizer can classify text into pre-defined categories. It is based on maximum entropy framework.


** To use the document categorizer you need to train a model first. The default trained model that is included is for testing purposes only. **
```Javascript
var openNLP = require("opennlp");
var doccat = new openNLP().doccat;
doccat.categorize("I enjoyed watching Rocky", function(err, list) {
    doccat.getAllResults(list, function(err, category) {
    });
    doccat.getBestCategory(list, function(err, category) {
    });
});
doccat.scoreMap("I enjoyed watching Rocky", function(err, category) {
});
doccat.sortedScoreMap("I enjoyed watching Rocky", function(err, category) {
});
doccat.getCategory(1, function(err, category) {
});
doccat.getIndex('Happy', function(err, index) {
});
```

### Part-of-Speech Tagger
The Part of Speech Tagger marks tokens with their corresponding word type based on the token itself and the context of the token. A token might have multiple pos tags depending on the token and the context. The OpenNLP POS Tagger uses a probability model to predict the correct pos tag out of the tag set.

``` Javascript
var openNLP = require("opennlp");
var posTagger = new openNLP().posTagger;
var sentence = 'Pierre Vinken , 61 years old , will join the board as a nonexecutive director Nov. 29 .';
posTagger.tag(sentence, function(err, tokens_arr) {
    console.log(err, tokens_arr)
});
posTagger.topKSequences(sentence, function(error, tagger) {
    console.log(tagger.getScore())
    console.log(tagger.getProbs())
    console.log(tagger.getOutcomes())
});
```
### Chunker
Text chunking consists of dividing a text in syntactically correlated parts of words, like noun groups, verb groups, but does not specify their internal structure, nor their role in the main sentence.

```Javascript
var openNLP = require("opennlp");
var posTagger = new openNLP().posTagger;
var sentence = 'Pierre Vinken , 61 years old , will join the board as a nonexecutive director Nov. 29 .';
var chunker = new openNLP().chunker;
posTagger.tag(sentence, function(err, tokens_arr) {
    chunker.topKSequences(sentence, tokens_arr, function(err, tokens_arr) {
      console.log(err, tokens_arr)
    });
    chunker.chunk(sentence, tokens_arr, function(err, tokens_arr) {
        chunker.probs(function(error, prob) {

        });
    });
});
```
<hr>
Please report any bugs. Feel free to send me a tweet if you need any help.
<hr>
Follow me on Twitter
[@notmilobejda](https://twitter.com/notmilobejda)<br>
My Blog
[mbejda.com](https://mbejda.com)<br>

[![Support via Gratipay](https://cdn.rawgit.com/gratipay/gratipay-badge/2.3.0/dist/gratipay.svg)](https://gratipay.com/mbejda/)
[![NPM](https://nodei.co/npm/opennlp.png)](https://nodei.co/npm/opennlp/)

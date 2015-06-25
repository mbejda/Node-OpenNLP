var extendy = require('extendy')
var openNLP = function(config) {
	var self = this;
	self.java = require('java');
	self.models = {
		posTagger: __dirname + '/models/en-pos-maxent.bin',
		tokenizer: __dirname + '/models/en-token.bin',
		nameFinder: __dirname + '/models/en-ner-person.bin',
		sentenceDetector: __dirname + '/models/en-sent.bin',
		chunker: __dirname + '/models/en-chunker.bin'
	}
	self.openNLP = {
		jar: __dirname + "/lib/opennlp-tools-1.5.3.jar"
	}
	if (config && config.models) {
		extendy(self.models, config.models);
	}
	if (config && config.openNLP) {
		extendy(self.openNLP, config.openNLP);
	}
	self.java.classpath.push(self.openNLP.jar);
	self.java.import('java.io.FileInputStream');
	return {
		tokenizer: {
			tokenize: function(sentence, cb) {
				return self.tokenizer(function(sentence, error, instance) {
					return instance.tokenize(sentence, cb)
				}.bind(null, sentence));
			}
		},
		nameFinder: {
			find: function(sentence, cb) {
				self.nameFinder(function(sentence, error, instance) {
					var sentence = sentence.split(' ');
					var newArray = self.java.newArray("java.lang.String", sentence);
					return instance.find(newArray, cb);
				}.bind(null, sentence));
			}
		},
		sentenceDetector: {
			sentDetect: function(sentence, cb) {
				return self.sentenceDetector(function(sentence, error, instance) {
					return instance.sentDetect(sentence, cb);
				}.bind(null, sentence));
			}

		},
		posTagger: {
			tag: function(sentence, cb) {
				return self.posTagger(function(sentence, error, instance) {
					if (typeof sentence == 'string') {
						var sentence = sentence.split(' ');
					}
					var newArray = self.java.newArray("java.lang.String", sentence);
					return instance.tag(newArray, cb);
				}.bind(null, sentence));
			}

		},
		chunker: {
			chunk: function(sentence, tokens, cb) {
				return self.chunker(function(sentence, error, instance) {
					if (typeof sentence == 'string') {
						var sentence = sentence.split(' ');
					}
					var javaSentence = self.java.newArray("java.lang.String", sentence);
					var tokensArray = self.java.newArray("java.lang.String", tokens);
					return instance.chunk(javaSentence, tokensArray, cb);
				}.bind(null, sentence));
			}
		},
    doccat: {
			categorize: function(sentence, cb) {
				return self.doccat(function(error, instance) {
					if (typeof sentence == 'string') {
						sentence = sentence.split(' ');
					}
					var javaSentence = self.java.newArray("java.lang.String", sentence);
					return instance.categorize(javaSentence, cb);
				});
			},
      getBestCategory: function(outcome, cb) {
				return self.doccat(function(double, error, instance) {
					var javaDouble = self.java.newArray("double", outcome);
					return instance.getBestCategory(javaDouble, cb);
				}.bind(null, outcome));
			},
		},
		instance: self
	}
}
openNLP.prototype.tokenizer = function(cb) {
	var self = this;
	self.java.import('opennlp.tools.tokenize.TokenizerModel')
	self.java.import('opennlp.tools.tokenize.TokenizerME');
	self.java.newInstance('java.io.FileInputStream', self.models.tokenizer, function(err, fis) {
		if (err) {
			return cb(err);
		}
		self.java.newInstance('opennlp.tools.tokenize.TokenizerModel', fis, function(err, model) {
			if (err) {
				return cb(err);
			}
			self.java.newInstance('opennlp.tools.tokenize.TokenizerME', model, cb)
		})
	});
}
openNLP.prototype.nameFinder = function(cb) {
	var self = this;
	self.java.import('opennlp.tools.namefind.TokenNameFinderModel')
	self.java.import('opennlp.tools.namefind.NameFinderME')
	return self.java.newInstance('java.io.FileInputStream', self.models.nameFinder, function(err, fis) {
		if (err) {
			return cb(err);
		}
		return self.java.newInstance('opennlp.tools.namefind.TokenNameFinderModel', fis, function(err, model) {
			if (err) {
				return cb(err);
			}
			return self.java.newInstance('opennlp.tools.namefind.NameFinderME', model, cb)
		});
	})
}
openNLP.prototype.sentenceDetector = function(cb) {
	var self = this;
	self.java.import('opennlp.tools.sentdetect.SentenceModel')
	self.java.import('opennlp.tools.sentdetect.SentenceDetector')
	self.java.newInstance('java.io.FileInputStream', self.models.sentenceDetector, function(err, fis) {
		if (err) {
			return cb(err);
		}
		self.java.newInstance('opennlp.tools.sentdetect.SentenceModel', fis, function(err, model) {
			if (err) {
				return cb(err);
			}
			self.java.newInstance('opennlp.tools.sentdetect.SentenceDetectorME', model, cb)
		})
	});
}
openNLP.prototype.posTagger = function(cb) {
	var self = this;
	self.java.import('opennlp.tools.postag.POSModel')
	self.java.import('opennlp.tools.postag.POSTaggerME')
	self.java.newInstance('java.io.FileInputStream', self.models.posTagger, function(err, fis) {
		if (err) {
			return cb(err);
		}
		self.java.newInstance('opennlp.tools.postag.POSModel', fis, function(err, model) {
			if (err) {
				return cb(err);
			}
			self.java.newInstance('opennlp.tools.postag.POSTaggerME', model, cb)
		})
	});
}
openNLP.prototype.chunker = function(cb) {
	var self = this;
	self.java.import('opennlp.tools.chunker.ChunkerModel')
	self.java.import('opennlp.tools.chunker.ChunkerME')
	return self.java.newInstance('java.io.FileInputStream', self.models.chunker, function(err, fis) {
		if (err) {
			return cb(err);
		}
		return self.java.newInstance('opennlp.tools.chunker.ChunkerModel', fis, function(err, model) {
			if (err) {
				return cb(err);
			}
			return self.java.newInstance('opennlp.tools.chunker.ChunkerME', model, cb)
		});
	});
}

openNLP.prototype.doccat = function(cb) {
	var self = this;
	self.java.import('opennlp.tools.doccat.DoccatModel')
	self.java.import('opennlp.tools.doccat.DocumentCategorizerME')
	self.java.newInstance('java.io.FileInputStream', self.models.doccat, function(err, fis) {
		if (err) {
			return cb(err);
		}
		self.java.newInstance('opennlp.tools.doccat.DoccatModel', fis, function(err, model) {
			if (err) {
				return cb(err);
			}
			self.java.newInstance('opennlp.tools.doccat.DocumentCategorizerME', model, cb)
		})
	});
}
module.exports = openNLP;

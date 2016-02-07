var extendy = require('extendy')
var openNLP = function(config) {
	var self = this;
	self.java = require('java');
	self.models = {
		doccat: __dirname + '/models/en-doccat.bin',
		posTagger: __dirname + '/models/en-pos-maxent.bin',
		tokenizer: __dirname + '/models/en-token.bin',
		nameFinder: __dirname + '/models/en-ner-person.bin',
		sentenceDetector: __dirname + '/models/en-sent.bin',
		chunker: __dirname + '/models/en-chunker.bin'
	}
	self.openNLP = {
		jar: __dirname + "/lib/opennlp-tools-1.6.0.jar"
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
			instance: null,
			tokenize: function(sentence, cb) {
				var that = this;
				return self.tokenizer(function(error, instance) {
					that.instance = instance;
					return instance.tokenize(sentence, cb)
				});
			},
			getTokenProbabilities: function(cb) {
				if (this.instance == null) {
					throw new Error('No instance found')
				}
				return this.instance.getTokenProbabilities(cb);
			}
		},
		nameFinder: {
			instance: null,
			find: function(sentence, cb) {
				var that = this;
				var getTokens = function(sentence, cb) {
					self.tokenizer(function(sentence, error, instance) {
						instance.tokenize(sentence, cb);
					}.bind(null, sentence));
				}
				var nameFinder = function(error, sentenceTokens, cb) {
					self.nameFinder(function(sentenceTokens, error, instance) {
						that.instance = instance;
						var newArray = self.java.newArray("java.lang.String", sentenceTokens);
						return instance.find(newArray, function(error, response) {
							cb(error, response.toString());
						});
					}.bind(null, sentenceTokens));
				}
				if (!Array.isArray(sentence)) {
					getTokens(sentence, function(error, sentenceTokens) {
						nameFinder(error, sentenceTokens, cb)
					});
				} else {
					nameFinder(error, sentence, cb)
				}
			},
			probs: function(cb) {
				if (this.instance == null) {
					throw new Error('No instance found')
				}
				return this.instance.probs(cb)
			}
		},
		sentenceDetector: {
			instance: null,
			sentDetect: function(sentence, cb) {
				var that = this;
				return self.sentenceDetector(function(sentence, error, instance) {
					that.instance = instance;
					return instance.sentDetect(sentence, cb);
				}.bind(null, sentence));
			},
			sentPosDetect: function(sentence, cb) {
				var that = this;
				return self.sentenceDetector(function(sentence, error, instance) {
					that.instance = instance;
					return instance.sentPosDetect(sentence, function(error, spans) {
						cb(error, spans.toString())
					});
				}.bind(null, sentence));
			},

		},
		posTagger: {
			instance: null,
			tag: function(sentence, cb) {
				var that = this;
				return self.posTagger(function(sentence, error, instance) {
					that.instance = instance;
					if (typeof sentence == 'string') {
						var sentence = sentence.split(' ');
					}
					var newArray = self.java.newArray("java.lang.String", sentence);
					return instance.tag(newArray, cb);
				}.bind(null, sentence));
			},
			probs: function(cb) {
				if (this.instance == null) {
					throw new Error('No instance found')
				}
				this.instance.probs(function(error, response) {
					cb(error, response)
				});
			},
			topKSequences: function(sentence, cb) {
				var that = this;
				return self.posTagger(function(sentence, error, instance) {
					that.instance = instance;
					if (typeof sentence == 'string') {
						var sentence = sentence.split(' ');
					}
					var newArray = self.java.newArray("java.lang.String", sentence);
					return instance.topKSequences(newArray, function(error, sec) {
						cb(error, {
							getOutcomes: function() {
								return sec.map(function(item) {
									return item.getOutcomesSync().toArraySync();
								});
							},
							getProbs: function() {
								return sec.map(function(item) {
									return item.getProbsSync();
								});
							},
							getScore: function() {
								return sec.map(function(item) {
									return item.getScoreSync();
								});
							}
						})

					});
				}.bind(null, sentence));
			}


		},
		chunker: {
			instance: null,
			chunk: function(sentence, tokens, cb) {
				var that = this;
				return self.chunker(function(sentence, error, instance) {
					that.instance = instance;
					if (typeof sentence == 'string') {
						var sentence = sentence.split(' ');
					}
					var javaSentence = self.java.newArray("java.lang.String", sentence);
					var tokensArray = self.java.newArray("java.lang.String", tokens);
					return instance.chunk(javaSentence, tokensArray, cb);
				}.bind(null, sentence));
			},
			probs: function(cb) {
				if (this.instance == null) {
					throw new Error('No instance found')
				}
				this.instance.probs(function(error, response) {
					cb(error, response)
				});
			},
			topKSequences: function(sentence, tags, cb) {
				var that = this;
				return self.chunker(function(sentence, cb, error, instance) {
					that.instance = instance;
					if (typeof sentence == 'string') {
						var sentence = sentence.split(' ');
					}
					var newArray = self.java.newArray("java.lang.String", sentence);
					return instance.topKSequences(newArray, tags, function(error, sec) {
						cb(error, {
							getOutcomes: function() {
								return sec.map(function(item) {
									return item.getOutcomesSync().toArraySync();
								});
							},
							getProbs: function() {
								return sec.map(function(item) {
									return item.getProbsSync();
								});
							},
							getScore: function() {
								return sec.map(function(item) {
									return item.getScoreSync();
								});
							}
						})

					});
				}.bind(null, sentence, cb));
			}
		},
		doccat: {
			instance: null,
			categorize: function(sentence, cb) {
				var that = this;
				return self.doccat(function(sentence, error, instance) {
					that.instance = instance;
					if (error) {
						throw new Error(error)
					}

					if (typeof sentence == 'string') {
						sentence = sentence.split(' ');
					}
					var javaSentence = self.java.newArray("java.lang.String", sentence);
					instance.categorize(javaSentence, cb);
				}.bind(null, sentence));
			},
			getBestCategory: function(outcome, cb) {
				var that = this;
				var javaDouble = self.java.newArray("double", outcome);
				that.instance.getBestCategory(javaDouble, cb);
			},
			getIndex: function(category, cb) {
				return self.doccat(function(error, instance) {
					instance.getIndex(category, cb);
				});
			},
			getCategory: function(index, cb) {
				return self.doccat(function(error, instance) {
					instance.getCategory(index, cb)
				})
			},
			getAllResults: function(outcome, cb) {
				var that = this;
				var javaDouble = self.java.newArray("double", outcome);
				that.instance.getAllResults(javaDouble, cb);
			},
			sortedScoreMap: function(sentence, cb) {
				var that = this;
				return self.doccat(function(sentence, error, instance) {
					instance.sortedScoreMap(sentence, function(error, hash) {
						try {
							var json = (hash.toString().replace(/=/g, ':'));
						} catch (e) {
							return cb(e, hash.toString())
						}
						return cb(null, json)

					});
				}.bind(null, sentence))
			},
			scoreMap: function(sentence, cb) {
				var that = this;
				return self.doccat(function(sentence, error, instance) {
					instance.scoreMap(sentence, function(error, hash) {
						try {
							var json = (hash.toString().replace(/=/g, ':'));
						} catch (e) {
							return cb(e, hash.toString())
						}
						return cb(null, json)

					});
				}.bind(null, sentence))
			},
		}
	}
};
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
};
openNLP.prototype.nameFinder = function(cb) {
	var self = this;
	self.java.import('opennlp.tools.namefind.TokenNameFinderModel');
	self.java.import('opennlp.tools.namefind.NameFinderME');

	return self.java.newInstance('java.io.FileInputStream', self.models.nameFinder, function(err, fis) {
		if (err) {
			return cb(err);
		}
		return self.java.newInstance('opennlp.tools.namefind.TokenNameFinderModel', fis, function(err, model) {
			if (err) {
				return cb(err);
			}
			return self.java.newInstance('opennlp.tools.namefind.NameFinderME', model, cb);
		});
	})
};
openNLP.prototype.sentenceDetector = function(cb) {
	var self = this;
	self.java.import('opennlp.tools.sentdetect.SentenceModel');
	self.java.import('opennlp.tools.sentdetect.SentenceDetector');

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
};
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
};
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
};
openNLP.prototype.doccat = function(cb) {
	var self = this;
	self.java.import('opennlp.tools.doccat.DoccatModel')
	self.java.import('opennlp.tools.doccat.DocumentCategorizerME');
	return self.java.newInstance('java.io.FileInputStream', self.models.doccat, function(err, fis) {
		if (err) {
			return cb(err);
		}
		return self.java.newInstance('opennlp.tools.doccat.DoccatModel', fis, function(err, model) {
			if (err) {
				return cb(err);
			}
			return self.java.newInstance('opennlp.tools.doccat.DocumentCategorizerME', model, cb)
		})
	});
};


module.exports = openNLP;
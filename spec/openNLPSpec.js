var openNLP = require("../opennlp.js");
describe("OpenNLP", function() {
	var sentence = 'Pierre Vinken , 61 years old , will join the board as a nonexecutive director Nov. 29 .';
	it("Tokenizer", function(done) {
		var tokenizer = new openNLP().tokenizer;
		tokenizer.tokenize(sentence, function(err, tokens_arr) {
			tokenizer.getTokenProbabilities(function(error,response){
				expect(response).toBeDefined();
			});

			///console.log(tokens_arr)
			expect(err).not.toBeDefined();
			done();
		});
	});
	it("nameFinder", function(done) {
		var nameFinder = new openNLP().nameFinder;
		nameFinder.find(sentence, function(err, tokens_arr) {
			nameFinder.probs(function(error,response){
				expect(response).toBeDefined();
			});

			expect(err).not.toBeDefined();
			done();
		});
	});
	it("posTagger", function(done) {
		var posTagger = new openNLP().posTagger;
		posTagger.tag(sentence, function(err, tokens_arr) {
			expect(err).not.toBeDefined();
			done();
		});
	});
	it("sentenceDetector", function(done) {
		var sentenceDetector = new openNLP().sentenceDetector;
		sentenceDetector.sentPosDetect(sentence, function(err, tokens_arr) {
			expect(err).not.toBeDefined();
		});
		sentenceDetector.sentDetect(sentence, function(err, tokens_arr) {
			expect(err).not.toBeDefined();
			done();
		});
	});
	it("posTagger", function(done) {
		var posTagger = new openNLP().posTagger;
		posTagger.tag(sentence, function(err, tokens_arr) {
			expect(tokens_arr).toBeDefined();
		});
		posTagger.topKSequences(sentence, function(error,tagger) {
			expect(tagger.getScore()).toBeDefined();
			expect(tagger.getProbs()).toBeDefined();
			expect(tagger.getOutcomes()).toBeDefined();
			done();
		});
	});
	it("chunker", function(done) {
		var posTagger = new openNLP().posTagger;
		var chunker = new openNLP().chunker;
		posTagger.tag(sentence, function(err, tokens_arr) {
			expect(err).not.toBeDefined();
			chunker.chunk(sentence, tokens_arr, function(err, tokens_arr) {
				chunker.probs(function(error,prob){
					expect(prob).toBeDefined();
					expect(err).not.toBeDefined();
					done();
				});
				expect(err).not.toBeDefined();
			});
		});
	});
	it("document categorizer", function(done) {
		var doccat = new openNLP().doccat;
		doccat.categorize("I enjoyed watching Rocky", function (err, list) {
			expect(list).toBeDefined();
			doccat.getAllResults(list, function (err, category) {
				expect(category).toBeDefined();
			});
			doccat.getBestCategory(list, function (err, category) {
				expect(category).toBeDefined();
			});
		});
		doccat.scoreMap("I enjoyed watching Rocky", function (err, category) {
			expect(category).toBeDefined();
			done();
		});
		doccat.sortedScoreMap("I enjoyed watching Rocky", function (err, category) {
			expect(category).toBeDefined();
			done();
		});
		doccat.getCategory(1,function (err, category) {
			expect(category).toBeDefined();
		});
		doccat.getIndex('Happy',function (err, index) {
			expect(index).toBeDefined();
			done();
		});
	});
});

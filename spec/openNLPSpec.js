var openNLP = require("../opennlp.js");
describe("OpenNLP", function() {
	var sentence = 'Pierre Vinken , 61 years old , will join the board as a nonexecutive director Nov. 29 .';
	it("Tokenizer", function(done) {
		var tokenizer = new openNLP().tokenizer;
		tokenizer.tokenize(sentence, function(err, tokens_arr) {
			expect(err).not.toBeDefined();
			done();
		});
	});
	it("nameFinder", function(done) {
		var nameFinder = new openNLP().nameFinder;
		nameFinder.find(sentence, function(err, tokens_arr) {
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
		sentenceDetector.sentDetect(sentence, function(err, tokens_arr) {
			expect(err).not.toBeDefined();
			done();
		});
	});
	it("chunker", function(done) {
		var posTagger = new openNLP().posTagger;
		var chunker = new openNLP().chunker;
		posTagger.tag(sentence, function(err, tokens_arr) {
			expect(err).not.toBeDefined();
			chunker.chunk(sentence, tokens_arr, function(err, tokens_arr) {
				expect(err).not.toBeDefined();
				done();
			});
		});
	});
});

/* Copyright 2013 Joseph Spencer.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

describe('find-java-home', function(){
  var sut = require('./');

  before(function(){
    delete process.env.JAVA_HOME;
  });

  it('is a function', function(){
    sut.should.be.type('function');
  });

  it('should find java home', function(done){
    sut(function(err, home){
      done(err);
    });
  });

  describe('when JAVA_HOME is set incorrectly', function(){
    var resolvedHome;

    before(function(done){
      sut(function(err, home){
        resolvedHome = home;
        process.env.JAVA_HOME = '/foo';
        done(err);
      });
    });

    it('should find java home', function(done){
      sut(function(err, home){
        home.should.equal(resolvedHome);
        done(err);
      });
    });
  });

  describe('when given options', function() {
    it('should still java home', function(done) {
      sut({allowJre: true}, function(err, home) {
        done(err);
      });
    });
  });
});

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

var which = require('which');
var fs = require('fs');
var path = require('path');
var dirname = path.dirname;
var exec = require('child_process').exec;
var exists = fs.existsSync;
var stat = fs.statSync;
var readlink = fs.readlinkSync;
var resolve = path.resolve;
var lstat = fs.lstatSync;
var javaHome;

module.exports = findJavaHome;

var isWindows = process.platform.indexOf('win') === 0;
var JAVAC_FILENAME = 'javac' + (isWindows?'.exe':'');

function findJavaHome(options, cb){
  if(typeof options === 'function'){
    cb = options;
    options = null;
  }
  options = options || {
    allowJre: false
  };
  var macUtility;
  var possibleKeyPaths;

  if(process.env.JAVA_HOME && dirIsJavaHome(process.env.JAVA_HOME)){
    javaHome = process.env.JAVA_HOME;
  }

  if(javaHome)return next(cb, null, javaHome);

  //windows
  if(process.platform.indexOf('win') === 0){
    //java_home can be in many places
    //JDK paths
    possibleKeyPaths = [
      '"hklm\\software\\javasoft\\java development kit"',
      '"hklm\\software\\wow6432node\\javasoft\\java development kit"'
    ];
    //JRE paths
    if(options.allowJre){
      possibleKeyPaths = possibleKeyPaths.concat([
        '"hklm\\software\\javasoft\\java runtime environment"',
        '"hklm\\software\\wow6432node\\javasoft\\java runtime environment"'
      ]);
    }

    return findInRegistry(possibleKeyPaths, [], cb);
  }

  which(JAVAC_FILENAME, function(err, proposed){
    if(err)return next(cb, err, null);

    //resolve symlinks
    proposed = findLinkedFile(proposed);

    //get the /bin directory
    proposed = dirname(proposed);

    //on mac, java install has a utility script called java_home that does the
    //dirty work for us
    macUtility = resolve(proposed, 'java_home');
    if(exists(macUtility)){
      exec(macUtility, {cwd:proposed}, function(error, out, err){
        if(error || err)return next(cb, error || ''+err, null);
        javaHome = ''+out;
        next(cb, null, javaHome);
      }) ;
      return;
    }

    //up one from /bin
    javaHome = dirname(proposed);

    next(cb, null, javaHome);
  });
}

function findInRegistry(paths, errors, cb){
  if(!paths.length) cb(errors.join('\r\n'));

  var keyPath = paths.splice(0, 1)[0];

  //get the registry value
  exec(
    [
      'reg',
      'query',
      keyPath
    ].join(' '),
    function(error, out, err){
      var reg = /\\([0-9]\.[0-9])$/;
      var key;
      if(error || err){
        errors.push(error || ''+err);
        return findInRegistry(paths, errors, cb);
      }
      key = out
        .replace(/\r/g, '')
        .split('\n').filter(function(key){
          return reg.test(key);
        })
        .sort(function(a,b){
          var aVer = parseFloat(reg.exec(a)[1]);
          var bVer = parseFloat(reg.exec(b)[1]);

          return bVer - aVer;
        })[0];
      exec(
        [
          'reg',
          'query',
          '"'+key+'"',
          '/v javahome'
        ].join(' '),
        function(error, out, err){
          if(error || err){
            errors.push(error || ''+err);
            return findInRegistry(paths, errors, cb);
          }
          javaHome = out
            .replace(/[\r\n]/gm, '')
            .replace(/.+\s([a-z]:\\.+)$/im, '$1')
            .replace(/\s+$/, '');
          cb(null, javaHome);
        }
      );
    }
  );
}

// iterate through symbolic links until
// file is found
function findLinkedFile(file){
  if(!lstat(file).isSymbolicLink()) return file;
  return findLinkedFile(readlink(file));
}

function next(cb, err, home){
  process.nextTick(function(){cb(err, home);});
}

function dirIsJavaHome(dir){
  return exists(''+dir)
    && stat(dir).isDirectory()
    && exists(path.resolve(dir, 'bin', JAVAC_FILENAME));
}

function after(count, cb){
  return function(){
    if(count <= 1)return process.nextTick(cb);
    --count;
  };
}

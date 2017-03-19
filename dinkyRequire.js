// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//

"use strict";

var microRequireModules = {};

{

    var loadResource = function( scriptPath, callback ) {

        var xhr = new XMLHttpRequest();
        var finished = false;

        xhr.onabort = xhr.onerror = function xhrError() {
            finished = true;
            console.error( xhr );
        };

        xhr.onreadystatechange = function xhrStateChange() {
            if (xhr.readyState === 4 && !finished) {
                finished = true;
                var section;
                try {

                    callback( xhr.responseText );

                } catch (e) {
                    console.error( e );
                }
            }
        };

        xhr.open('GET', scriptPath);
        xhr.send();
    }

    var setupModule = function( cursor, job ) {

        console.info( "loading lib: " + job.moduleName );


        loadResource( job.scriptPath, function (scriptText) {

            job.scriptText = scriptText;

            if( job === cursor.current() ) {

                do {

                    {
                        window.exports = {};

                        eval( job.scriptText );

                        microRequireModules[job.moduleName] = window.exports;
                        delete window.exports;

                        console.info( "loaded lib: " + job.moduleName );

                    }

                    job = cursor.next();
                }
                while( null != job && null != job.scriptText );
            } else {
                // we are still waiting for an earlier library to load ... no-op
            }
        });

    }

    var loadReqs = function( reqsList )  {


        var jobs = [];

        for( var i = 0, count = reqsList.length; i < count; i++ ) {
            var job = {
                moduleName: reqsList[i],
                scriptPath: reqsList[i] + ".js",
                scriptText: null
            }
            jobs.push( job );
        }

        var cursor = {

            index: 0,
            next: function () {
                cursor.index++;
                if( cursor.index == jobs.length ) {
                    return null;
                }
                var answer = jobs[cursor.index];
                return answer;
            },
            current: function () {
                return jobs[cursor.index];
            }
        }


        for( var i = 0, count = jobs.length; i < count; i++ ) {

            setupModule( cursor, jobs[i] );

        }
    }

    var reqsList = ["./library", "./index"];
    loadReqs( reqsList );

    var scripts = document.getElementsByTagName( "script" );
    var foundElement = false;
    for( var i = 0, count = scripts.length; i < count; i++ ) {

        // var main =
    }
}

function require( lib ) {

    var answer = microRequireModules[lib];
    if( undefined == answer ) {
        // take a punt ...
        answer = window[lib];
    }

    if( undefined == answer ) {
        console.error( "'"+lib+"' not found!" );
    }
    return answer;
}

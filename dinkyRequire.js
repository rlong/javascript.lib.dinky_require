// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//

"use strict";

var microRequireModules = {};

{

    var loadResource = function( path, callback, errorCallback ) {

        var xhr = new XMLHttpRequest();
        var finished = false;

        xhr.onabort = xhr.onerror = function xhrError() {
            finished = true;
            if( errorCallback ) {
                errorCallback( xhr );
            } else {
                console.error( xhr );
            }

        };

        xhr.onreadystatechange = function xhrStateChange() {
            if (xhr.readyState === 4 && !finished) {
                finished = true;
                var section;
                try {

                    callback( xhr.responseText );

                } catch (e) {
                    if( errorCallback ) {
                        errorCallback( xhr );
                    } else {
                        console.error( e );
                    }
                }
            }
        };

        xhr.open('GET', path);
        xhr.send();
    }

    var setupModule = function( cursor, moduleConfig ) {

        // console.info( "loading lib: " + moduleConfig.name );


        loadResource( moduleConfig.src, function (scriptText) {

            moduleConfig.scriptText = scriptText;

            if( moduleConfig === cursor.current() ) {

                do {

                    {
                        window.exports = {};

                        eval.apply( window, [moduleConfig.scriptText]);

                        // did the module `export` anything
                        if( 0 < Object.keys(window.exports).length ) {

                            microRequireModules[moduleConfig.name] = window.exports;
                        }

                        delete window.exports;

                        console.info( "loaded lib: " + moduleConfig.name );
                    }

                    moduleConfig = cursor.next();
                }
                while( null != moduleConfig && null != moduleConfig.scriptText );
            } else {
                // we are still waiting for an earlier library to load ... no-op
            }
        });

    }

    var setup = function( config )  {

        for( var i = 0, count = config.length; i < count; i++ ) {
            var moduleConfig = config[i];
            if( !moduleConfig.src ) {
                moduleConfig.src = moduleConfig.name + ".js"
            }
        }

        var cursor = {

            index: 0,
            next: function () {
                cursor.index++;
                if( cursor.index == config.length ) {
                    return null;
                }
                var answer = config[cursor.index];
                return answer;
            },
            current: function () {
                return config[cursor.index];
            }
        }

        for( var i = 0, count = config.length; i < count; i++ ) {

            setupModule( cursor, config[i] );
        }
    }

    loadResource( "./dinkyConfig.json",
        function (jsonText) {

            var config = JSON.parse( jsonText );
            setup( config );

        },
        function ( error ) {

            console.error( "failed to load './dinkyConfig.json'");
            console.error( error );
        });

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

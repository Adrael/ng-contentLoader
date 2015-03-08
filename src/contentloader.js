/**
 * @author Raphael MARQUES
 * @licence MIT
 *
 * @file The declaration of the application.
 * @module contentLoader
 */

/**
 * contentLoader IIFE declaration.
 * @name IIFE
 * @function
 */
(function () {

    'use strict';

    // Module declaration
    angular
        .module('contentLoader', [])
        .run(run)
        .service('$contentLoader', $contentLoader)
        .directive('contentLoader', contentLoader);

    // Dependency injection
    contentLoader.$inject = ['$contentLoader'];
    run.$inject = ['$rootScope', '$contentLoader'];
    $contentLoader.$inject = ['$http', '$rootScope'];

    /**
     * Provides the run configuration for the application.
     * @name run
     * @function
     */
    function run($rootScope, $contentLoader) {

        $rootScope.$on('$viewContentLoaded', function () {

            if ($contentLoader.content.length > 0) {

                if ($contentLoader.url) {

                    $contentLoader.fetch();

                } else {

                    var errorMessage =
                        '[$contentLoader] Warning: No URL set to retrieve content from.\n' +
                        'You may want to use $contentLoader.setURL([yourURLhere]);';

                    console.error(errorMessage);

                }

            }

        });

    }

    /**
     * The $contentLoader service.
     * @name $contentLoader
     * @function
     */
    function $contentLoader($http, $rootScope) {

        var service =
        {
            url: null,
            content: [],
            finalCallback: null,

            reset: reset,
            fetch: fetch,
            setURL: setURL,
            setScope: setScope,
            addContent: addContent,
            forceFetch: forceFetch,
            setFinalCallback: setFinalCallback
        };

        return service;

        /**
         * setURL
         * @name setURL
         * @function
         */
        function setURL(url) {

            service.url = url;

        }

        /**
         * setScope
         * @name setScope
         * @function
         */
        function setScope($scope) {

            service.$scope = $scope;

        }

        /**
         * reset
         * @name reset
         * @function
         */
        function reset() {

            service.content = [];

        }

        /**
         * fetch
         * @name fetch
         * @function
         */
        function fetch() {

            var container = $('.content-loader-container');
            container.hide();

            var requestPayload = '';

            for (var i = 0; i < service.content.length; ++i) {

                requestPayload += service.content[i].attrs.contentLoader + ',';

            }

            requestPayload = requestPayload.substr(0, requestPayload.length - 2);

            var dataCallback =
                function (data) {

                    for (var j in data) {

                        if (data.hasOwnProperty(j)) {

                            for (var x = 0; x < service.content.length; ++x) {

                                if (service.content[x].attrs.contentLoader === j) {

                                    service.content[x].callback(data[j]);

                                    if (service.content[x].attrs.contentReady) {

                                        if (service.$scope) {

                                            service.$scope.$eval(service.content[x].attrs.contentReady);

                                        } else {

                                            var errorMessage =
                                                '[$contentLoader] Warning: No scope set to execute readiness ' +
                                                'callback for ' + service.content[x].attrs.contentLoader + '.\n' +
                                                'You may want to use $contentLoader.setScope([yourScopeHere]);';

                                            console.error(errorMessage);

                                        }

                                    }

                                    break;

                                }

                            }

                        }

                    }

                    if(service.finalCallback) {

                        service.finalCallback();

                    }

                    container.show();

                    reset();

                };

            var errorCallback =
                function () {

                    console.error('[$contentLoader] Cannot retrieve payload with content:', service.url, service.content);

                    if(service.finalCallback) {

                        service.finalCallback();

                    }

                    reset();

                };

            $http.get(service.url + '?payload=' + requestPayload)
                .success(dataCallback)
                .error(errorCallback);

            // Mockup
            //setTimeout(
            //    function() {
            //
            //        // Emulate fakeData
            //        var fakeData = {};
            //        for(var i = 0; i < service.content.length; ++i) {
            //
            //            fakeData[service.content[i].attrs.contentLoader] = service.content[i].attrs.contentLoader;
            //
            //        }
            //
            //        dataCallback(fakeData);
            //
            //    },
            //    Math.random() * 2000
            //);

        }

        /**
         * addContent
         * @name addContent
         * @function
         */
        function addContent(value) {

            service.content.push(value);

        }

        /**
         * setFinalCallback
         * @name setFinalCallback
         * @function
         */
        function setFinalCallback(finalCallback) {

            service.finalCallback = finalCallback;

        }

        /**
         * forceFetch
         * @name forceFetch
         * @function
         */
        function forceFetch() {

            $('[data-content-loader]').each(
                function(index, element) {

                    function callback(content) {

                        $(element).text(content);

                    }

                    var item =
                    {
                        attrs:
                        {
                            contentReady: $(element).data('content-ready'),
                            contentLoader: $(element).data('content-loader')
                        },
                        callback: callback
                    };

                    addContent(item);

                }
            );

            fetch();

        }

    }

    /**
     * The contentLoader directive.
     * @name contentLoader
     * @function
     */
    function contentLoader($contentLoader) {

        return {

            restrict: 'A',
            link: function (scope, element, attrs) {

                function callback(content) {

                    element.text(content);

                }

                var item =
                {
                    attrs: attrs,
                    callback: callback
                };

                $contentLoader.addContent(item);

            }

        };

    }

})();
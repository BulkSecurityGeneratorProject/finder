'use strict';

angular.module('finderApp')
    .service('ParseLinks', function () {
        this.parse = function (header) {
            if (header.length == 0) {
                throw new Error("input must not be of zero length");
            }

            // Split parts by comma
            var parts = header.split(',');
            var links = {};
            // Parse each part into a named link
            angular.forEach(parts, function (p) {
                var section = p.split(';');
                if (section.length != 2) {
                    throw new Error("section could not be split on ';'");
                }
                var url = section[0].replace(/<(.*)>/, '$1').trim();
                var queryString = {};
                url.replace(
                    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
                    function($0, $1, $2, $3) { queryString[$1] = $3; }
                );
                var page = queryString['page'];
                if( angular.isString(page) ) {
                    page = parseInt(page);
                }
                var name = section[1].replace(/rel="(.*)"/, '$1').trim();
                links[name] = page;
            });

            return links;
        }
        // 增加新方法，从HttpHeaders取得下一页的URL
        this.linkURL = function (header) {
            if (header.length == 0) {
                throw new Error("input must not be of zero length");
            }
            // Split parts by comma
            var parts = header.split(',')[0];
            // Parse each part into a named link
            var section = parts.split(';');
            if (section.length != 2) {
                throw new Error("section could not be split on ';'");
            }
            var linkURL = section[0].replace(/<(.*)>/, '$1').trim();
            return linkURL;
        }
    });

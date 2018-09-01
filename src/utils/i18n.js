window.i18n = (function () {
    var self = this;

    var cookie = {
        get: function (sKey) {
            // eslint-disable-next-line
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        },
        set: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            // eslint-disable-next-line
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
            var sExpires = "";
            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number:
                        sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                        break;
                    case String:
                        sExpires = "; expires=" + vEnd;
                        break;
                    case Date:
                        sExpires = "; expires=" + vEnd.toUTCString();
                        break;
                    default:
                        break;
                }
            }
            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        }
    };

    self.languages = null;
    self.language = null;
    
    var callbacks = [];
    self.callback = function (words, callback, obj) {
        if (typeof callback === 'function')
            callbacks.push({
                words: words,
                callback: callback,
                obj: obj
            });
    };

    self.runCallbacks = function () {
        var localCallbacks = [];
        var callback = callbacks.pop();
        if ( callback )
            localCallbacks.push(callback);
        while (callback) {
            callback = callbacks.pop();
            localCallbacks.push(callback);
        }

        for ( var i in localCallbacks ) {
            if (typeof localCallbacks[i] !== 'undefined' )
                self.words(localCallbacks[i].words, localCallbacks[i].callback, localCallbacks[i].obj);
        }
        localCallbacks = [];
    }

    console.log(cookie.get("i18n"));

    fetch("http://localhost/i18n-json/config.json?_="+(new Date())).then(function (response) {
        return response.json();
    }).then(function (response) {
        self.languages = response;
        self.language = self.getLanguage(cookie.get("i18n")) ? self.getLanguage(cookie.get("i18n")) : self.getDefaultLanguage();
        cookie.set("i18n", self.language.index, Infinity);        
        self.runCallbacks();
    });

    self.getLanguage = function (language_index) {
        var language = false;
        for (var i in self.languages)
            if (self.languages[i].index === language_index) {
                language = self.languages[i];
                break;
            }
        return language;
    };

    self.getDefaultLanguage = function () {
        var language = false;        
        for (var i in self.languages)
            if (self.languages[i].default) {
                language = self.languages[i];
                break;
            }
        return language;
    };

    self.words = function (words, callback, obj) {
        var splitWords = words.split('/');
        if (splitWords.length === 2) {
            var collection_name = splitWords[0];
            var index = splitWords[1];

            if ( self.languages === null ) {                
                self.callback(words, callback, obj);
            } else if (typeof self.language.collections[collection_name] === 'undefined' || typeof self.language.collections[collection_name].loaded === 'undefined' || self.language.collections[collection_name].loaded === false) {
                self.loadCollection(collection_name, words, callback, obj);
            } else {
                callback.call(obj, self.language.collections[collection_name].data[index]);
            }
        }
    };

    self.loadCollection = function (collection_name, words, callback, obj) {
        self.callback(words, callback, obj);
        if (typeof self.language.collections[collection_name] === 'undefined' || typeof self.language.collections[collection_name].loaded === 'undefined') {
            if ( self.language.collections[collection_name].loaded !== false ) {                
                
                self.language.collections[collection_name].loaded = false;
                self.language.collections[collection_name].data = [];

                fetch("http://localhost/i18n-json/" + self.language.index + "/" + collection_name + ".json?_=" + self.language.collections[collection_name].mtime).then(function(response) {
                    return response.json();
                }).then(function(response) {
                    self.language.collections[collection_name].loaded = true;
                    self.language.collections[collection_name].data = response;
                    self.runCallbacks();
                });
            }
        };
    };

    /*
    self.switch = function (language) {
        $.cookie("i18n", language);
        window.location.reload();
    };

    self.loadCollection = function (collection_name, language_index, async, callback) {
        async = typeof async === 'undefined' ? true : async;
        console.log(collection_name);
        if (typeof self.language.collections[collection_name] === 'undefined' ||
            typeof self.language.collections[collection_name].loaded !== 'udefined' ||
            (!async && self.language.collections[collection_name].loaded === false)) {
            language = typeof language_index === 'undefined' || self.getLanguage(language_index) ? self.language : self.getLanguage(language_index);
            self.language.collections[collection_name] = jQuery.extend({
                mtime: (new Date()),
                loaded: false,
                data: []
            }, self.language.collections[collection_name]);
            $.ajax({
                url: "assets/i18n/" + language.index + "/" + collection_name + ".json?" + self.language.collections[collection_name].mtime,
                async: typeof async === 'undefined' ? true : async
            }).done(function (data) {
                self.language.collections[collection_name].loaded = true;
                self.language.collections[collection_name].data = data;
                console.log(self.language.collections[collection_name].data);

                if (typeof callback === 'function')
                    callback(self.language.collections[collection_name].data);

            }).fail(function (jqXHR, textStatus) {
                console.log("Request failed: " + textStatus);
            });
        };
    };

    self._ = function (words, language) {
        var collection = '';
        words = words.split('/');
        if (words.length == 2) {
            collection_name = words[0];
            index = words[1];
            if (typeof self.language.collections[collection_name] === 'undefined' || typeof self.language.collections[collection_name].loaded === 'undefined' || self.language.collections[collection_name].loaded === false)
                self.loadCollection(collection_name, language, false);

            if (typeof self.language.collections[collection_name].data[index] !== 'undefined')
                return self.language.collections[collection_name].data[index];
        }
        console.log(words + ' not found');
        return false;
    };

    self._f = function (words, language) {
        return function () { return self._(words, language); };
    };
    */

    return self;
})();
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
        if ( typeof words !== 'undefined' ) {
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

    // Editing
    var editing = false;

    self.setEditing = function(value) {
        editing = value;
        console.log(editing);
    };
    
    self.isEditing = function() {
        return editing;
    };

    return self;
})();
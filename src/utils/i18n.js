import $ from "jquery";

export function i18n() {
    var self = this,
        jsonHost = 'http://localhost/i18n-json/',
        $eventHandler = $('<div></div>');

    self.setHost = function (value) {
        jsonHost = value;
    };

    self.getHost = function () {
        return jsonHost;
    };

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
    self.addCallback = function (cIndex, resolve, reject) {
        callbacks.push({
            cIndex: cIndex,
            resolve: resolve, 
            reject: reject
        });
    };

    var runCallbacks = function () {
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
                self.callback(localCallbacks[i].cIndex, localCallbacks[i].resolve, localCallbacks[i].reject);
        }
        localCallbacks = [];
    }

    console.log(cookie.get("i18n"));

    fetch(jsonHost+"config.json?_="+(new Date())).then(function (response) {
        return response.json();
    }).then(function (response) {
        self.languages = response;
        self.language = self.getLanguage(cookie.get("i18n")) ? self.getLanguage(cookie.get("i18n")) : self.getDefaultLanguage();
        cookie.set("i18n", self.language.index, Infinity);        
        runCallbacks();
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

    self.cIndexData = function (cIndex) {
        if (typeof cIndex !== 'undefined') {
            var splitcIndex = cIndex.split('/');
            if (splitcIndex.length === 2) {
                return {
                    collection: splitcIndex[0],
                    index: splitcIndex[1]
                }
            }
        }
        return false;
    };

    self.callback = function (cIndex, resolve, reject) {
        var cIndexData = self.cIndexData(cIndex);
        if ( cIndexData ) {
            if ( self.languages === null ) {
                self.addCallback(cIndex, resolve, reject);
            } else if (typeof self.language.collections[cIndexData.collection] === 'undefined' || typeof self.language.collections[cIndexData.collection].loaded === 'undefined' || self.language.collections[cIndexData.collection].loaded === false) {
                self.loadCollection(cIndexData.collection, cIndex, resolve, reject);
            } else {
                resolve({
                    translation: self.language.collections[cIndexData.collection].data[cIndexData.index],
                    fullIndex: cIndex,
                    index: cIndexData.index,
                    collection: cIndexData.collection
                });
            }
        }
    };

    self._ = function (cIndex) {
        return new Promise(function (resolve, reject) {
            self.callback(cIndex, resolve, reject);
        });
    };

    self.loadCollection = function (collection_name, cIndex, resolve, reject) {
        self.addCallback(cIndex, resolve, reject);
        if (typeof self.language.collections[collection_name] !== 'undefined' && typeof self.language.collections[collection_name].loaded === 'undefined') {
            if ( self.language.collections[collection_name].loaded !== false ) {
                
                self.language.collections[collection_name].loaded = false;
                self.language.collections[collection_name].data = [];

                fetch(jsonHost + self.language.index + "/" + collection_name + ".json?_=" + self.language.collections[collection_name].mtime).then(function(response) {
                    return response.json();
                }).then(function(response) {
                    self.language.collections[collection_name].loaded = true;
                    self.language.collections[collection_name].data = response;
                    runCallbacks();
                });
            }
        };
    };

    // Editing
    var editing = false;

    self.setEditing = function(value) {
        editing = value;
        console.log(editing);
        $eventHandler.trigger("editing-change",[editing]);
    };
    
    self.isEditing = function() {
        return editing;
    };

    //Events
    self.on = function() {
        return $eventHandler.on.apply($eventHandler, arguments);
    };

    self.off = function () {
        return $eventHandler.off.apply($eventHandler, arguments);
    };

    return self;
};

export default i18n;
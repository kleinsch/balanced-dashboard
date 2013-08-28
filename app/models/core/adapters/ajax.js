Balanced.AjaxAdapter = Balanced.BaseAdapter.extend({
    initAdapter: function () {
        this.hostsByType = {};
    },

    _uri: function (type, uri) {
        this._checkParams(type, uri);

        var host = this.getHostForType(type);
        if (uri && uri.indexOf(host) !== 0 && uri.indexOf('https') !== 0) {
            uri = host + uri;
        }
        return uri;
    },

    get: function (type, uri, success, error) {
        var settings = {};
        settings.error = error;
        this.ajax(this._uri(type, uri), 'GET', settings).then(function (json) {
            success(json);
        });
    },

    create: function (type, uri, data, success, error) {
        var settings = {};
        settings.data = data;
        settings.error = error;
        this.ajax(this._uri(type, uri), 'POST', settings).then(function (json) {
            success(json);
        });
    },

    update: function (type, uri, data, success, error) {
        var settings = {};
        settings.data = data;
        settings.error = error;
        this.ajax(this._uri(type, uri), 'PUT', settings).then(function (json) {
            success(json);
        });
    },

    delete: function (type, uri, success, error) {
        var settings = {};
        settings.error = error;
        this.ajax(this._uri(type, uri), 'DELETE', settings).then(function (json) {
            success(json);
        });
    },

    ajax: function (url, type, settings) {
        settings = settings || {};

        // HACK this goes away when we have oAuth
        if(url && url.indexOf(ENV.BALANCED.AUTH) === -1) {
            var marketplaceId = Balanced.currentMarketplace ? Balanced.currentMarketplace.get('id') : null;

            var matches = /\/v.+\/marketplaces\/([^/]+)/.exec(url);
            if(matches) {
                marketplaceId = matches[1];
            }

            var userMarketplace = Balanced.Auth.get('user').user_marketplace_for_uri(Balanced.Marketplace.constructUri(marketplaceId));

            if(!userMarketplace || !userMarketplace.get('secret')) {
                console.log("Couldn't find user marketplace for ID " + marketplaceId + " (url: " + url + ")");
            } else {
                settings.username = userMarketplace.get('secret');
                settings.password = "";
            }
        } else {
            console.log("SKIPPING AUTH HEADERS, USING AUTH PROXY: " + url);
            settings.xhrFields = {
                withCredentials: true
            };
        }

        settings.url = url;
        settings.type = type;
        settings.context = this;
        return Balanced.Auth.send(settings);
    },

    registerHostForType: function (type, host) {
        this.hostsByType[type] = host;
    },

    getHostForType: function (type) {
        var host = ENV.BALANCED.API;
        if (this.hostsByType[type]) {
            host = this.hostsByType[type];
        }
        return host;
    }
});

Balanced.FixtureAdapter = Balanced.BaseAdapter.extend({
	// Set this to true for all callbacks to be executed in an async callback.
	// This is the preferred way to operate, since it will catch computed
	// property / async bugs.
	// Defaulting to false for now because all hell will break loose with the tests
	// otherwise. Brand new tests should set this to true like this:
	// Balanced.Adapter.asyncCallbacks = true;
	asyncCallbacks: false,

	initAdapter: function () {
		// global fixture data
		this.dataMap = {};
		// per-test fixture data
		this.testDataMap = {};

		// TODO - all tests should be using sinon spies + stubs, take this out
		this.creates = [];
	},

	reset: function() {
		this.testDataMap = {};
		this.set('asyncCallbacks', false);
		this.creates = [];
	},

	get: function (type, uri, success, error) {
		this._checkParams(type, uri);

		var json = this.testDataMap[uri] || this.dataMap[uri];

		if (!json) {
			Ember.Logger.warn("Couldn't retrieve fixture for [" + type + "].\n\tURI =>  " + uri);
		}
		// cloning in case people modify this later, don't want to screw up our fixtures!
		var clonedJson = this._cloneObject(json);

		this._executeCallback(function() {
			success(clonedJson);
		});
	},

	create: function (type, uri, data, success, error) {
		this._checkParams(type, uri);

		this.creates.push({
			type: type,
			uri: uri,
			data: data
		});

		// cloning to prevent weird data errors
		var clonedJson = this._cloneObject(data);
		this._executeCallback(function() {
			success(clonedJson);
		});
	},

	update: function (type, uri, data, success, error) {
		this._checkParams(type, uri);

		// cloning to prevent weird data errors
		var clonedJson = this._cloneObject(data);
		this._executeCallback(function() {
			success(clonedJson);
		});
	},

	delete: function (type, uri, success, error) {
		this._checkParams(type, uri);

		this._executeCallback(function() {
			success();
		});
	},

	addFixture: function (json) {
		this.dataMap[json.uri] = json;
	},

	addTestFixture: function (json) {
		this.testDataMap[json.uri] = json;
	},

	addFixtures: function (jsonArray) {
		_.each(jsonArray, _.bind(this.addFixture, this));
	},

	addTestFixtures: function (jsonArray) {
		_.each(jsonArray, _.bind(this.addTestFixture, this));
	},

	_executeCallback: function(callbackExecutionFunction) {
		if(this.asyncCallbacks) {
			setTimeout(function() {
				Ember.run(function() {
					callbackExecutionFunction();
				});
			});
		} else {
			callbackExecutionFunction();
		}
	},

	_cloneObject: function (obj) {
		if (obj !== undefined && obj !== null) {
			return JSON.parse(JSON.stringify(obj));
		} else {
			return obj;
		}
	}
});

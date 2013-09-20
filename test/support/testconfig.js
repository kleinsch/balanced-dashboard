Ember.run(function () {
	Balanced.Adapter = Balanced.FixtureAdapter.create();
	window.setupTestFixtures();

	Balanced.THROTTLE = 0;
	Balanced.setupForTesting();
});

// Set up Ember Auth
Ember.run(function () {
	var userId = '/users/USeb4a5d6ca6ed11e2bea6026ba7db2987';
	Balanced.Auth.setAuthProperties(
		true,
		Balanced.User.find(userId),
		userId,
		userId,
		false);
});

Ember.run(function() {
	window.Balanced.advanceReadiness();
});

Balanced.injectTestHelpers();

// since we aren't using balanced.js, define its functions so we can stub them
balanced = {};
balanced.init = function() {
}
balanced.bankAccount = {
	validateRoutingNumber: function() {
		return true;
	},
	create: function() {
	}
};
balanced.card = {
	create: function() {
	}
};

// Can't get the sinon-qunit plugin working, so we'll just hack in a sandbox ourselves
var sinonSandbox;
var originalSinon = sinon;

QUnit.testStart(function (test) {
    var module = test.module ? test.module : '';
    console.log('#' + module + " " + test.name + ": starting setup.");

    sinonSandbox = originalSinon.sandbox.create();
    sinon = sinonSandbox;

    Balanced.reset();
    Balanced.Adapter.reset();

	console.log('%@ %@: setup complete. Starting test'.fmt(module, test.name));
});

QUnit.testDone(function (test) {
	sinonSandbox.restore();

	var module = test.module ? test.module : '';
	console.log('#%@ %@: done.'.fmt(module, test.name));
});

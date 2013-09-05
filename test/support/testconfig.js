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

window.Balanced.onLoad();

// since we aren't using balanced.js, define its functions so we can stub them
balanced = {};
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

QUnit.testStart(function (test) {
    var module = test.module ? test.module : '';
    console.log('#' + module + " " + test.name + ": starting setup.");

    Balanced.reset();

    console.log('#{0} {1}: setup complete. Starting test'.format(module, test.name));
});

QUnit.testDone(function (test) {
    var module = test.module ? test.module : '';
    console.log('#{0} {1}: done.'.format(module, test.name));
});

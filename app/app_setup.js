function hackTheLogin () {
    if (window.TESTING) {
        return;
    }

    // TODO: refactor this nastiness.
    // what happens is that ember-auth uses async: false which does not work in
    // firefox. so instead, what we do is hack in auth **before** the app begins
    // working. this means that if the user is already logged in then ember-auth
    // is going to think that they are all good to go and the async: false
    // won't break our flow.
    window.Balanced.deferReadiness();

    function fin () {
        window.Balanced.advanceReadiness();
    }

    $.ajax({
        type: 'POST',
        url: Ember.ENV.BALANCED.AUTH,
        xhrFields: {
            withCredentials: true
        }
    }).success(function (r) {
        var csrfToken = r.csrf;
        Balanced.NET.ajaxHeaders['X-CSRFToken'] = csrfToken;
        var authCookie = Balanced.Auth.retrieveLogin();
        if (authCookie) {
            $.ajax('https://auth.balancedpayments.com/logins', {
                type: 'POST',
                xhrFields: {
                    withCredentials: true
                },
                data: { uri: authCookie }
            }).success(function (login) {
                // set the auth stuff manually
                Balanced.Auth.setAuthProperties(
                    true,
                    Balanced.User.find(login.user_uri),
                    login.user_id,
                    login.user_id,
                    false
                );
                fin();
            }).error(fin);
        } else {
            fin();
        }
    }).error(fin);
}

// default to #balanced-app if not specified
var divSelector = window.emberAppSelector || '#balanced-app';
window.Balanced = Ember.Application.create({
    rootElement: divSelector,
    LOG_TRANSITIONS: true,

    customEvents: {
        // key is the jquery event, value is the name used in views
        changeDate: 'changeDate'
    }
});

hackTheLogin();

window.Balanced.onLoad = function () {
    //  initialize anything that needs to be done on application load
    Balanced.Helpers.init();
    Balanced.NET.init();
    Balanced.Analytics.init(Ember.ENV.BALANCED);
};

$(document).ready(window.Balanced.onLoad);

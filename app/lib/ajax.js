Balanced.NET = (function () {

    var csrfToken = $.cookie(Balanced.COOKIE.CSRF_TOKEN);

    var ajaxHeaders = {
        'X-CSRFToken': csrfToken
    };

    $.ajaxSetup({
        type: 'POST',
        dataType: 'json',
        beforeSend: function (xhr, settings) {
            if (Balanced['Analytics']) {
                _.defer(Balanced.Analytics.trackAjax, settings);
            }
            for (var key in ajaxHeaders) {
                if (!ajaxHeaders.hasOwnProperty(key)) {
                    continue;
                }
                xhr.setRequestHeader(key, ajaxHeaders[key]);
            }
        }
    });

    return {
        init: function () {
            if (!window.TESTING) {
                Balanced.NET.loadCSRFToken();
            }
        },
        loadCSRFToken: function () {
            // POSTing to / will return a csrf token
            $.ajax({
                type: 'POST',
                url: Ember.ENV.BALANCED.AUTH
            }).success(function (r) {
                csrfToken = r.csrf;
                $.cookie(Balanced.COOKIE.CSRF_TOKEN, csrfToken);
                ajaxHeaders['X-CSRFToken'] = csrfToken;
            });
        },
        ajaxHeaders: ajaxHeaders
    };

})();

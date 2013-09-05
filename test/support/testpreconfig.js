// Display an error if asynchronous operations are queued outside of
// Ember.run.  You need this if you want to stay sane.
Ember.testing = true;
window.emberAppSelector = "#ember-testing";

//  we don't actually care about hitting a server
Ember.ENV.BALANCED.WWW = 'http://example.org';

Ember.$('<style>#ember-testing-container { position: absolute; background: white; bottom: 0; right: 0; width: 640px; height: 600px; overflow: auto; z-index: 9999; border: 1px solid #ccc; } #ember-testing { zoom: 50%; }</style>').appendTo('head');
Ember.$('<div id="ember-testing-container"><div id="ember-testing"></div></div>').appendTo('body');

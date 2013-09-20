// default to #balanced-app if not specified
var divSelector = window.emberAppSelector || '#balanced-app';

ENV.HELPER_PARAM_LOOKUPS = true;
window.Balanced = Ember.Application.create({
	rootElement: divSelector,
	LOG_TRANSITIONS: true,

	customEvents: {
		// key is the jquery event, value is the name used in views
		changeDate: 'changeDate'
	}
});

$(document).ready(function () {
	//  initialize anything that needs to be done on application load
	Balanced.Analytics.init(Ember.ENV.BALANCED);

	// Configure modal parent selector
	$.fn.modal.defaults.manager = divSelector;
});

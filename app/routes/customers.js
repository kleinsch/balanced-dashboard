Balanced.CustomersIndexRoute = Balanced.AuthRoute.extend({
    model: function () {
        var marketplace = this.modelFor('marketplace');
        return marketplace;
    },

    events: {
      customerSelected: function(customer) {
      	window.location.hash = '#' + Balanced.Utils.uriToDashboardFragment(customer.get('uri'));
      }
    }
});

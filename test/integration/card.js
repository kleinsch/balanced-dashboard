module('Card Page', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createCard();
	},
	teardown: function() {}
});

test('can view card page', function(assert) {
	visit(Testing.CARD_ROUTE)
		.then(function() {
			assert.equal($('#content h1').text().trim(), 'Card');
			assert.equal($(".title span").text().trim(), 'Test Card (3434)');
		});
});

test('debit card', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(Testing.CARD_ROUTE)
		.then(function() {
			var controller = Balanced.__container__.lookup('controller:cards');
			var model = controller.get('model');
			model.set('customer', true);
			stop();

			// wait for computed property to fire first
			Ember.run.next(function() {
				start();
				click(".main-header .buttons a.debit-button")
					.fillIn('#debit-funding-instrument .modal-body input[name="dollar_amount"]', "1000")
					.fillIn('#debit-funding-instrument .modal-body input[name="description"]', "Test debit")
					.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
					.then(function() {
						assert.ok(spy.calledOnce);
						assert.ok(spy.calledWith(Balanced.Debit, "/cards/" + Testing.CARD_ID + "/debits", sinon.match({
							amount: 100000,
							description: "Test debit"
						})));
						Balanced.Adapter.create.restore();
					});
			});
		});
});

test('debiting only submits once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.CARD_ROUTE)
		.then(function() {
			var controller = Balanced.__container__.lookup('controller:cards');
			var model = controller.get('model');
			model.set('customer', true);
			stop();

			// wait for computed property to fire first
			Ember.run.next(function() {
				start();
				click(".main-header .buttons a.debit-button")
					.fillIn('#debit-funding-instrument .modal-body input[name="dollar_amount"]', "1000")
					.fillIn('#debit-funding-instrument .modal-body input[name="description"]', "Test debit")
					.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
					.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
					.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
					.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
					.then(function() {
						assert.ok(stub.calledOnce);
					});
			});
		});
});

test('renders metadata correctly', function (assert) {
  Balanced.Card.findAll().then(function (cards) {
    Ember.run(function() {
      var card = cards.content[0];
      card.set('meta', {
          'key': 'value',
          'other-key': 'other-value'
      });

      card.save().then(function (debit) {
        var cardUri = Testing.CARD_ROUTE = '/marketplaces/' + Testing.MARKETPLACE_ID + '/cards/' + card.get('id');
        visit(cardUri).then(function () {
					assert.equal($('.card-info').find('.control-label').last().text().trim(), 'other-key');
					assert.equal($('.card-info').find('.inline-label').last().text().trim(), 'other-value');
        });
      });
    });
  });
});
Balanced.Marketplace = Balanced.MarketplaceLite.extend({
    credits: Balanced.Model.hasMany('Balanced.Credit', 'credits_uri'),
    debits: Balanced.Model.hasMany('Balanced.Debit', 'debits_uri'),
    refunds: Balanced.Model.hasMany('Balanced.Refund', 'refunds_uri'),
    holds: Balanced.Model.hasMany('Balanced.Hold', 'holds_uri'),
    transactions: Balanced.Model.hasMany('Balanced.Transaction', 'transactions_uri'),
    callbacks: Balanced.Model.hasMany('Balanced.Callback', 'callbacks_uri'),

    funding_instruments: Balanced.Model.hasMany('Balanced.FundingInstrument', 'funding_instruments_uri'),
    bank_accounts: Balanced.Model.hasMany('Balanced.BankAccount', 'bank_accounts_uri'),
    cards: Balanced.Model.hasMany('Balanced.Card', 'cards_uri'),

    owner_account: Balanced.Model.belongsTo('Balanced.Account', 'owner_account_json', {embedded: true}),
    owner_customer: Balanced.Model.belongsTo('Balanced.Customer', 'owner_customer_json', {embedded: true}),

    customers: Balanced.Model.hasMany('Balanced.Customer', 'customers_uri'),
    accounts: Balanced.Model.hasMany('Balanced.Account', 'accounts_uri'),

    callbacks_uri: function () {
        return this.get('uri') + '/callbacks';
    }.property('uri'),

    funding_instruments_uri: function() {
        return this.get('uri') + '/search?limit=10&offset=0&q=&type[in]=bank_account,card';
    }.property('uri')
});

Balanced.Marketplace.reopenClass({
    deserialize: function (json) {
        json.owner_account_json = json.owner_account;
        delete json.owner_account;
        json.owner_customer_json = json.owner_customer;
        delete json.owner_customer;
    },
    serialize: function (json) {
        json.owner_account = json.owner_account_json;
        delete json.owner_account_json;
        json.owner_customer = json.owner_customer_json;
        delete json.owner_customer_json;
    },
    constructUri: function (id) {
        return '/v1/marketplaces/' + id;
    }
});

Balanced.TypeMappings.addTypeMapping('marketplace', 'Balanced.Marketplace');

//# For login button and signup
//# here we should only need a minimum of username, password and a optional email for the signup
Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

Meteor.subscribe("Purchases");
Meteor.subscribe("Users");
Meteor.subscribe("Brokers")
Meteor.subscribe("Suppliers");
Meteor.subscribe("Customers");
Meteor.subscribe("Car_Info");
Meteor.subscribe("Car_Costs")
Meteor.subscribe("Car_Out");
Meteor.subscribe("Expenses");
Meteor.subscribe("CustomerChecks");
Meteor.subscribe("GeneralChecks");
Meteor.autosubscribe(function() {
	Meteor.subscribe("BrokInfo", Session.get('bid') );
	Meteor.subscribe("SuppInfo", Session.get('sid') );
	Meteor.subscribe("CustomerInfo", Session.get('cid') );
	Meteor.subscribe("CarModelInfo", Session.get('cmid') );
	Meteor.subscribe("ExpenseInfo", Session.get('xid') );
});
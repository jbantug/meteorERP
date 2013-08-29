//# For login button and signup
//# here we should only need a minimum of username, password and a optional email for the signup
Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

Meteor.subscribe("Users");
Meteor.subscribe("Suppliers");
Meteor.subscribe("Customers");
Meteor.subscribe("Car_Info");
Meteor.subscribe("Expenses");
Meteor.subscribe("CustomerChecks");
Meteor.subscribe("SupplierChecks");
Meteor.autosubscribe(function() {	
	Meteor.subscribe("SaleCheckInfo", Session.get('scid'));
	Meteor.subscribe("PurchaseCheckInfo", Session.get('pcid'));
	Meteor.subscribe("CustomerInfo", Session.get('cid') );
	Meteor.subscribe("SuppInfo", Session.get('sid') );
	Meteor.subscribe("CarInfo", Session.get('car_id') );
	Meteor.subscribe("ExpenseInfo", Session.get('xid') );
});
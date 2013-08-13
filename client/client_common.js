//# For login button and signup
//# here we should only need a minimum of username, password and a optional email for the signup

Accounts.ui.config({

	passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'

});

Meteor.subscribe("Purchases");
Meteor.subscribe("Users");

Meteor.subscribe("Customers");
Meteor.subscribe("Suppliers");

Meteor.autosubscribe(function() {
	Meteor.subscribe("Suppliers");	
});
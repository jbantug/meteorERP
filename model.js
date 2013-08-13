purchases = new Meteor.Collection("Purchases");
customers = new Meteor.Collection("Customers");
suppliers = new Meteor.Collection("Suppliers");
brokers = new Meteor.Collection("Brokers");
//# Account model is initially handled by account-base package

function adminUser(userId) {

  var adminUser = Meteor.users.findOne({username:"admin"});
  return (userId && adminUser && userId === adminUser._id);

};

purchases.allow({
	insert: function (userId, doc){
		return adminUser(userId);
	},
	update: function(userId, docs, fields, modifier){

    return adminUser(userId) || _.all(docs, function(doc) {

      return doc._id === userId;
      });
  },

});

Meteor.users.allow({
	insert: function (userId, doc){
		return adminUser(userId);
	},
	update: function(userId, docs, fields, modifier){
		return adminUser(userId) || _.all(docs, function(doc) {

      		return doc._id === userId;
		});
	},
	remove: function (userId, docs){

   		 return adminUser(userId); // only admin can remove

    }

});
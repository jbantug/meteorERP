purchases = new Meteor.Collection("Purchases");
customers = new Meteor.Collection("Customers");
suppliers = new Meteor.Collection("Suppliers");
brokers = new Meteor.Collection("Brokers");
cars = new Meteor.Collection("Cars");
car_in = new Meteor.Collection("Car_In");
car_out = new Meteor.Collection("Car_Out");
transactions = new Meteor.Collection("Transactions");
expenses = new Meteor.Collection("Expenses");
customer_checks = new Meteor.Collection("Customer_Checks");
supplier_checks = new Meteor.Collection("Supplier_Checks");
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
  	remove: function (userId, docs){
		return adminUser(userId); // only admin can remove
  	}

});

customers.allow({
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

suppliers.allow({
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

cars.allow({
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

car_in.allow({
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

car_out.allow({
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

transactions.allow({
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

expenses.allow({
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

customer_checks.allow({
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

supplier_checks.allow({
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
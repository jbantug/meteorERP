Meteor.startup(function(){
    Meteor.publish("Purchases", function(){
      return purchases.find({});
    });
    Meteor.publish("Suppliers", function(){
        return suppliers.find({});
    });
    Meteor.publish("SuppInfo", function(suppId){
        return suppliers.find({_id:suppId});
    });
    Meteor.publish("CustomerInfo", function(cusId){
        return customers.find({_id:cusId});
    });
    Meteor.publish("Customers", function(){
        return customers.find({});
    });
    Meteor.publish("Brokers", function(){
        return brokers.find({});
    });
    Meteor.publish("Users", function(){
        return Meteor.users.find({});
    });
});
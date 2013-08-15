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
    Meteor.publish("CarModels", function(){
        return cars.find({});
    });
    Meteor.publish("Car_In", function(){
        return car_in.find({});
    });
    Meteor.publish("Car_Out", function(){
        return car_out.find({});
    });
    Meteor.publish("CarModelInfo", function(carmodId){
        return suppliers.find({_id:carmodId});
    });
    Meteor.publish("Brokers", function(){
        return brokers.find({});
    });
    Meteor.publish("Users", function(){
        return Meteor.users.find({});
    });
    Meteor.publish("Expenses", function(){
        return expenses.find({});
    });
    Meteor.publish("ExpenseInfo", function(expId){
        return expenses.find({_id:expId});
    });
    Meteor.publish("CustomerChecks", function(){
        return customer_checks.find({});
    });
});
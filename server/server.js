Meteor.startup(function(){
    //test data
    suppliers.remove({});
    customers.remove({});
    suppliers.insert({
        name: "Test Supplier 1",
        company: "None",
        description: "Test 1"
    });
    suppliers.insert({
        name: "Test Supplier 2",
        company: "None",
        description: "Test 2"
    });
    suppliers.insert({
        name: "A Supplier Test",
        company: "None",
        description: "Test 3"
    });
    suppliers.insert({
        name: "A Supplier Test 2",
        company: "None",
        description: "Test 4"
    });
    customers.insert({
        name: "Test 1",
        company: "None",
        description: "Test 1"
    });
    customers.insert({
        name: "Test 2",
        company: "None",
        description: "Test 2"
    });
    customers.insert({
        name: "A Test",
        company: "None",
        description: "Test 3"
    });
    customers.insert({
        name: "A Test 2",
        company: "None",
        description: "Test 4"
    });
    //end test data

    Meteor.publish("Purchases", function(){
      return purchases.find({});
    });
    Meteor.publish("Suppliers", function(){
        return suppliers.find({});
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
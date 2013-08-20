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
    Meteor.publish("Car_Info", function(){
        return car_info.find({});
    });
    Meteor.publish("Car_Out", function(){
        return car_out.find({});
    });
    Meteor.publish("CarModelInfo", function(carmodId){
        return suppliers.find({_id:carmodId});
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
    Meteor.publish("SupplierChecks", function(){
        return supplier_checks.find({});
    });

    //dummy data
    customers.remove({});
    customers.insert({
        contact_person: "Rey Necesito",
        position: "C.E.O",
        company_name: "My Company",
        company_address: "My Address",
        contact_number: "09153460228",
        email: "reynecesito18@gmail.com",
        dateadded: moment().format("MMM DD YYYY"),
    });
    customers.insert({
        contact_person: "Lester Infiesto",
        position: "Beer Specialist",
        company_name: "Beauty and the Beer",
        company_address: "His Address",
        contact_number: "09225029183",
        email: "lesterinfiesto@gmail.com",
        dateadded: moment().format("MMM DD YYYY"),
    });
    customers.insert({
        contact_person: "Slark Enriquez",
        position: "Philosopher",
        company_name: "Slark",
        company_address: "There",
        contact_number: "23123",
        email: "slark@slark.com",
        dateadded: moment().format("MMM DD YYYY"),
    });
    customers.insert({
        contact_person: "Vajines Salise",
        position: "Gobernador",
        company_name: "The Spotters",
        company_address: "Anywhere",
        contact_number: "555-5555",
        email: "the_spotters@gmail.com",
        dateadded: moment().format("MMM DD YYYY"),
    });
    customers.insert({
        contact_person: "Froi-P Gaviola",
        position: "High Spotter",
        company_name: "The Spotters",
        company_address: "Anywhere",
        contact_number: "555-5555",
        email: "the_spotters@gmail.com",
        dateadded: moment().format("MMM DD YYYY"),
    });
    suppliers.remove({});
    suppliers.insert({
        contact_person: "Supplier 1",
        position: "Supplier",
        company_name: "Elite Suppliers",
        company_address: "Cebu City, Cebu",
        contact_number: "123-700",
        email: "elitesuppliers@gmail.com",
        dateadded: moment().format("MMM DD YYYY"),
    });
    suppliers.insert({
        contact_person: "Supplier 2",
        position: "Supplier",
        company_name: "Elite Suppliers",
        company_address: "Cebu City, Cebu",
        contact_number: "123-700",
        email: "elitesuppliers@gmail.com",
        dateadded: moment().format("MMM DD YYYY"),
    });
    suppliers.insert({
        contact_person: "John Doe",
        position: "C.E.O.",
        company_name: "Suppliers Anonymous",
        company_address: "Cebu City, Cebu",
        contact_number: "888-8888",
        email: "suppliersanonymous@gmail.com",
        dateadded: moment().format("MMM DD YYYY"),
    });
    suppliers.insert({
        contact_person: "Mary Jane",
        position: "C.O.O.",
        company_name: "Suppliers Anonymous",
        company_address: "Cebu City, Cebu",
        contact_number: "888-8888",
        email: "suppliersanonymous@gmail.com",
        dateadded: moment().format("MMM DD YYYY"),
    });
});
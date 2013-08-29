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
    Meteor.publish("CarInfo", function(car_id){
        return car_info.find({_id:car_id});
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
    Meteor.publish("SaleCheckInfo", function(checkId){
        return customer_checks.find({_id:checkId});
    });
    Meteor.publish("SupplierChecks", function(){
        return supplier_checks.find({});
    });
    Meteor.publish("PurchaseCheckInfo", function(checkId){
        return supplier_checks.find({_id:checkId});
    });
    //dummy data
    // if (customers.find().count() === 0) {
    //     customers.remove({});
    //     var c1 = customers.insert({
    //         contact_person: "Rey Necesito",
    //         position: "C.E.O",
    //         company_name: "My Company",
    //         company_address: "My Address",
    //         contact_number: "09153460228",
    //         email: "reynecesito18@gmail.com",
    //         dateadded: moment().format("YYYY-MM-DD"),
    //     });
    //     var c2 = customers.insert({
    //         contact_person: "Lester Infiesto",
    //         position: "Beer Specialist",
    //         company_name: "Beauty and the Beer",
    //         company_address: "His Address",
    //         contact_number: "09225029183",
    //         email: "lesterinfiesto@gmail.com",
    //         dateadded: moment().format("YYYY-MM-DD"),
    //     });
    //     var c3 = customers.insert({
    //         contact_person: "Slark Enriquez",
    //         position: "Philosopher",
    //         company_name: "Slark",
    //         company_address: "There",
    //         contact_number: "23123",
    //         email: "slark@slark.com",
    //         dateadded: moment().format("YYYY-MM-DD"),
    //     });
    //     var c4 = customers.insert({
    //         contact_person: "Vajines Salise",
    //         position: "Gobernador",
    //         company_name: "The Spotters",
    //         company_address: "Anywhere",
    //         contact_number: "555-5555",
    //         email: "the_spotters@gmail.com",
    //         dateadded: moment().format("YYYY-MM-DD"),
    //     });
    //     var c5 = customers.insert({
    //         contact_person: "Froi-P Gaviola",
    //         position: "High Spotter",
    //         company_name: "The Spotters",
    //         company_address: "Anywhere",
    //         contact_number: "555-5555",
    //         email: "the_spotters@gmail.com",
    //         dateadded: moment().format("YYYY-MM-DD"),
    //     });
    // };
        
    // if (suppliers.find().count() === 0) {
    //     suppliers.remove({});
    //     suppliers.insert({
    //         contact_person: "Supplier 1",
    //         position: "Supplier",
    //         company_name: "Elite Suppliers",
    //         company_address: "Cebu City, Cebu",
    //         contact_number: "123-700",
    //         email: "elitesuppliers@gmail.com",
    //         dateadded: moment().format("YYYY-MM-DD"),
    //     });
    //     suppliers.insert({
    //         contact_person: "Supplier 2",
    //         position: "Supplier",
    //         company_name: "Elite Suppliers",
    //         company_address: "Cebu City, Cebu",
    //         contact_number: "123-700",
    //         email: "elitesuppliers@gmail.com",
    //         dateadded: moment().format("YYYY-MM-DD"),
    //     });
    //     suppliers.insert({
    //         contact_person: "John Doe",
    //         position: "C.E.O.",
    //         company_name: "Suppliers Anonymous",
    //         company_address: "Cebu City, Cebu",
    //         contact_number: "888-8888",
    //         email: "suppliersanonymous@gmail.com",
    //         dateadded: moment().format("YYYY-MM-DD"),
    //     });
    //     suppliers.insert({
    //         contact_person: "Mary Jane",
    //         position: "C.O.O.",
    //         company_name: "Suppliers Anonymous",
    //         company_address: "Cebu City, Cebu",
    //         contact_number: "888-8888",
    //         email: "suppliersanonymous@gmail.com",
    //         dateadded: moment().format("YYYY-MM-DD"),
    //     });
    // }    

    // if (supplier_checks.find().count() === 0) {
    //     supplier_checks.remove({});
    //     supplier_checks.insert({
    //         control_number: "1a2s3d4f",
    //         description: "Bought Something",
    //         bank: "BDO",
    //         branch: "CEBU",
    //         check_number: "ch3cknumb3r",
    //         amount: "1500000",
    //         due_date: "2013-08-23",
    //         date_encashed: "",
    //         date_bounced: ""
    //     });
    //     supplier_checks.insert({
    //         control_number: "4a3s2d1f",
    //         description: "Reconstruction",
    //         bank: "BDO",
    //         branch: "CEBU",
    //         check_number: "asdf123qwert",
    //         amount: "800000",
    //         due_date: "2013-08-23",
    //         date_encashed: "",
    //         date_bounced: ""
    //     });
    //     supplier_checks.insert({
    //         control_number: "",
    //         description: "Water Payment",
    //         bank: "LBP",
    //         branch: "CEBU",
    //         check_number: "ss41wfxd44",
    //         amount: "144599",
    //         due_date: "2013-09-22",
    //         date_encashed: "",
    //         date_bounced: ""
    //     });
    //     supplier_checks.insert({
    //         control_number: "",
    //         description: "House Payment",
    //         bank: "LBP",
    //         branch: "CEBU",
    //         check_number: "4ofu1lhfa",
    //         amount: "110000",
    //         due_date: "2013-11-09",
    //         date_encashed: "",
    //         date_bounced: ""
    //     });
    // }

    // if(car_info.find().count() === 0) {
    //     car_info.remove({});
    //     car_info.insert({
    //         control_number: "asdf1234",
    //         maker: "Toyota",
    //         model: "Vios",
    //         engine_number: "009FA",
    //         chassis_number: "40DL01",
    //         yen_cost: "500000",
    //         exchange_rate: "0.5555",
    //         duties_and_taxes: "1000",
    //         brokerage_factor: "0.13",
    //         assembly_reconditioning: "2000",
    //         freight_handling: "3000",
    //         reference_number: "05930",
    //         dateadded: moment().format("YYYY-MM-DD"),
    //         selling_price: "1000000",
    //         total_cost: "319857.5",
    //         net_margin: "680142.5",
    //         delivery_date: "2013-09-09",
    //         date_out: "2013-08-22",
    //         delivered : false,
    //         customer_id: c1
    //     });
    //     car_info.insert({
    //         control_number: "asdf1235",
    //         maker: "Toyota",
    //         model: "Corolla",
    //         engine_number: "98KJF14X",
    //         chassis_number: "40SAJ10D",
    //         yen_cost: "800000",
    //         exchange_rate: "0.5555",
    //         duties_and_taxes: "1000",
    //         brokerage_factor: "0.13",
    //         assembly_reconditioning: "2000",
    //         freight_handling: "3000",
    //         reference_number: "05930",
    //         dateadded: moment().format("YYYY-MM-DD"),
    //         total_cost: "508172",
    //         selling_price: "",
    //         net_margin: "",
    //         delivery_date: "",
    //         date_out: "",
    //         delivered: false,
    //         customer_id: ""
    //     });
    //     car_info.insert({
    //         control_number: "asdf1236",
    //         maker: "Toyota",
    //         model: "Corolla",
    //         engine_number: "98KJF14X",
    //         chassis_number: "40SAJ10D",
    //         yen_cost: "800000",
    //         exchange_rate: "0.5555",
    //         duties_and_taxes: "1000",
    //         brokerage_factor: "0.13",
    //         assembly_reconditioning: "2000",
    //         freight_handling: "3000",
    //         reference_number: "05930",
    //         dateadded: moment().format("YYYY-MM-DD"),
    //         total_cost: "508172",
    //         selling_price: "",
    //         net_margin: "",
    //         delivery_date: "",
    //         date_out: "",
    //         delivered: false,
    //         customer_id: ""
    //     });
    // }

    // if (customer_checks.find().count() === 0) {
    //     customer_checks.remove({});
    //     customer_checks.insert({
    //         customer_id: c1,
    //         control_number: "asdf1234",
    //         bank: "BDO",
    //         branch: "CEBU",
    //         check_number: "dl2kd92la",
    //         amount: "900000",
    //         due_date: "2013-10-02",
    //         date_encashed: "",
    //         date_bounced: ""
    //     });
    //     customer_checks.insert({
    //         customer_id: c2,
    //         control_number: "asdf1235",
    //         bank: "BDO",
    //         branch: "CEBU",
    //         check_number: "dasd2fas",
    //         amount: "800000",
    //         due_date: "2013-09-11",
    //         date_encashed: "",
    //         date_bounced: ""
    //     });
    //     customer_checks.insert({
    //         customer_id: c2,
    //         control_number: "asdf1236",
    //         bank: "BDO",
    //         branch: "CEBU",
    //         check_number: "12rsafg",
    //         amount: "1680000",
    //         due_date: "2013-09-21",
    //         date_encashed: "",
    //         date_bounced: ""
    //     });

    //     customer_checks.insert({
    //         amount: "500000",
    //         bank: "BDO",
    //         branch: "CEBU",
    //         check_number: "lsakdlaskd",
    //         control_number: "555",
    //         customer_id: "Mwn8B6ELeNpK2fnoB",
    //         date_bounced: "",
    //         date_encashed: "",
    //         date_in: "2013-08-28",
    //         due_date: "2013-09-24",
    //         month_due: "September",
    //         month_in: "August",
    //         year_due: "2013",
    //         year_in: "2013"
    //     });
    // }
});
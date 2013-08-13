Meteor.startup(function(){
    
    purchases.remove({});

    purchases.insert({
        datePurchased: "01-01-2000",
        itemType: "toyota",
        itemModel: "x1",
        customer: "rad",
        salePrice: 100,
        quantity: 1,
        totalCost: 100,
        paymentTerms: "thou hast purchase",
    }); 

    //suppliers.remove({});

    // suppliers.insert({
    //     name: "Alur Leiferrot",
    //     company: "sugbufm",
    //     description: "Another supplier",
    //     dateadded: Date("yyyy-MM-DD HH:mm")
    // }); 
 
    Meteor.publish("Purchases", function(){
      return purchases.find({});
    });

    Meteor.publish("Users", function(){
        return Meteor.users.find({});
    });

    Meteor.publish("Suppliers", function(){
        return suppliers.find({});
    });
});
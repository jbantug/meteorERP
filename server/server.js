
if(Meteor.isServer){
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
    });
}
Template.sale_checks.salechecklist = function(){
	return customer_checks.find({}, {sort: {date_in: -1} } );
};

Template.purchase_checks.purchasechecklist = function(){
	return supplier_checks.find({}, {sort: {date_in: -1} } );
};

Template.sale_checks_badge.sale_checks = function(){
	return customer_checks.find({}, {sort: {date_in: -1} } );
};

Template.accounts_receivable.checks = function(){
	return customer_checks.find({}, {sort: {date_in: -1} } );
};

Template.accounts_receivable_badge.checks = function(){
	return customer_checks.find({}, {sort: {date_in: -1} } );
};

Template.sold_checks.checklist = function(){
	return customer_checks.find({}, {sort: {contact_person: 1} } );
};

Template.sale_checks.events({
	'click .btnBounce': function(e,t){
		console.log(e.target.id);
		customer_checks.update({_id: e.target.id}, {$set: {date_bounced: Date()} });
	},
	'click .btnEncash': function(e,t){
		customer_checks.update({_id: e.target.id}, {$set: {date_encashed: Date()} });
	},
	'click .btnRemoveCheck': function (e,t){
		// console.log( e.target.id );
		Meteor.flush();
		customer_checks.remove({_id: e.target.id });
		
	},
});

Template.purchase_checks.events({
	'click .btnBounce': function(e,t){
		console.log(e.target.id);
		supplier_checks.update({_id: e.target.id}, {$set: {date_bounced: Date()} });
	},
	'click .btnEncash': function(e,t){
		supplier_checks.update({_id: e.target.id}, {$set: {date_encashed: Date()} });
	},
	'click .btnRemoveCheck': function (e,t){
		// console.log( e.target.id );
		Meteor.flush();
		supplier_checks.remove({_id: e.target.id });
		
	},

});

Template.sale_checksform.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#addSaleChecks").serializeArray(),function(){
			form[this.name] = this.value;
		});
			
		form['date_in'] = moment().format("YYYY-MM-DD");
		form['date_encashed'] = "";
		form['date_bounced'] = "";
		// var cn = car_info.findOne({chassis_number:form['chassis_number']  }).chassis_number;
		// var en = car_info.findOne({engine_number:form['engine_number'] }).engine_number;
		// if(cn === form['chassis_number'] && en === form['engine_number']){	
			customer_checks.insert( form, function(err){
				if(err){
					if(err.error === 403){
						alert("Only admins can add sale checks.")
					}else{
						alert("Something went wrong. Please try again.");
						console.log(err);
					}
					
				}
				else{
					$('#addSaleChecks')[0].reset();
				}
			});
		// }
		// else{
		// 	alert("Chassis/Enginer Number not found!");
		// 	e.preventDefault();
		// }
		

		e.preventDefault();
	}
});

Template.purchase_checksform.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#addPurchaseChecks").serializeArray(),function(){
			form[this.name] = this.value;
		});
			
		form['date_in'] = moment().format("YYYY-MM-DD");
		form['date_encashed'] = "";
		form['date_bounced'] = "";
		// var cn = car_info.findOne({chassis_number:form['chassis_number']  }).chassis_number;
		// var en = car_info.findOne({engine_number:form['engine_number'] }).engine_number;
		// if(cn === form['chassis_number'] && en === form['engine_number']){	
			supplier_checks.insert( form, function(err){
				if(err){
					if(err.error === 403){
						alert("Only admins can add checks.")
					}else{
						alert("Something went wrong. Please try again.");
						console.log(err);
					}
					
				}
				else{
					$('#addPurchaseChecks')[0].reset();
				}
			});
		// }
		// else{
		// 	alert("Chassis/Enginer Number not found!");
		// 	e.preventDefault();
		// }
		

		e.preventDefault();
	}
});
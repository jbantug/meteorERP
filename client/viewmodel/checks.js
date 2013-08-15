Template.sale_checks.salechecklist = function(){
	return customer_checks.find({}, {sort: {date_in: -1} } );

};

Template.purchase_checks.purchasechecklist = function(){
	return supplier_checks.find({}, {sort: {date_out: -1} });
};
Template.sale_checks.events({
	'click .btnBounce': function(e,t){
		console.log(e.target.id);
		customer_checks.update({_id: e.target.id}, {$set: {date_bounced: Date()} });
	},
	'click .btnEncash': function(e,t){
		customer_checks.update({_id: e.target.id}, {$set: {date_encashed: Date()} });
	},

});

Template.purchase_checks.events({
	'click .btnBounce': function(e,t){
		console.log(e.target.id);
		supplier_checks.update({_id: e.target.id}, {$set: {date_bounced: Date()} });
	},
	'click .btnEncash': function(e,t){
		customer_checks.update({_id: e.target.id}, {$set: {date_encashed: Date()} });
	},

});

Template.sale_checksform.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#addSaleChecks").serializeArray(),function(){
			form[this.name] = this.value;
		});
			
		form['date_in'] = Date();
		form['date_encashed'] = "";
		form['date_bounced'] = "";
		var cn = car_in.findOne({sku: form['sku'],  }).chassis_number;
		var en = car_in.findOne({sku: form['sku'] }).engine_number;
		if(cn === form['chassis_number'] && en === form['engine_number']){	

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
		}
		else{
			alert("Chassis/Enginer Number not found!");
			e.preventDefault();
		}
		

		e.preventDefault();
	}
});

Template.purchase_checksform.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#addPurchaseChecks").serializeArray(),function(){
			form[this.name] = this.value;
		});
			
		form['date_out'] = Date();
		form['date_bounced'] = "";
		// console.log(form['chassis_number']);
		// console.log(form['engine_number'])
		var cn = car_in.findOne({sku: form['sku'],  }).chassis_number;
		var en = car_in.findOne({sku: form['sku'] }).engine_number;
		// console.log(cn);
		// console.log(en);
		if(cn === form['chassis_number'] && en === form['engine_number']){	

			supplier_checks.insert( form, function(err){
				if(err){
					if(err.error === 403){
						alert("Only admins can add sale checks.")
					}else{
						alert("Something went wrong. Please try again.");
						console.log(err);
					}
					
				}
				else{
					$('#addPurchaseChecks')[0].reset();
				}
			});
		}
		else{
			alert("Chassis/Enginer Number not found!");
			e.preventDefault();
		}
		

		e.preventDefault();
	}
});
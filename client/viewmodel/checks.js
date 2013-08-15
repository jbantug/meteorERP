Template.sale_checks.salechecklist = function(){
	return customer_checks.find({}, {sort: {date_in: -1} } );

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

Template.sale_checksform.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#addSaleChecks").serializeArray(),function(){
			form[this.name] = this.value;
		});
			
		form['date_in'] = Date();
		form['date_encashed'] = "";
		form['date_bounced'] = "";
		
		var cn = car_in.findOne({sku: form['sku'] }).chassis_number;
		var en = car_in.findOne({sku: form['sku'] }).engine_number;
		if(cn&&en){
			form['chassis_number'] = cn;
			form['engine_number'] = en;
		
		

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
	},
	'click #btnCancel': function(e,t){
		Session.set('editing_customer', false);
		Session.set('cid', null);

		
		$("form#addSaleChecks").hide();
		$('#addSaleChecks')[0].reset();
		// Meteor.flush();	
	},
	'click #btnUpdateCustomer': function (e,t){
		form = {};

		$.each( $("#addSaleChecks").serializeArray(),function(){
			form[this.name] = this.value;
		});

		customers.update({_id: form['id']}, {$set: {name: form['name'], company: form['company'], description: form['description'] } });
	}
});
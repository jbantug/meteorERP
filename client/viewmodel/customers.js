Session.set('editing_customer', false);
Session.set('cid', null);

Template.customers.customers = function(){
	return customers.find( {}, {sort: {dateadded: -1}} );
};

Template.sale_order_customers.customers = function(){
	return customers.find({},{sort:{name: 1}});
}

Template.customers_dropdown.customers = function(){
	return customers.find( {}, {sort: {dateadded: -1} } );
};

Template.customers.events({
	'click .btnRemoveCustomer': function (e,t){
		// console.log( e.target.id );
		Session.set('cid', null);
		Meteor.flush();
		customers.remove({_id: this._id });
		
	},
	'click .btnEditCustomer': function (e,t){
		Session.set('editing_customer', true);
		Session.set('cid', this._id);

		Meteor.flush();	
		$("form#form_addCustomer").show();
		
	}
});

Template.customer_form.editing_customer = function(){
	return Session.equals('editing_customer', true);
};

Template.customer_form.info = function(){
	if(Session.equals('cid', null)){
		return null;
	}
	else{
		var sid = Session.get('cid')
		var info = customers.find( { _id: sid} );
		if(info){
			return info;
		}
		return info["name"] = "none selected";
	}

};

Template.customer_form.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#form_addCustomer").serializeArray(),function(){
			form[this.name] = this.value;
		});
			
		form['dateadded'] = Date.now();

		customers.insert( form, function(err){
			if(err){
				if(err.error === 403){
					alert("Only admins can create new customers.")
				}else{
					alert("Something went wrong. Please try again.");
					console.log(err);
				}
				
			}
			else{
				$('#form_addCustomer')[0].reset();
			}
		});

		e.preventDefault();
	},
	'click #btnCancel': function(e,t){
		Session.set('editing_customer', false);
		Session.set('cid', null);

		
		$("form#form_addCustomer").hide();
		$('#form_addCustomer')[0].reset();
		// Meteor.flush();	
	},
	'click #btnUpdateCustomer': function (e,t){
		form = {};

		$.each( $("#form_addCustomer").serializeArray(),function(){
			form[this.name] = this.value;
		});

		customers.update({_id: form['id']}, {$set: {name: form['name'], company: form['company'], description: form['description'] } });
	}
});

//handlebar helpers
Handlebars.registerHelper("get_customer", function(cus_id) {
  return cars.findOne({_id:cus_id}).name;
});
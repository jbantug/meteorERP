Session.set('editing_customer', false);
Session.set('cid', null);
Session.set('customers_find', {});
Session.set('car_customer_id', {});
Session.set('billing_customer', null);
Session.set('billing_id', null);
Session.set('customer', null);
Session.set('invoice_customer', null);
Session.set('invoice_id', null)

Template.customers.customers = function(){
	return customers.find( Session.get('customers_find'), {sort: {dateadded: -1} } );
};

Template.customers2.customers = function(){
	return customers.find( Session.get('customers_find'), {sort: {dateadded: -1} } );
};

Template.search_customers.events({
	'keydown input#c_input': function(e,t){
		query = $("#c_input").val();
		if($('#c_input').val() !== ""){
			Session.set('customers_find', {$or: [
				{contact_person: {$regex: query, $options: 'i'}},
				{position: {$regex: query, $options: 'i'}},
				{company_name: {$regex: query, $options: 'i'}},
				{company_address: {$regex: query, $options: 'i'}},
				{contact_number: {$regex: query, $options: 'i'}},
				{email: {$regex: query, $options: 'i'}}
			]});
		}else{
			Session.set('customers_find', {});
		}
	},
	'keyup input#c_input': function(e,t){
		query = $("#c_input").val(); 
		if($('#c_input').val() !== ""){
			Session.set('customers_find', {$or: [
				{contact_person: {$regex: query, $options: 'i'}},
				{position: {$regex: query, $options: 'i'}},
				{company_name: {$regex: query, $options: 'i'}},
				{company_address: {$regex: query, $options: 'i'}},
				{contact_number: {$regex: query, $options: 'i'}},
				{email: {$regex: query, $options: 'i'}}
			]});
		}else{
			Session.set('customers_find', {});
		}
	}
});

Template.search_customers2.events({
	'keydown input#c_input2': function(e,t){
		query = $("#c_input2").val();
		if($('#c_input2').val() !== ""){
			Session.set('customers_find', {$or: [
				{contact_person: {$regex: query, $options: 'i'}},
				{position: {$regex: query, $options: 'i'}},
				{company_name: {$regex: query, $options: 'i'}},
				{company_address: {$regex: query, $options: 'i'}},
				{contact_number: {$regex: query, $options: 'i'}},
				{email: {$regex: query, $options: 'i'}}
			]});
		}else{
			Session.set('customers_find', {});
		}
	},
	'keyup input#c_input2': function(e,t){
		query = $("#c_input2").val(); 
		if($('#c_input2').val() !== ""){
			Session.set('customers_find', {$or: [
				{contact_person: {$regex: query, $options: 'i'}},
				{position: {$regex: query, $options: 'i'}},
				{company_name: {$regex: query, $options: 'i'}},
				{company_address: {$regex: query, $options: 'i'}},
				{contact_number: {$regex: query, $options: 'i'}},
				{email: {$regex: query, $options: 'i'}}
			]});
		}else{
			Session.set('customers_find', {});
		}
	}
});

Template.search_specific2.events({
	'keydown input#ch_input2': function(e,t){
		query = $("#ch_input2").val();
		if($('#ch_input2').val() !== ""){
			Session.set('customers_find', {$or: [
				{contact_person: {$regex: query, $options: 'i'}},
				{position: {$regex: query, $options: 'i'}},
				{company_name: {$regex: query, $options: 'i'}},
				{company_address: {$regex: query, $options: 'i'}},
				{contact_number: {$regex: query, $options: 'i'}},
				{email: {$regex: query, $options: 'i'}}
			]});
		}else{
			Session.set('customers_find', {});
		}
	},
	'keyup input#ch_input2': function(e,t){
		query = $("#ch_input2").val();
		if($('#ch_input2').val() !== ""){
			Session.set('customers_find', {$or: [
				{contact_person: {$regex: query, $options: 'i'}},
				{position: {$regex: query, $options: 'i'}},
				{company_name: {$regex: query, $options: 'i'}},
				{company_address: {$regex: query, $options: 'i'}},
				{contact_number: {$regex: query, $options: 'i'}},
				{email: {$regex: query, $options: 'i'}}
			]});
		}else{
			Session.set('customers_find', {});
		}
	}
});

Template.customers_badge.customers = function(){
	return customers.find( {}, {sort: {dateadded: -1} } );
};

Template.sale_order_customers.customers = function(){
	return customers.find({},{sort:{name: 1}});
}

Template.customers_dropdown.customers = function(){
	return customers.find( {}, {sort: {dateadded: -1} } );
};

Template.customer_to_sell.customers = function() {
	return customers.find({},{sort: {contact_person: 1}});
};

Template.check_customers.customers = function(){
	return customers.find( {}, {sort: {dateadded: -1} } );
};

Template.customers.events({
	'click .btnRemoveCustomer': function (e,t){
		Meteor.flush();
		customers.remove({_id: this._id });
		
	},
	'click .btnEditCustomer': function (e,t){
		Session.set('editing_customer', true);
		Session.set('cid', this._id);

		Meteor.flush();	
		$("form#form_addCustomer").show();
		$("form#form_addCustomer2").show();
	},
	'click .btnBilling': function(e,t){
		Session.set('billing_customer', {_id: this._id});
		Session.set('billing_id', {customer_id: this._id});
		Session.set('customer', this._id);
	},
	'click .btnSalesInvoice': function(e,t){
		Session.set('billing_customer', {_id: this._id});
		Session.set('billing_id', {customer_id: this._id});
		Session.set('customer', this._id);
	},
	'click .btnStatement': function(e,t){
		Session.set('billing_customer', {_id: this._id});
		Session.set('billing_id', {customer_id: this._id});
		Session.set('customer', this._id);
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
			
		form['dateadded'] = moment().format("YYYY-MM-DD");

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

		customers.update({_id: form['id']}, {$set: {contact_person: form['contact_person'], position: form['position'], company_name: form['company_name'], company_address: form['company_address'], contact_number: form['contact_number'], email: form['email'] } });
	}
});

Template.customer_form2.editing_customer = function(){
	return Session.equals('editing_customer', true);
};

Template.customer_form2.info = function(){
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

Template.customer_form2.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#form_addCustomer2").serializeArray(),function(){
			form[this.name] = this.value;
		});
			
		form['dateadded'] = moment().format("YYYY-MM-DD");

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
				$('#form_addCustomer2')[0].reset();
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

		$.each( $("#form_addCustomer2").serializeArray(),function(){
			form[this.name] = this.value;
		});

		customers.update({_id: form['id']}, {$set: {contact_person: form['contact_person'], position: form['position'], company_name: form['company_name'], company_address: form['company_address'], contact_number: form['contact_number'], email: form['email'] } });
	}
});

Template.customer_form3.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#form_addCustomer3").serializeArray(),function(){
			form[this.name] = this.value;
		});
			
		form['dateadded'] = moment().format("YYYY-MM-DD");

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
				$('#form_addCustomer3')[0].reset();
			}
		});

		e.preventDefault();
	}
});

Template.customer_item_list.customers = function(){
	return customers.find(Session.get('customers_find'), {sort: {contact_person: 1} } );
}

Template.customer_item_list.events({
	'click .accordion-toggle': function(e,t){
		Session.set('car_customer_id',{customer_id: this._id});
	},
});


//handlebar helpers
Handlebars.registerHelper("get_customer", function(customer_id) {
	var result = customers.findOne({_id:customer_id}).contact_person;
  	return result;
});
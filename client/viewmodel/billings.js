Session.set('billings_find', {});

Template.billings.billings = function(){
	return billings.find( Session.get('billings_find'), {sort: {dateadded: -1} } );
};

Template.billings.events({
	'click .btnRemoveCustomer': function (e,t){
		// console.log( e.target.id );
		Meteor.flush();
		billings.remove({_id: this._id });
		
	},
});

Template.billing_form.editing_customer = function(){
	return Session.equals('editing_customer', true);
};

Template.billing_form.info = function(){
	if(Session.equals('cid', null)){
		return null;
	}
	else{
		var sid = Session.get('cid')
		var info = billings.find( { _id: sid} );
		if(info){
			return info;
		}
		return info["name"] = "none selected";
	}

};

Template.billing_form.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#form_addCustomer").serializeArray(),function(){
			form[this.name] = this.value;
		});
			
		form['dateadded'] = moment().format("MMM DD YYYY");

		billings.insert( form, function(err){
			if(err){
				if(err.error === 403){
					alert("Only admins can create new billings.")
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

		billings.update({_id: form['id']}, {$set: {contact_person: form['comtact_person'], position: form['position'], company_name: form['company_name'], company_address: form['company_address'], contact_number: form['contact_number'], email: form['email'] } });
	}
});

Template.billing.customer = function(){	
	var to_return = null;
	if (Session.get('billing_customer')) {
		to_return = customers.findOne(Session.get('billing_customer')).contact_person;
	};
	return to_return;
};

Template.billing.date = function(){
	return moment().format("MMMM DD YYYY");
};

Template.billing.car_info = function(){
	return car_info.find(Session.get('car_customer_id'), {sort: {encashed}});
}
Session.set('editing_customer', false);
Session.set('cid', null);
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
	'click .btnEditCustomer': function (e,t){
		Session.set('editing_customer', true);
		Session.set('cid', this._id);

		Meteor.flush();	
		$("form#form_addCustomer").show();
		
	}
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

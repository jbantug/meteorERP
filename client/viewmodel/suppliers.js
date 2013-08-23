Session.set('editing_supplier', false);
Session.set('sid', null);
Session.set('suppliers_find', {});

Template.suppliers.suppliers = function(){
	return suppliers.find( Session.get('suppliers_find'), {sort: {dateadded: -1} } );
};

Template.search_supplier.events({
	'keydown input#s_input': function(e,t){
		query = $("#s_input").val();
		if($('#c_input').val() !== ""){
			Session.set('suppliers_find', {$or: [
				{contact_person: {$regex: query, $options: 'i'}},
				{position: {$regex: query, $options: 'i'}},
				{company_name: {$regex: query, $options: 'i'}},
				{company_address: {$regex: query, $options: 'i'}},
				{contact_number: {$regex: query, $options: 'i'}},
				{email: {$regex: query, $options: 'i'}}
			]});
		}else{
			Session.set('suppliers_find', {});
		}
	},
	'keyup input#s_input': function(e,t){
		query = $("#s_input").val(); 
		if($('#s_input').val() !== ""){
			Session.set('suppliers_find', {$or: [
				{contact_person: {$regex: query, $options: 'i'}},
				{position: {$regex: query, $options: 'i'}},
				{company_name: {$regex: query, $options: 'i'}},
				{company_address: {$regex: query, $options: 'i'}},
				{contact_number: {$regex: query, $options: 'i'}},
				{email: {$regex: query, $options: 'i'}}
			]});
		}else{
			Session.set('suppliers_find', {});
		}
	}
});

Template.suppliers_badge.suppliers = function(){
	return suppliers.find( {}, {sort: {dateadded: -1} } );
};

Template.purchase_order_suppliers.suppliers = function(){
	return suppliers.find( {}, {sort: {dateadded: -1} } );
};

Template.add_inventory_suppliers.suppliers = function(){
	return suppliers.find( {}, {sort: {dateadded: -1} } );
};

Template.check_suppliers.suppliers = function(){
	return suppliers.find( {}, {sort: {contact_person: -1} } );
};

Template.expense_suppliers.suppliers = function(){
	return suppliers.find( {}, {sort: {contact_person: -1} } );
};

Template.suppliers.events({
	'click .btnRemoveSupplier': function (e,t){
		Meteor.flush();
		suppliers.remove({_id: this._id });
		
	},
	'click .btnEditSupplier': function (e,t){
		Session.set('editing_supplier', true);
		Session.set('sid', this._id);

		Meteor.flush();	
		$("form#form_addSupplier").show();
		
	}
});

Template.supplier_form.editing_supplier = function(){
	return Session.equals('editing_supplier', true);
};

Template.supplier_form.info = function(){
	if(Session.equals('sid', null)){
		return null;
	}
	else{
		var sid = Session.get('sid')
		var info = suppliers.find( { _id: sid} );
		if(info){
			return info;
		}
		return info["name"] = "none selected";
	}

};

Template.supplier_form.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#form_addSupplier").serializeArray(),function(){
			form[this.name] = this.value;
		});
			
		form['dateadded'] = moment().format("YYYY-MM-DD");

		suppliers.insert( form, function(err){
			if(err){
				if(err.error === 403){
					alert("Only admins can create new suppliers.")
				}else{
					alert("Something went wrong. Please try again.");
					console.log(err);
				}
				
			}
			else{
				$('#form_addSupplier')[0].reset();
			}
		});

		e.preventDefault();
	},
	'click #btnCancel': function(e,t){
		Session.set('editing_supplier', false);
		Session.set('sid', null);

		
		$("form#form_addSupplier").hide();
		$('#form_addSupplier')[0].reset();
		// Meteor.flush();	
	},
	'click #btnUpdateSupplier': function (e,t){
		form = {};

		$.each( $("#form_addSupplier").serializeArray(),function(){
			form[this.name] = this.value;
		});

		suppliers.update({_id: form['id']}, {$set: {contact_person: form['contact_person'], position: form['position'], company_name: form['company_name'], company_address: form['company_address'], contact_number: form['contact_number'], email: form['email'] } });
	}
});

//handlebars
Handlebars.registerHelper("get_supplier", function(supplier_id) {
	var result = suppliers.findOne({_id:supplier_id}).contact_person;
  	return result;
});
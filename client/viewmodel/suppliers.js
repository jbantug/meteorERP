Session.set('editing_supplier', false);
Session.set('sid', null);
Session.set('suppliers_find', {});

Template.suppliers.suppliers = function(){
	return suppliers.find( Session.get('suppliers_find'), {sort: {dateadded: -1} } );
};

Template.search_supplier.events({
	'click #s_search': function(e,t){
		if($('#s_input').val() !== ""){
			Session.set('suppliers_find', {name:$('#s_input').val()});
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
	return suppliers.find( {}, {sort: {dateadded: -1} } );
};

Template.suppliers.events({
	'click .btnRemoveSupplier': function (e,t){
		// console.log( e.target.id );
		Session.set('sid', null);
		Meteor.flush();
		suppliers.remove({_id: e.target.id });
		
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
			
		form['dateadded'] = Date.now();

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

		suppliers.update({_id: form['id']}, {$set: {name: form['name'], company: form['company'], description: form['description'] } });
	}
});

//handlebars
Handlebars.registerHelper("get_supplier", function(supplier_id) {
	var result = suppliers.findOne({_id:supplier_id}).name;
  	return result;
});
Session.set('editing_sales_order', false);
Session.set('editing_purchase_order', false);
Session.set('soid', null);
Session.set('poid', null);

Template.sales_orders.cars_out = function(){
	return car_out.find( {}, {sort: {dateadded: -1} } );
};

Template.sales_orders_badge.cars_out = function(){
	return car_out.find();
}

Template.sales_orders.events({
	'click .btnRemoveSO': function (e,t){
		// console.log( e.target.id );
		Session.set('soid', null);
		Meteor.flush();
		car_out.remove({_id: e.target.id });
		
	},
	'click .btnEditSupplier': function (e,t){
		Session.set('editing_sales_order', true);
		Session.set('soid', this._id);

		Meteor.flush();	
		$("form#form_addSO").show();
		
	}
});

Template.sales_order_form.events({
	'click #btnAddSO': function (e,t){
		form = {
			customer_id: $('#sale_customer').val(),
			sku: $('#so_item').val(),
			date_in: moment().format("MM DD YYYY"),
			chassis_number: $('#so_chassis').val(),
			engine_number: $('#so_engine').val(),
			delivery_date: $('#so_delivery').val(),
			date_out: null,
			price: $('#so_price').val(),
			delivered: false
		};

		car_out.insert( form, function(err){
			if(err){
				if(err.error === 403){
					alert("Only admins can create new suppliers.")
				}else{
					alert("Something went wrong. Please try again.");
					console.log(err);
				}
				
			}
			else{
				$('#form_addSO')[0].reset();
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
	'click #btnUpdateSO': function (e,t){
		form = {};

		$.each( $("#form_addSupplier").serializeArray(),function(){
			form[this.name] = this.value;
		});

		suppliers.update({_id: form['id']}, {$set: {name: form['name'], company: form['company'], description: form['description'] } });
	}
});

Template.sales_order_form.editing_sales_order = function(){
	return Session.equals('editing_sales_order', true);
};

Template.sales_order_form.info = function(){
	if(Session.equals('soid', null)){
		return null;
	}
	else{
		var sid = Session.get('soid')
		var info = suppliers.find( { _id: soid} );
		if(info){
			return info;
		}
		return info["name"] = "none selected";
	}

}

Template.purchase_orders.purchases = function(){
	return purchases.find( {}, {sort: {dateadded: -1} } );
};

Template.purchase_orders_badge.purchase_orders = function(){
	return purchases.find( {}, {sort: {dateadded: -1} } );
};

Template.purchase_orders.events({
	'click .btnRemovePO': function (e,t){
		// console.log( e.target.id );
		Session.set('poid', null);
		Meteor.flush();
		purchases.remove({_id: e.target.id });
		
	},
	'click .btnEditPO': function (e,t){
		Session.set('editing_purchase_order', true);
		Session.set('poid', this._id);

		Meteor.flush();	
		$("form#form_addPO").show();
		
	}
});

Template.purchase_order_form.events({
	'click #btnAddPO': function (e,t){
		var car_id = cars.findOne({maker:$('#purchase_maker').val(),model:$('#purchase_model').val(),color:$('#purchase_color').val()})._id;
		form = {
			supplier_id: $('#purchase_supplier').val(),
			sku: car_id,
			date_in: moment().format("MM DD YYYY"),
			delivery_date: $('#po_delivery').val(),
			price: $('#po_price').val(),
			delivered: false
		};

		purchases.insert( form, function(err){
			if(err){
				if(err.error === 403){
					alert("Only admins can create new suppliers.")
				}else{
					alert("Something went wrong. Please try again.");
					console.log(err);
				}
				
			}
			else{
				$('#form_addPO')[0].reset();
			}
		});

		e.preventDefault();
	},
	'click #btnCancel': function(e,t){
		Session.set('editing_purchase_order', false);
		Session.set('poid', null);

		
		$("form#form_addPO").hide();
		$('#form_addPO')[0].reset();
		// Meteor.flush();	
	},
	'click #btnUpdatePO': function (e,t){
		form = {};

		$.each( $("#form_addPO").serializeArray(),function(){
			form[this.name] = this.value;
		});

		purchases.update({_id: form['id']}, {$set: {name: form['name'], company: form['company'], description: form['description'] } });
	}

});
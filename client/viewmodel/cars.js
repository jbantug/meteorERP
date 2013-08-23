Session.set('editing_car', false);
Session.set('current_maker', null);
Session.set('current_model', null);
Session.set('car_id', null);
Session.set('car_to_sell', null);
Session.set('inventory_find', {});

Template.car_models.car_models = function(){
	return car_info.find( {}, {sort: {dateadded: -1} } );
};

Template.inventory.inventory_list = function() {
	return car_info.find(Session.get('inventory_find'), {sort: {date_in: -1}});
}

Template.purchase_inventory.inventory_list = function() {
	return car_info.find(Session.get('inventory_find'), {sort: {date_in: -1}});
}

Template.sales_inventory.inventory_list = function() {
	return car_info.find(Session.get('inventory_find'), {sort: {date_in: -1}});
}

Template.inventory.events({
	'click .btnRemoveItem': function (e,t){
		Meteor.flush();
		car_info.remove({_id: e.target.id });
		
	},
	'click .btnSellItem' : function (e,t){
		Session.set('car_to_sell', this._id);
	},
});

Template.to_be_sold.car_info = function() {
	return car_info.findOne({id: Session.get('car_to_sell')});
}

Template.to_be_sold.events({
	'click #toSell': function(e,t){
		form = {};

		$.each( $("#form_addCarSale").serializeArray(),function(){
			form[this.name] = this.value;
		});

		car_info.update({_id: Session.get('car_to_sell')}, {$set: {customer_id: form['customer_id'], delivery_date: form['delivery_date'], selling_price: form['selling_price']} });

		Session.set('car_to_sell',null);
	}
});

Template.sales_inventory.events({
	'click .btnRemoveItem': function (e,t){
		Meteor.flush();
		car_info.remove({_id: e.target.id });
		
	},
	'click .btnSellItem' : function (e,t){
		Session.set('car_to_sell', this._id);
	},
});

Template.to_be_sold_sales.car_info = function() {
	return car_info.findOne({id: Session.get('car_to_sell')});
}

Template.to_be_sold_sales.events({
	'click #toSell2': function(e,t){
		form = {};

		$.each( $("#form_addCarSale2").serializeArray(),function(){
			form[this.name] = this.value;
		});

		car_info.update({_id: Session.get('car_to_sell')}, {$set: {customer_id: form['customer_id'], delivery_date: form['delivery_date'], selling_price: form['selling_price']} });

		Session.set('car_to_sell',null);
	}
});

Template.car_models.events({
	'click .btnRemoveCarModel': function (e,t){
		// console.log( e.target.id );
		Meteor.flush();
		car_info.remove({_id: e.target.id });
		
	},
	'click .btnEditCarModel': function (e,t){
		Session.set('editing_car_model', true);
		Session.set('sid', this._id);

		Meteor.flush();	
		$("form#form_addCarModel").show();
		
	}
});

Template.supplier_form.editing_car_model = function(){
	return Session.equals('editing_car_model', true);
}

Template.supplier_form.info = function(){
	if(Session.equals('sid', null)){
		return null;
	}
	else{
		var sid = Session.get('sid')
		var info = car_info.find( { _id: sid} );
		if(info){
			return info;
		}
		return info["name"] = "none selected";
	}

}

Template.sale_order_items.items = function(){
	return car_info.find({}, {sort: {date_in: -1}});
}

Template.car_model_form.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#form_addCarModel").serializeArray(),function(){
			form[this.name] = this.value;
		});
			
		form['dateadded'] = Date("yyyy-MMM-DD HH:mmM");

		car_info.insert( form, function(err){
			if(err){
				if(err.error === 403){
					alert("Only admins can create new suppliers.")
				}else{
					alert("Something went wrong. Please try again.");
					console.log(err);
				}
				
			}
			else{
				$('#form_addCarModel')[0].reset();
			}
		});

		e.preventDefault();
	},
	'click #btnCancel': function(e,t){
		Session.set('editing_car_model', false);
		Session.set('sid', null);
		
		$("form#form_addCarModel").hide();
		$('#form_addCarModel')[0].reset();
	},
	'click #btnUpdateCarModel': function (e,t){
		form = {};

		$.each( $("#form_addCarModel").serializeArray(),function(){
			form[this.name] = this.value;
		});

		car_info.update({_id: form['id']}, {$set: {maker: form['maker'], model: form['model'], color: form['color'] } });
	}
});


Template.add_inventory_form.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#form_addInventory").serializeArray(),function(){
			form[this.name] = this.value;
		});
		var yen = parseFloat(form['yen_cost']);
		var rate = parseFloat(form['exchange_rate']);
		var factor = parseFloat(form['brokerage_factor']);
		var fh = parseFloat(form['freight_handling']);
		var dt = parseFloat(form['duties_and_taxes']);
		form['customer_id'] = "";
		form['total_cost'] = ((yen*rate)+dt+(yen*rate*factor)+fh);
		form['dateadded'] = moment().format("YYYY-MM-DD");
		form['assembly_reconditioning'] = 0;
		form['selling_price'] = "";
		form['net_margin'] = "";
		form['delivery_date'] = "";
		form['date_out'] = "";
		form['delivered'] = false;

		if(car_info.find({control_number: form['control_number']}).count() === 0 ){
			car_info.insert( form, function(err){
				if(err){
					if(err.error === 403){
						alert("Only admins can add new cars.")
					}else{
						alert("Something went wrong. Please try again.");
						console.log(err);
					}
				}
				else{
					$('#form_addInventory')[0].reset();
					$('#control_number').focus();
				}
			});
		}else{
			alert("Warning: Control Number already exists.");
		}

		e.preventDefault();
	}

});

Template.search_specific.events({
	'keydown input#ch_input': function(e,t){
		query = $("#ch_input").val();
		if($('#ch_input').val() !== ""){
			Session.set('inventory_find', {$or: [
				{control_number: {$regex: query, $options: 'i'}},
				{maker: {$regex: query, $options: 'i'}},
				{model: {$regex: query, $options: 'i'}},
				{engine: {$regex: query, $options: 'i'}},
				{chassis: {$regex: query, $options: 'i'}},
				{yen_cost: {$regex: query, $options: 'i'}},
				{exchange_rate: {$regex: query, $options: 'i'}},
				{duties_and_taxes: {$regex: query, $options: 'i'}},
				{brokerage_factor: {$regex: query, $options: 'i'}},
				{assembly_reconditioning: {$regex: query, $options: 'i'}},
				{freight_handling: {$regex: query, $options: 'i'}},
				{reference_number: {$regex: query, $options: 'i'}},
				{total_cost: {$regex: query, $options: 'i'}},
				{selling_price: {$regex: query, $options: 'i'}},
			]});
		}else{
			Session.set('inventory_find', {});
		}
	},
	'keyup input#ch_input': function(e,t){
		query = $("#ch_input").val();
		if($('#ch_input').val() !== ""){
			Session.set('inventory_find', {$or: [
				{control_number: {$regex: query, $options: 'i'}},
				{maker: {$regex: query, $options: 'i'}},
				{model: {$regex: query, $options: 'i'}},
				{engine: {$regex: query, $options: 'i'}},
				{chassis: {$regex: query, $options: 'i'}},
				{yen_cost: {$regex: query, $options: 'i'}},
				{exchange_rate: {$regex: query, $options: 'i'}},
				{duties_and_taxes: {$regex: query, $options: 'i'}},
				{brokerage_factor: {$regex: query, $options: 'i'}},
				{assembly_reconditioning: {$regex: query, $options: 'i'}},
				{freight_handling: {$regex: query, $options: 'i'}},
				{reference_number: {$regex: query, $options: 'i'}},
				{total_cost: {$regex: query, $options: 'i'}},
				{selling_price: {$regex: query, $options: 'i'}},
			]});
		}else{
			Session.set('inventory_find', {});
		}
	}
});

Template.search_specific3.events({
	'keydown input#ch_input3': function(e,t){
		query = $("#ch_input3").val();
		if($('#ch_input3').val() !== ""){
			Session.set('inventory_find', {$or: [
				{control_number: {$regex: query, $options: 'i'}},
				{maker: {$regex: query, $options: 'i'}},
				{model: {$regex: query, $options: 'i'}},
				{engine: {$regex: query, $options: 'i'}},
				{chassis: {$regex: query, $options: 'i'}},
				{yen_cost: {$regex: query, $options: 'i'}},
				{exchange_rate: {$regex: query, $options: 'i'}},
				{duties_and_taxes: {$regex: query, $options: 'i'}},
				{brokerage_factor: {$regex: query, $options: 'i'}},
				{assembly_reconditioning: {$regex: query, $options: 'i'}},
				{freight_handling: {$regex: query, $options: 'i'}},
				{reference_number: {$regex: query, $options: 'i'}},
				{total_cost: {$regex: query, $options: 'i'}},
				{selling_price: {$regex: query, $options: 'i'}},
			]});
		}else{
			Session.set('inventory_find', {});
		}
	},
	'keyup input#ch_input3': function(e,t){
		query = $("#ch_input3").val();
		if($('#ch_input3').val() !== ""){
			Session.set('inventory_find', {$or: [
				{control_number: {$regex: query, $options: 'i'}},
				{maker: {$regex: query, $options: 'i'}},
				{model: {$regex: query, $options: 'i'}},
				{engine: {$regex: query, $options: 'i'}},
				{chassis: {$regex: query, $options: 'i'}},
				{yen_cost: {$regex: query, $options: 'i'}},
				{exchange_rate: {$regex: query, $options: 'i'}},
				{duties_and_taxes: {$regex: query, $options: 'i'}},
				{brokerage_factor: {$regex: query, $options: 'i'}},
				{assembly_reconditioning: {$regex: query, $options: 'i'}},
				{freight_handling: {$regex: query, $options: 'i'}},
				{reference_number: {$regex: query, $options: 'i'}},
				{total_cost: {$regex: query, $options: 'i'}},
				{selling_price: {$regex: query, $options: 'i'}},
			]});
		}else{
			Session.set('inventory_find', {});
		}
	}
});

Template.search_specific4.events({
	'keydown input#ch_input4': function(e,t){
		query = $("#ch_input4").val();
		if($('#ch_input4').val() !== ""){
			Session.set('inventory_find', {$or: [
				{control_number: {$regex: query, $options: 'i'}},
				{maker: {$regex: query, $options: 'i'}},
				{model: {$regex: query, $options: 'i'}},
				{engine: {$regex: query, $options: 'i'}},
				{chassis: {$regex: query, $options: 'i'}},
				{yen_cost: {$regex: query, $options: 'i'}},
				{exchange_rate: {$regex: query, $options: 'i'}},
				{duties_and_taxes: {$regex: query, $options: 'i'}},
				{brokerage_factor: {$regex: query, $options: 'i'}},
				{assembly_reconditioning: {$regex: query, $options: 'i'}},
				{freight_handling: {$regex: query, $options: 'i'}},
				{reference_number: {$regex: query, $options: 'i'}},
				{total_cost: {$regex: query, $options: 'i'}},
				{selling_price: {$regex: query, $options: 'i'}},
			]});
		}else{
			Session.set('inventory_find', {});
		}
	},
	'keyup input#ch_input4': function(e,t){
		query = $("#ch_input4").val();
		if($('#ch_input4').val() !== ""){
			Session.set('inventory_find', {$or: [
				{control_number: {$regex: query, $options: 'i'}},
				{maker: {$regex: query, $options: 'i'}},
				{model: {$regex: query, $options: 'i'}},
				{engine: {$regex: query, $options: 'i'}},
				{chassis: {$regex: query, $options: 'i'}},
				{yen_cost: {$regex: query, $options: 'i'}},
				{exchange_rate: {$regex: query, $options: 'i'}},
				{duties_and_taxes: {$regex: query, $options: 'i'}},
				{brokerage_factor: {$regex: query, $options: 'i'}},
				{assembly_reconditioning: {$regex: query, $options: 'i'}},
				{freight_handling: {$regex: query, $options: 'i'}},
				{reference_number: {$regex: query, $options: 'i'}},
				{total_cost: {$regex: query, $options: 'i'}},
				{selling_price: {$regex: query, $options: 'i'}},
			]});
		}else{
			Session.set('inventory_find', {});
		}
	}
});

Template.search_specific5.events({
	'keydown input#ch_input5': function(e,t){
		query = $("#ch_input5").val();
		if($('#ch_input5').val() !== ""){
			Session.set('inventory_find', {$or: [
				{control_number: {$regex: query, $options: 'i'}},
				{maker: {$regex: query, $options: 'i'}},
				{model: {$regex: query, $options: 'i'}},
				{engine: {$regex: query, $options: 'i'}},
				{chassis: {$regex: query, $options: 'i'}},
				{yen_cost: {$regex: query, $options: 'i'}},
				{exchange_rate: {$regex: query, $options: 'i'}},
				{duties_and_taxes: {$regex: query, $options: 'i'}},
				{brokerage_factor: {$regex: query, $options: 'i'}},
				{assembly_reconditioning: {$regex: query, $options: 'i'}},
				{freight_handling: {$regex: query, $options: 'i'}},
				{reference_number: {$regex: query, $options: 'i'}},
				{total_cost: {$regex: query, $options: 'i'}},
				{selling_price: {$regex: query, $options: 'i'}},
			]});
		}else{
			Session.set('inventory_find', {});
		}
	},
	'keyup input#ch_input5': function(e,t){
		query = $("#ch_input5").val();
		if($('#ch_input5').val() !== ""){
			Session.set('inventory_find', {$or: [
				{control_number: {$regex: query, $options: 'i'}},
				{maker: {$regex: query, $options: 'i'}},
				{model: {$regex: query, $options: 'i'}},
				{engine: {$regex: query, $options: 'i'}},
				{chassis: {$regex: query, $options: 'i'}},
				{yen_cost: {$regex: query, $options: 'i'}},
				{exchange_rate: {$regex: query, $options: 'i'}},
				{duties_and_taxes: {$regex: query, $options: 'i'}},
				{brokerage_factor: {$regex: query, $options: 'i'}},
				{assembly_reconditioning: {$regex: query, $options: 'i'}},
				{freight_handling: {$regex: query, $options: 'i'}},
				{reference_number: {$regex: query, $options: 'i'}},
				{total_cost: {$regex: query, $options: 'i'}},
				{selling_price: {$regex: query, $options: 'i'}},
			]});
		}else{
			Session.set('inventory_find', {});
		}
	}
});

Template.search_specific6.events({
	'keydown input#ch_input6': function(e,t){
		query = $("#ch_input6").val();
		if($('#ch_input6').val() !== ""){
			Session.set('inventory_find', {$or: [
				{control_number: {$regex: query, $options: 'i'}},
				{maker: {$regex: query, $options: 'i'}},
				{model: {$regex: query, $options: 'i'}},
				{engine: {$regex: query, $options: 'i'}},
				{chassis: {$regex: query, $options: 'i'}},
				{yen_cost: {$regex: query, $options: 'i'}},
				{exchange_rate: {$regex: query, $options: 'i'}},
				{duties_and_taxes: {$regex: query, $options: 'i'}},
				{brokerage_factor: {$regex: query, $options: 'i'}},
				{assembly_reconditioning: {$regex: query, $options: 'i'}},
				{freight_handling: {$regex: query, $options: 'i'}},
				{reference_number: {$regex: query, $options: 'i'}},
				{total_cost: {$regex: query, $options: 'i'}},
				{selling_price: {$regex: query, $options: 'i'}},
			]});
		}else{
			Session.set('inventory_find', {});
		}
	},
	'keyup input#ch_input6': function(e,t){
		query = $("#ch_input6").val();
		if($('#ch_input6').val() !== ""){
			Session.set('inventory_find', {$or: [
				{control_number: {$regex: query, $options: 'i'}},
				{maker: {$regex: query, $options: 'i'}},
				{model: {$regex: query, $options: 'i'}},
				{engine: {$regex: query, $options: 'i'}},
				{chassis: {$regex: query, $options: 'i'}},
				{yen_cost: {$regex: query, $options: 'i'}},
				{exchange_rate: {$regex: query, $options: 'i'}},
				{duties_and_taxes: {$regex: query, $options: 'i'}},
				{brokerage_factor: {$regex: query, $options: 'i'}},
				{assembly_reconditioning: {$regex: query, $options: 'i'}},
				{freight_handling: {$regex: query, $options: 'i'}},
				{reference_number: {$regex: query, $options: 'i'}},
				{total_cost: {$regex: query, $options: 'i'}},
				{selling_price: {$regex: query, $options: 'i'}},
			]});
		}else{
			Session.set('inventory_find', {});
		}
	}
});

Template.price_list.items = function(){
	return car_info.find({}, {sort: {maker: 1}});
}

Template.to_deliver.car_info = function(){
	return car_info.find(Session.get('inventory_find'), {sort: {delivered: 1}});
}

Template.to_deliver.events({
	'click .btnDelivered': function(e,t){
		car_info.update({_id: e.target.id}, {$set: {delivered: true} });
	},
	'click .btnUndo': function(e,t){
		car_info.update({_id: e.target.id}, {$set: {delivered: false} });
	},
});

Template.sold_items.inventory_list = function() {
	return car_info.find(Session.get('inventory_find'), {sort: {dateadded: -1}});
}

Template.items_per_customer.inventory_list = function() {
	return car_info.find(Session.get('car_customer_id'), {sort: {dateadded: -1}});
}
//handlebar helpers
Handlebars.registerHelper("peso_cost", function(yen, rate) {
  return (yen * rate);
});

Handlebars.registerHelper("brokerage", function(yen, rate, factor) {
	return (factor * yen * rate);
});

Handlebars.registerHelper("get_car_maker", function(control_number) {
	return car_info.findOne({control_number: control_number}).maker;
});

Handlebars.registerHelper("get_car_model", function(control_number) {
	return car_info.findOne({control_number: control_number}).model;
});
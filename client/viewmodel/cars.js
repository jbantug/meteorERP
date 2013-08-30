Session.set('editing_car', false);
Session.set('current_maker', null);
Session.set('current_model', null);
Session.set('car_id', null);
Session.set('car_to_sell', null);
Session.set('inventory_find', {});
Session.set('car_expense', null);

Template.inventory.inventory_list = function() {
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
	'click .btnEditCar': function (e,t){
		Session.set('editing_car', true);
		Session.set('car_id', this._id);

		Meteor.flush();	
		$("form#form_addInventory").show();
	},
	'click .add_expense': function (e,t){
		Session.set('car_expense', this._id);
	}
});

Template.purchase_inventory.inventory_list = function() {
	return car_info.find(Session.get('inventory_find'), {sort: {date_in: -1}});
}

Template.sales_inventory.inventory_list = function() {
	return car_info.find(Session.get('inventory_find'), {sort: {date_in: -1}});
}

Template.sales_inventory.events({
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
		form['date_out'] = moment().format("YYYY-MM-DD");

		car_info.update({_id: Session.get('car_to_sell')}, {$set: {customer_id: form['customer_id'], delivery_date: form['delivery_date'], selling_price: form['selling_price'], date_out: form['date_out']} });

		Session.set('car_to_sell',null);
	}
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
		var sp = parseFloat(Math.round(form['selling_price']*100)/100).toFixed(2);

		car_info.update({_id: Session.get('car_to_sell')}, {$set: {customer_id: form['customer_id'], delivery_date: form['delivery_date'], selling_price: sp} });

		Session.set('car_to_sell',null);
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

Template.add_inventory_form.editing_car = function(){
	return Session.equals('editing_car', true);
}

Template.add_inventory_form.info = function(){
	if(Session.equals('car_id', null)){
		return null;
	}
	else{
		var car_id = Session.get('car_id')
		var info = car_info.find( { _id: car_id} );
		if(info){
			return info;
		}
		return info["name"] = "none selected";
	}

};

Template.add_inventory_form.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#form_addInventory").serializeArray(),function(){
			form[this.name] = this.value;
		});
		var yen = parseFloat(Math.round(form['yen_cost']*100)/100).toFixed(2);
		var rate = parseFloat(Math.round(form['exchange_rate']*1000)/1000).toFixed(4);
		var factor = parseFloat(Math.round(form['brokerage_factor']*100)/100).toFixed(2);
		var fh = parseFloat(Math.round(form['freight_handling']*100)/100).toFixed(2);
		var dt = parseFloat(Math.round(form['duties_and_taxes']*100)/100).toFixed(2);
		var pc = parseFloat(Math.round(parseFloat(yen) * parseFloat(rate) *100)/100).toFixed(2);
		var br = parseFloat(Math.round(parseFloat(pc) * parseFloat(factor) *100)/100).toFixed(2);
		var ar = "0.00";
		form['assembly_reconditioning'] = ar;
		form['yen_cost'] = yen;
		form['exchange_rate'] = rate;
		form['brokerage_factor'] = factor;
		form['freight_handling'] = fh;
		form['duties_and_taxes'] = dt;
		form['peso_cost'] = pc;
		form['brokerage'] = br;
		form['customer_id'] = "";
		form['total_cost'] = parseFloat(Math.round(((parseFloat(yen) * parseFloat(rate)) + parseFloat(dt) + (parseFloat(yen) * parseFloat(rate) * parseFloat(factor)) + parseFloat(fh) + parseFloat(ar)) * 100) / 100).toFixed(2);
		form['dateadded'] = moment().format("YYYY-MM-DD");
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
	},
	'click #btnCancel': function(e,t){
		Session.set('editing_car', false);
		Session.set('car_id', null);

		
		$("form#form_addInventory").hide();
		$('#form_addInventory')[0].reset();
		// Meteor.flush();	
	},
	'click #btnUpdateCar': function (e,t){
		form = {};

		$.each( $("#form_addInventory").serializeArray(),function(){
			form[this.name] = this.value;
		});

		var ar = parseFloat(Math.round(form['assembly_reconditioning']*100)/100).toFixed(2);
		var yen = parseFloat(Math.round(form['yen_cost']*100)/100).toFixed(2);
		var rate = parseFloat(Math.round(form['exchange_rate']*1000)/1000).toFixed(4);
		var factor = parseFloat(Math.round(form['brokerage_factor']*100)/100).toFixed(2);
		var fh = parseFloat(Math.round(form['freight_handling']*100)/100).toFixed(2);
		var dt = parseFloat(Math.round(form['duties_and_taxes']*100)/100).toFixed(2);
		var pc = parseFloat(Math.round(parseFloat(yen) * parseFloat(rate) *100)/100).toFixed(2);
		var br = parseFloat(Math.round(parseFloat(pc) * parseFloat(factor) *100)/100).toFixed(2);
		form['yen_cost'] = yen;
		form['exchange_rate'] = rate;
		form['brokerage_factor'] = factor;
		form['freight_handling'] = fh;
		form['duties_and_taxes'] = dt;
		form['peso_cost'] = pc;
		form['brokerage'] = br;
		form['total_cost'] = parseFloat(Math.round(((parseFloat(yen) * parseFloat(rate)) + parseFloat(dt) + (parseFloat(yen) * parseFloat(rate) * parseFloat(factor)) + parseFloat(fh) + parseFloat(ar)) * 100) / 100).toFixed(2);

		car_info.update({_id: form['id']},{$set: {control_number:form['control_number'],assembly_reconditioning: ar,brokerage_factor: factor,chassis: form['chassis'],duties_and_taxes: dt,engine:form['engine'],exchange_rate: rate,freight_handling: fh,maker:form['maker'],model:form['model'],reference_number: form['reference_number'],yen_cost: yen,total_cost: form['total_cost']} });
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
		car_info.update({_id: e.target.id}, {$set: {delivered: true, delivery_date: moment().format("YYYY-MM-DD")} });
	},
	'click .btnUndo': function(e,t){
		car_info.update({_id: e.target.id}, {$set: {delivered: false, delivery_date: ""} });
	},
});

Template.sold_items.inventory_list = function() {
	return car_info.find(Session.get('inventory_find'), {sort: {dateadded: -1}});
}

Template.items_per_customer.inventory_list = function() {
	return car_info.find(Session.get('car_customer_id'), {sort: {dateadded: -1}});
}

//handlebar helpers
	
Handlebars.registerHelper("get_car_maker", function(control_number) {
	return car_info.findOne({control_number: control_number}).maker;
});

Handlebars.registerHelper("get_car_model", function(control_number) {
	return car_info.findOne({control_number: control_number}).model;
});

Handlebars.registerHelper("get_whole", function(number) {
	var num = number.split('.');
	return num[0];
});

Handlebars.registerHelper("get_decimal", function(number) {
	var num = number.split('.');
	return num[1];
});
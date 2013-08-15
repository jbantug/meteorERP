Session.set('editing_car_model', false);
Session.set('current_maker', null);
Session.set('current_model', null);
Session.set('sid', null);

Template.car_models.car_models = function(){
	return cars.find( {}, {sort: {dateadded: -1} } );
};

Template.maker_dropdown.makers = function(){
	// return cars.find({}).distinct('maker', true);
	return cars.find( {}, {sort: {dateadded: -1} }).distinct('maker', true);
}

Template.add_inventory_makers.makers = function(){
	// return cars.find({}).distinct('maker', true);
	return cars.find( {}, {sort: {dateadded: -1} }).distinct('maker', true);
}

Template.add_inventory_makers.events({
	'change #add_maker': function(e,t){
		Session.set('current_maker',$('#add_maker').val());
	}
});

Template.purchase_order_makers.makers = function(){
	// return cars.find({}).distinct('maker', true);
	return cars.find( {}, {sort: {dateadded: -1} }).distinct('maker', true);
}

Template.model_dropdown.models = function(){
	// return cars.find({}).distinct('maker', true);
	return cars.find( {}, {sort: {dateadded: -1} }).distinct('model', true);
}

Template.add_inventory_models.models = function(){
	// return cars.find({}).distinct('maker', true);
	return cars.find( {maker:Session.get('current_maker')}, {sort: {dateadded: -1} }).distinct('model', true);
}

Template.add_inventory_models.events({
	'change #add_model': function(e,t){
		Session.set('current_model',$('#add_model').val());
	}
});

Template.purchase_order_models.models = function(){
	// return cars.find({}).distinct('maker', true);
	return cars.find( {}, {sort: {dateadded: -1} }).distinct('model', true);
}

Template.color_dropdown.colors = function(){
	// return cars.find({}).distinct('maker', true);
	return cars.find( {}, {sort: {dateadded: -1} }).distinct('color', true);
}

Template.add_inventory_colors.colors = function(){
	// return cars.find({}).distinct('maker', true);
	return cars.find( {model:Session.get('current_model'),maker:Session.get('current_maker')}, {sort: {dateadded: -1} }).distinct('color', true);
}

Template.purchase_order_colors.colors = function(){
	// return cars.find({}).distinct('maker', true);
	return cars.find( {}, {sort: {dateadded: -1} }).distinct('color', true);
}

Template.inventory.inventory_list = function() {
	return car_in.find({}, {sort: {date_in: -1}});
}

Template.car_models.events({
	'click .btnRemoveCarModel': function (e,t){
		// console.log( e.target.id );
		Meteor.flush();
		cars.remove({_id: e.target.id });
		
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
};

Template.supplier_form.info = function(){
	if(Session.equals('sid', null)){
		return null;
	}
	else{
		var sid = Session.get('sid')
		var info = cars.find( { _id: sid} );
		if(info){
			return info;
		}
		return info["name"] = "none selected";
	}

};

Template.car_model_form.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#form_addCarModel").serializeArray(),function(){
			form[this.name] = this.value;
		});
			
		form['dateadded'] = Date("yyyy-MM-DD HH:mm");

		cars.insert( form, function(err){
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
		// Meteor.flush();	
	},
	'click #btnUpdateCarModel': function (e,t){
		form = {};

		$.each( $("#form_addCarModel").serializeArray(),function(){
			form[this.name] = this.value;
		});

		cars.update({_id: form['id']}, {$set: {maker: form['maker'], model: form['model'], color: form['color'] } });
	}
});


Template.add_inventory_form.events({
	'click #btnAddInventory': function (e,t){
		var car_id = cars.findOne({maker:document.getElementById("add_maker").value,model:document.getElementById("add_model").value,color:document.getElementById("add_color").value})._id;
		form = {
			sku: car_id,
			date_in: Date("yyyy-MM-DD HH:mm"),
			chassis_number: document.getElementById("chassis_number").value,
			engine_number: document.getElementById("engine_number").value,
			freight_handling_cost: document.getElementById("freight_handling_cost").value,
			brokerage_cost: document.getElementById("brokerage_cost").value,
			yen_cost: document.getElementById("yen_cost").value,
			exchange_rate: document.getElementById("exchange_rate").value,
			supplier_id: document.getElementById("add_supplier").value
		};

		// $.each( $("#form_addInventory").serializeArray(),function(){
		// 	form[this.name] = this.value;
		// });

		//form['date_in'] = Date("yyyy-MM-DD HH:mm");

		// car_in.insert({
		// 	sku: cars.findOne({maker:form['maker'],model:form['model'],color:form['color']})._id,
		// 	date_in: form['date_in'],
		// 	chassis_number: form['chassis_number'],
		// 	engine_number: form['engine_number'],
		// 	freight_handling_cost: form['freight_handling_cost'],
		// 	brokerage_cost: form['brokerage_cost'],
		// 	yen_cost: form['yen_cost'],
		// 	exchange_rate: form['exchange_rate'],
		// 	supplier_id: form['supplier_id']
		// },function(err){
		// 	if(err){
		// 		if(err.error === 403){
		// 			alert("Only admins can create new items.")
		// 		}else{
		// 			alert("Something went wrong. Please try again.");
		// 			console.log(err);
		// 		}
				
		// 	}
		// 	else{
		// 		$('#form_addInventory')[0].reset();
		// 		alert("Success!");
		// 	}
		// });

		car_in.insert( form, function(err){
			if(err){
				if(err.error === 403){
					alert("Only admins can create new suppliers.")
				}else{
					alert("Something went wrong. Please try again.");
					console.log(err);
				}
				
			}
			else{
				$('#form_addInventory')[0].reset();
			}
		});

		e.preventDefault();
	}

});

//handlebars
Handlebars.registerHelper("peso_cost", function(yen, rate) {
  return (yen * rate);
});

Handlebars.registerHelper("item", function(sku) {
  var car_maker = cars.findOne({_id:sku}).maker;
  var car_model = cars.findOne({_id:sku}).model;
  var car_color = cars.findOne({_id:sku}).color;
  return (car_maker + " " + car_model + "(" + car_color + ")");
});
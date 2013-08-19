Session.set('editing_car_model', false);
Session.set('current_maker', null);
Session.set('current_model', null);
Session.set('inventory_find', {});

Template.car_models.car_models = function(){
	return cars.find( {}, {sort: {dateadded: -1} } );
};

Template.maker_dropdown.makers = function(){
	var myArray = cars.find().fetch();
	var distinctArray = _.uniq(myArray, false, function(d) {return d.maker});
	return distinctArray;
}

Template.add_inventory_makers.makers = function(){
	var myArray = cars.find().fetch();
	var distinctArray = _.uniq(myArray, false, function(d) {return d.maker});
	return distinctArray;
}

Template.add_inventory_makers.events({
	'click #add_maker': function(e,t){
		Session.set('current_maker',$('#add_maker').val());
	}
});

Template.purchase_order_makers.makers = function(){
	var myArray = cars.find().fetch();
	var distinctArray = _.uniq(myArray, false, function(d) {return d.maker});
	return distinctArray;
}

Template.purchase_order_makers.events({
	'click #purchase_maker': function(e,t){
		Session.set('current_maker',$('#purchase_maker').val());
	}
});

Template.model_dropdown.models = function(){
	var myArray = cars.find({maker:Session.get('current_maker')}).fetch();
	var distinctArray = _.uniq(myArray, false, function(d) {return d.model});
	return distinctArray;
}

Template.add_inventory_models.models = function(){
	var myArray = cars.find({maker:Session.get('current_maker')}).fetch();
	var distinctArray = _.uniq(myArray, false, function(d) {return d.model});
	return distinctArray;
}

Template.add_inventory_models.events({
	'click #add_model': function(e,t){
		Session.set('current_model',$('#add_model').val());
	}
});

Template.purchase_order_models.models = function(){
	var myArray = cars.find({maker:Session.get('current_maker')}).fetch();
	var distinctArray = _.uniq(myArray, false, function(d) {return d.model});
	return distinctArray;
}

Template.purchase_order_models.events({
	'click #purchase_model': function(e,t){
		Session.set('current_model',$('#purchase_model').val());
	}
});

Template.color_dropdown.colors = function(){
	var myArray = cars.find({maker:Session.get('current_maker'),model:Session.get('current_model')}).fetch();
	var distinctArray = _.uniq(myArray, false, function(d) {return d.color});
	return distinctArray;
}

Template.add_inventory_colors.colors = function(){
	var myArray = cars.find({maker:Session.get('current_maker'),model:Session.get('current_model')}).fetch();
	var distinctArray = _.uniq(myArray, false, function(d) {return d.color});
	return distinctArray;
}

Template.purchase_order_colors.colors = function(){
	var myArray = cars.find({maker:Session.get('current_maker'),model:Session.get('current_model')}).fetch();
	var distinctArray = _.uniq(myArray, false, function(d) {return d.color});
	return distinctArray;
}

Template.inventory.inventory_list = function() {
	return car_in.find(Session.get('inventory_find'), {sort: {date_in: -1}});
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
}

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

}

Template.sale_order_items.items = function(){
	return cars.find({}, {sort: {date_in: -1}});
}

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
		info = {
			customer_id: $('#customer_id').val(),
			control_number: $('#control_number').val(),
			maker: $('#maker').val(),
			model: $('#model').val(),
			dateadded: moment().format("ll");,
			chassis: $('#chassis_number').val(),
			engine: $('#engine_number').val(),
			reference_number: $('#reference_number').val(),
		};

		car_info.insert( info, function(err){
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
			}
		});

		costs = {
			control_number: $('#control_number').val(),
			yen_cost: $('#yen_cost').val(),
			exchange_rate: $('#exchange_rate').val(),
			duties_and_taxes: $('#duties_and_taxes').val(),
			brokerage_factor: $('#brokerage_factor').val(),
			assembly_reconditioning: $('#assembly_reconditioning').val(),
			freight_handling: $('#freight_handling').val(),
		};

		car_costs.insert( costs, function(err){
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
			}
		});

		e.preventDefault();
	}

});

Template.search_specific.events({
	'click #i_search': function(e,t){
		if($('#ch_input').val() !== "" && $('#en_input').val() !== ""){
			if(car_in.find({chassis_number:$('#ch_input').val(),engine_number:$('#en_input').val()}, {sort: {date_in: -1}}).count() > 0){
				Session.set('inventory_find', {chassis_number:$('#ch_input').val(),engine_number:$('#en_input').val()});
			}else{
				Session.set('inventory_find', {});	
			}
		}else{
			Session.set('inventory_find', {});
		}
	}
});

Template.price_list.items = function(){
	return car_in.find({}, {sort: {maker: 1}});
}

Template.to_deliver.car_out = function(){
	return car_out.find({}, {sort: {delivered: 1}});
}

Template.to_deliver.events({
	'click .btnDelivered': function(e,t){
		car_out.update({_id: e.target.id}, {$set: {delivered: true} });
	},
	'click .btnUndo': function(e,t){
		car_out.update({_id: e.target.id}, {$set: {delivered: false} });
	},

});

//handlebar helpers
Handlebars.registerHelper("peso_cost", function(yen, rate) {
  return (yen * rate);
});

Handlebars.registerHelper("item", function(sku) {
  var car_maker = cars.findOne({_id:sku}).maker;
  var car_model = cars.findOne({_id:sku}).model;
  var car_color = cars.findOne({_id:sku}).color;
  return (car_maker + " " + car_model + "(" + car_color + ")");
});

Handlebars.registerHelper("get_maker", function(sku) {
  return cars.findOne({_id:sku}).maker;
});

Handlebars.registerHelper("get_model", function(sku) {
  return cars.findOne({_id:sku}).model;
});

Handlebars.registerHelper("get_color", function(sku) {
  return cars.findOne({_id:sku}).color;
});
Session.set('editing_expense', false);
Session.set('xid', null);
Session.set('expenses_find', {});

Template.expenses_form.supplier_info = function(){
	return suppliers.find( {}, {sort: {dateadded: -1} } );
};

Template.expenses_form.editing_expense = function(){
	return Session.equals('editing_expense', true);
};

Template.expenses_form.info = function(){
	if(Session.equals('xid', null)){
		return null;
	}
	else{
		var xid = Session.get('xid')
		var info = expenses.find( { _id: xid} );
		if(info){
			return info;
		}
		return info["name"] = "none selected";
	}
};

Template.expenses.expenses = function(){
	return expenses.find( Session.get('expenses_find'), {sort: {date_in: -1} } );
};

Template.expenses.events({
	'click .btnRemoveExpense': function (e,t){
	// console.log( e.target.id );
	Session.set('xid', null);
	Meteor.flush();
	expenses.remove({_id: e.target.id });


	},
	'click .btnEditExpense': function (e,t){
		Session.set('editing_expense', true);
		Session.set('xid',  this._id );

		Meteor.flush();	
		$("form#form_addExpense").show();

	}
});

Template.expenses_form.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#form_addExpense").serializeArray(),function(){
			form[this.name] = this.value;
		});
		form['dateadded'] = moment().format("YYYY-MM-DD");
		if(car_info.find({control_number: form['control_number']}).count() != 0 ){

			var car = car_info.findOne({control_number: form['control_number']});
			var yen = parseFloat(car.yen_cost);
			var rate = parseFloat(car.exchange_rate);
			var dt = parseFloat(car.duties_and_taxes);
			var factor = parseFloat(car.brokerage_factor);
			var ar = parseFloat(form['amount']) + parseFloat(car.assembly_reconditioning);
			var fh = parseFloat(car.freight_handling);
			var total_cost = parseFloat(((yen*rate)+dt+(yen*rate*factor)+ar+fh));

			car_info.update({_id: car._id}, {$set: {total_cost: total_cost, assembly_reconditioning: ar  } });
			expenses.insert( form, function(err){
				if(err){
					if(err.error === 403){
						alert("Only admins can create new suppliers.")
					}else{
						alert("Something went wrong. Please try again.");
						console.log(err);
					}

				}
				else{
					$('#form_addExpense')[0].reset();
				}
			});
		}else{
			alert("Warning: Control Number does not exist.");
		}

			e.preventDefault();
	},
	'click #btnCancel': function(e,t){
		Session.set('editing_expense', false);
		Session.set('xid', null);


		$("form#form_addExpense").hide();
		$('#form_addExpense')[0].reset();
	// Meteor.flush();	
	},
	'click #btnUpdateExpense': function (e,t){
		form = {};

		$.each( $("#form_addExpense").serializeArray(),function(){
			form[this.name] = this.value;
		});

		expenses.update({_id: form['id']}, {$set: {xitem: form['xitem'], amount: form['amount'], supplier: form['supplier'], date_in: form['date_in'] } });
	}
});

Template.search_expenses.events({
	'keydown input#e_input': function(e,t){
		query = $("#e_input").val();
		if($('#e_input').val() !== ""){
			Session.set('expenses_find', {$or: [
				{item: {$regex: query, $options: 'i'}},
				{description: {$regex: query, $options: 'i'}},
				{control_number: {$regex: query, $options: 'i'}},
				{date_in: {$regex: query, $options: 'i'}},
				{amount: {$regex: query, $options: 'i'}},
			]});
		}else{
			Session.set('expenses_find', {});
		}
	},
	'keyup input#e_input': function(e,t){
		query = $("#e_input").val(); 
		if($('#e_input').val() !== ""){
			Session.set('expenses_find', {$or: [
				{item: {$regex: query, $options: 'i'}},
				{description: {$regex: query, $options: 'i'}},
				{control_number: {$regex: query, $options: 'i'}},
				{date_in: {$regex: query, $options: 'i'}},
				{amount: {$regex: query, $options: 'i'}},
			]});
		}else{
			Session.set('expenses_find', {});
		}
	}
});
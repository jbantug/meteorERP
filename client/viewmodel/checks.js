Session.set('editing_sale_check', false);
Session.set('scid', null);
Session.set('editing_purchase_check', false);
Session.set('pcid', null);
Session.set('checks_find', {});
Session.set('banks_find', {});
Session.set('bank_check', {});
Session.set('bank_specific', "");
Session.set('check_range', "");
Session.set('start_range', "");
Session.set('end_range', "");

Template.sale_checks.salechecklist = function(){
	return customer_checks.find(Session.get('checks_find'), {sort: {due_date: -1} } );
};

Template.sale_checks.events({
	'click .btnBounce': function(e,t){
		console.log(e.target.id);
		customer_checks.update({_id: e.target.id}, {$set: {date_bounced: moment().format("YYYY-MM-DD")} });
	},
	'click .btnEncash': function(e,t){
		customer_checks.update({_id: e.target.id}, {$set: {date_encashed: moment().format("YYYY-MM-DD")} });
	},
	'click .btnRevertBounce': function(e,t){
		console.log(e.target.id);
		customer_checks.update({_id: e.target.id}, {$set: {date_bounced: ""} });
	},
	'click .btnRevertEncash': function(e,t){
		customer_checks.update({_id: e.target.id}, {$set: {date_encashed: ""} });
	},
	'click .btnRemoveCheck': function (e,t){
		// console.log( e.target.id );
		Meteor.flush();
		customer_checks.remove({_id: e.target.id });
		
	},
	'click .btnEditCheck': function (e,t){
		Session.set('editing_sale_check', true);
		Session.set('scid', this._id);

		Meteor.flush();	
		$("form#addSaleChecks").show();
	}
});

Template.purchase_checks.purchasechecklist = function(){
	return supplier_checks.find(Session.get('checks_find'), {sort: {due_date: -1} } );
};

Template.purchase_checks.events({
	'click .btnBounce': function(e,t){
		console.log(e.target.id);
		supplier_checks.update({_id: e.target.id}, {$set: {date_bounced: moment().format("YYYY-MM-DD")} });
	},
	'click .btnEncash': function(e,t){
		supplier_checks.update({_id: e.target.id}, {$set: {date_encashed: moment().format("YYYY-MM-DD")} });
	},
	'click .btnRemoveCheck': function (e,t){
		// console.log( e.target.id );
		Meteor.flush();
		supplier_checks.remove({_id: e.target.id });
		
	},
	'click .btnEditCheck': function (e,t){
		Session.set('editing_purchase_check', true);
		Session.set('pcid', this._id);

		Meteor.flush();	
		$("form#addPurchaseChecks").show();
		
	}

});

Template.accounts_receivable.checks = function(){
	return customer_checks.find({}, {sort: {date_in: -1} } );
};

Template.sold_checks.checklist = function(){
	return customer_checks.find({}, {sort: {contact_person: 1} } );
};

Template.sale_checksform.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#addSaleChecks").serializeArray(),function(){
			form[this.name] = this.value;
		});
		form['amount'] = parseFloat(Math.round(form['amount']*100)/100).toFixed(2);
		form['date_in'] = moment().format("YYYY-MM-DD");
		form['month_in'] = moment().format("MMMM") ;
		form['year_in'] = moment().format("YYYY");
		form['month_due'] = moment(form['due_date']).format("MMMM") ;
		form['year_due'] = moment(form['due_date']).format("YYYY");
		form['date_encashed'] = "";
		form['date_bounced'] = "";
			customer_checks.insert( form, function(err){
				if(err){
					if(err.error === 403){
						alert("Only admins can add sale checks.")
					}else{
						alert("Something went wrong. Please try again.");
						console.log(err);
					}
					
				}
				else{
					$('#addSaleChecks')[0].reset();
				}
			});

		e.preventDefault();
	},
	'click #btnCancel': function(e,t){
		Session.set('editing_sale_check', false);
		Session.set('scid', null);

		$("form#addSaleChecks").hide();
		$('#addSaleChecks')[0].reset();
		// Meteor.flush();	
	},
	'click #btnUpdateSaleCheck': function (e,t){
		form = {};

		$.each( $("#addSaleChecks").serializeArray(),function(){
			form[this.name] = this.value;
		});

		customer_checks.update({_id: form['id']}, {$set: {control_number: form['control_number'], bank: form['bank'], branch: form['branch'], check_number: form['check_number'], amount: form['amount'], due_date: form['due_date'] } });
	}
});

Template.sale_checksform.editing_sale_check = function(){
	return Session.equals('editing_sale_check', true);
};

Template.sale_checksform.info = function(){
	if(Session.equals('scid', null)){
		return null;
	}
	else{
		var scid = Session.get('scid')
		var info = customer_checks.find( { _id: scid} );
		if(info){
			return info;
		}
		return info["name"] = "none selected";
	}

};

Template.purchase_checksform.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#addPurchaseChecks").serializeArray(),function(){
			form[this.name] = this.value;
		});
		form['amount'] = parseFloat(Math.round(form['amount']*100)/100).toFixed(2);
		form['date_in'] = moment().format("YYYY-MM-DD");
		form['month_in'] = moment().format("MMMM") ;
		form['year_in'] = moment().format("YYYY");
		form['month_due'] = moment(form['due_date']).format("MMMM") ;
		form['year_due'] = moment(form['due_date']).format("YYYY");
		form['date_encashed'] = "";
		form['date_bounced'] = "";

			supplier_checks.insert( form, function(err){
				if(err){
					if(err.error === 403){
						alert("Only admins can add checks.")
					}else{
						alert("Something went wrong. Please try again.");
						console.log(err);
					}
					
				}
				else{
					$('#addPurchaseChecks')[0].reset();
				}
			});

		e.preventDefault();
	},
	'click #btnCancel': function(e,t){
		Session.set('editing_sale_check', false);
		Session.set('scid', null);

		
		$("form#addPurchaseChecks").hide();
		$('#addPurchaseChecks')[0].reset();
		// Meteor.flush();	
	},
	'click #btnUpdatePurchaseCheck': function (e,t){
		form = {};

		$.each( $("#addPurchaseChecks").serializeArray(),function(){
			form[this.name] = this.value;
		});
		supplier_checks.update({_id: form['id']}, {$set: {control_number: form['control_number'], bank: form['bank'], branch: form['branch'], check_number: form['check_number'], amount: form['amount'], due_date: form['due_date'], description: form['description'] } });
	}
});

Template.purchase_checksform.editing_purchase_check = function(){
	return Session.equals('editing_purchase_check', true);
};

Template.purchase_checksform.info = function(){
	if(Session.equals('pcid', null)){
		return null;
	}
	else{
		var pcid = Session.get('pcid')
		var info = supplier_checks.find( { _id: pcid} );
		if(info){
			return info;
		}
		return info["name"] = "none selected";
	}
};

Template.search_checks.events({
	'keydown input#checksearch': function(e,t){
		query = $("#checksearch").val();
		if($('#checksearch').val() !== ""){
			Session.set('checks_find', {$or: [
				{due_date: {$regex: query, $options: 'i'}},
				{check_number: {$regex: query, $options: 'i'}},
				{control_number: {$regex: query, $options: 'i'}},
				{bank: {$regex: query, $options: 'i'}},
				{branch: {$regex: query, $options: 'i'}},
				{amount: {$regex: query, $options: 'i'}},
			]});
		}else{
			Session.set('checks_find', {});
		}
	},
	'keyup input#checksearch': function(e,t){
		query = $("#checksearch").val(); 
		if($('#checksearch').val() !== ""){
			Session.set('checks_find', {$or: [
				{due_date: {$regex: query, $options: 'i'}},
				{check_number: {$regex: query, $options: 'i'}},
				{control_number: {$regex: query, $options: 'i'}},
				{bank: {$regex: query, $options: 'i'}},
				{branch: {$regex: query, $options: 'i'}},
				{amount: {$regex: query, $options: 'i'}},
			]});
		}else{
			Session.set('checks_find', {});
		}
	}
});

Template.search_checks2.events({
	'keydown input#checksearch2': function(e,t){
		query = $("#checksearch2").val();
		if($('#checksearch2').val() !== ""){
			Session.set('checks_find', {$or: [
				{due_date: {$regex: query, $options: 'i'}},
				{check_number: {$regex: query, $options: 'i'}},
				{control_number: {$regex: query, $options: 'i'}},
				{bank: {$regex: query, $options: 'i'}},
				{branch: {$regex: query, $options: 'i'}},
				{amount: {$regex: query, $options: 'i'}},
			]});
		}else{
			Session.set('checks_find', {});
		}
	},
	'keyup input#checksearch2': function(e,t){
		query = $("#checksearch2").val(); 
		if($('#checksearch2').val() !== ""){
			Session.set('checks_find', {$or: [
				{due_date: {$regex: query, $options: 'i'}},
				{check_number: {$regex: query, $options: 'i'}},
				{control_number: {$regex: query, $options: 'i'}},
				{bank: {$regex: query, $options: 'i'}},
				{branch: {$regex: query, $options: 'i'}},
				{amount: {$regex: query, $options: 'i'}},
			]});
		}else{
			Session.set('checks_find', {});
		}
	}
});

Template.search_banks.events({
	'keydown input#banksearch': function(e,t){
		query = $("#banksearch").val();
		if($('#banksearch').val() !== ""){
			Session.set('banks_find', {$or: [
				{due_date: {$regex: query, $options: 'i'}},
				{check_number: {$regex: query, $options: 'i'}},
				{control_number: {$regex: query, $options: 'i'}},
				{bank: {$regex: query, $options: 'i'}},
				{branch: {$regex: query, $options: 'i'}},
				{amount: {$regex: query, $options: 'i'}},
			]});
		}else{
			Session.set('banks_find', {});
		}
	},
	'keyup input#checksbanksearchearch2': function(e,t){
		query = $("#banksearch").val(); 
		if($('#banksearch').val() !== ""){
			Session.set('banks_find', {$or: [
				{due_date: {$regex: query, $options: 'i'}},
				{check_number: {$regex: query, $options: 'i'}},
				{control_number: {$regex: query, $options: 'i'}},
				{bank: {$regex: query, $options: 'i'}},
				{branch: {$regex: query, $options: 'i'}},
				{amount: {$regex: query, $options: 'i'}},
			]});
		}else{
			Session.set('banks_find', {});
		}
	}
});

Template.bank_list.banks = function(){
	var myArray = supplier_checks.find(Session.get('banks_find')).fetch();
	myArray = myArray.concat(myArray, customer_checks.find(Session.get('banks_find')).fetch());
	var distinctArray = _.uniq(myArray, false, function(d) {return d.bank});
	return distinctArray;
};

Template.bank_list.events({
	'click .accordion-toggle': function(e,t){
		Session.set('bank_check',{bank: this.bank});
		Session.set('bank_specific', this.bank);
	},
	'change input#start_date' : function(e,t){
		Session.set('check_range', {$gte: $("#start_date").val(), $lte: $("#end_date").val()} );
		Session.set('start_range', $("#start_date").val());
	},
	'change input#end_date' : function(e,t){
		Session.set('check_range', {$gte: $("#start_date").val(), $lte: $("#end_date").val()} );
		Session.set('end_range', $("#end_date").val());
	}
});

Template.bank_list.cash_in = function(){
	var total_in = 0;
	var checks_in = customer_checks.find(Session.get('bank_check'));
	checks_in.forEach(function (checks){
		total_in += parseFloat(checks.amount);
	});
	return parseFloat(Math.round(total_in*100)/100).toFixed(2);
};

Template.bank_list.cash_out = function(){
	var total_out = 0;
	var checks_out = supplier_checks.find(Session.get('bank_check'));
	checks_out.forEach(function (checks){
		total_out += parseFloat(checks.amount);
	});
	return parseFloat(Math.round(total_out*100)/100).toFixed(2);
};

Template.bank_list.total = function(){
	var total_out = 0.00;
	var total_in = 0.00;
	var total = 0.00;
	var checks_out = supplier_checks.find(Session.get('bank_check'));
	var checks_in = customer_checks.find(Session.get('bank_check'));
	checks_out.forEach(function (checks){
		total_out += parseFloat(checks.amount);
	});
	checks_in.forEach(function (checks){
		total_in += parseFloat(checks.amount);
	});
	total = total_in - total_out;
	return parseFloat(Math.round(total*100)/100).toFixed(2);
}

Template.bank_list.months = function(){
	var myArray = supplier_checks.find(Session.get('bank_check')).fetch();
	myArray = myArray.concat(myArray, customer_checks.find(Session.get('bank_check')).fetch());
	var distinctArray = _.uniq(myArray, false, function(d) {return d.month_due});
	return distinctArray;
}

Template.bank_list.helpers({
	get_checks: function(bank,month){
		if(Session.get('check_range') === ""){
			var myArray = supplier_checks.find({bank: bank, month_due: month}).fetch();
			myArray = myArray.concat(myArray, customer_checks.find({bank: bank, month_due: month}).fetch());
		}else{
			var myArray = supplier_checks.find({bank: bank, month_due: month, due_date: {$gte: Session.get('start_range'), $lte: Session.get('end_range')}}).fetch();
			myArray = myArray.concat(myArray, customer_checks.find({bank: bank, month_due: month, due_date: {$gte: Session.get('start_range'), $lte: Session.get('end_range')}}).fetch());
		}
		return myArray;
	},
	get_monthly: function(){

	}
});
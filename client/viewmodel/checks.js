Session.set('editing_sale_check', false);
Session.set('scid', null);
Session.set('editing_purchase_check', false);
Session.set('pcid', null);
Session.set('checks_find', {});
Session.set('banks_find', {});
Session.set('bank_check', {});
Template.sale_checks.salechecklist = function(){
	return customer_checks.find(Session.get('checks_find'), {sort: {due_date: -1} } );
};

Template.purchase_checks.purchasechecklist = function(){
	return supplier_checks.find(Session.get('checks_find'), {sort: {due_date: -1} } );
};

Template.accounts_receivable.checks = function(){
	return customer_checks.find({}, {sort: {date_in: -1} } );
};

Template.sold_checks.checklist = function(){
	return customer_checks.find({}, {sort: {contact_person: 1} } );
};

Template.sale_checks.events({
	'click .btnBounce': function(e,t){
		console.log(e.target.id);
		customer_checks.update({_id: e.target.id}, {$set: {date_bounced: moment().format("YYYY-MM-DD")} });
	},
	'click .btnEncash': function(e,t){
		customer_checks.update({_id: e.target.id}, {$set: {date_encashed: moment().format("YYYY-MM-DD")} });
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

Template.sale_checksform.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#addSaleChecks").serializeArray(),function(){
			form[this.name] = this.value;
		});
			
		form['date_in'] = moment().format("YYYY-MM-DD");
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
			
		form['date_in'] = moment().format("YYYY-MM-DD");
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
		var total_out = 0;
		var total_in = 0;
		var total = 0;
		var checks_out = supplier_checks.find({bank: this.bank});
		var checks_in = customer_checks.find({bank: this.bank});
		checks_out.forEach(function (checks){
			total_out += parseFloat(checks.amount);
		});
		checks_in.forEach(function (checks){
			total_in += parseFloat(checks.amount);
		});
		total = total_in - total_out;
		Session.set('total_in',total_in);
		Session.set('total_out',total_out);
		Session.set('total',total);
	},
});

Template.bank_list.cash_in = function(){
	return Session.get('total_in');
};

Template.bank_list.cash_out = function(){
	return Session.get('total_out');
};

Template.bank_list.total = function(){
	return Session.get('total');
}
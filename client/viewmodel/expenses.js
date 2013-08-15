Session.set('editing_expense', false);
Session.set('xid', null);

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
	return expenses.find( {}, {sort: {date_in: -1} } );
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
			
		// form['date_in'] = Date.now();
		console.log(form);
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
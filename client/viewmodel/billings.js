Session.set('billings_find', {});
Session.set('bill_start', "");
Session.set('bill_end', "");

//billing_statement
Template.billing.events({
	"click #receipt-button": function(){
      var divToPrint = document.getElementById('printable');
      var newWin = window.open('','Print-Window','width=800,height=800,top=100,left=100');
      newWin.document.open();
      newWin.document.write('<html><head></head><body onload="window.print()">'+divToPrint.innerHTML+'</body><footer><div class="col-lg-4 billing-approved" style="float:left;"><p>Approved by:</p><p>______________________</p><p>Signature over printed name</p></div><div class="col-lg-4 billing-received" style="float:right;"><p>Received by:</p><p>______________________</p><p>Signature over printed name</p></div></footer></html>');
      newWin.document.close();
    }
});

Template.billing.customer = function(){	
	var to_return = null;
	if (Session.get('billing_customer')) {
		to_return = customers.findOne(Session.get('billing_customer'));
	}
	return to_return;
};

Template.billing.date = function(){
	return moment().format("MMMM DD YYYY");
};

Template.billing.to_pay = function(){
	var total_paid = 0;
	var total_payable = 0;
	var payments = customer_checks.find({customer: Session.get('customer'), date_encashed: {$ne: ""}});
	payments.forEach(function (checks){
		if(checks.date_encashed != null){
			total_paid += parseFloat(checks.amount);
		}
	});
	var payables = car_info.find(Session.get('billing_id'));
	payables.forEach(function (cars){
		total_payable += parseFloat(cars.selling_price);
	});
	var total = total_payable - total_paid;
	return parseFloat(total).toFixed(2);
}

Template.billings.payments = function(){
	var to_return = customer_checks.find(Session.get('billing_id'), {});
	return to_return;
}

Template.billings.helpers({
	get_car_list: function(){
		return car_info.find(Session.get('billing_id'), {});
	},
	get_paid: function(control_number){
		return customer_checks.find({control_number: control_number,customer_id: Session.get('customer', this._id),date_encashed: {$ne: ""}},{});
	},
	get_unpaid: function(control_number){
		return customer_checks.find({control_number: control_number,customer_id: Session.get('customer', this._id), date_encashed: ""},{});
	},
	get_paid_count: function(control_number){
		var flag = false;
		if(customer_checks.find({control_number: control_number,date_encashed: {$ne: ""}},{}).count() > 0){
			flag = true;
		}
		return flag;
	},
	get_unpaid_count: function(control_number){
		var flag = false;
		if(customer_checks.find({control_number: control_number,date_encashed: ""},{}).count() > 0){
			flag = true;
		}
		return flag;
	},
	get_check_count: function(control_number){
		var flag = false;
		if(customer_checks.find({control_number: control_number},{}).count() > 0){
			flag = true;
		}
		return flag;
	},
	get_unpaid_per_car: function(control_number){
		var total_paid = 0;
		var total_payable = 0;
		var payments = customer_checks.find({control_number: control_number, date_encashed: {$ne: ""}});
		payments.forEach(function (checks){
			if(checks.date_encashed != null){
				total_paid += parseFloat(checks.amount);
			}
		});
		var payables = car_info.find({control_number: control_number});
		payables.forEach(function (cars){
			total_payable += parseFloat(cars.selling_price);
		});
		var total = total_payable - total_paid;
		return parseFloat(total).toFixed(2);
	},
	check_payment: function(control_number){
		var flag = false;
		var total_paid = 0;
		var total_payable = 0;
		var payments = customer_checks.find({control_number: control_number, date_encashed: {$ne: ""}});
		payments.forEach(function (checks){
			if(checks.date_encashed != null){
				total_paid += parseFloat(checks.amount);
			}
		});
		var payables = car_info.find({control_number: control_number});
		payables.forEach(function (cars){
			total_payable += parseFloat(cars.selling_price);
		});
		var total = total_payable - total_paid;
		if(total === 0){
			flag = true;
		}
		return flag;
	}
});

Template.billing_item_list.helpers({
	get_car_list: function(){
		return car_info.find(Session.get('billing_id'), {});
	},
	get_payments: function(control_number){
		return customer_checks.find({control_number: control_number},{});
	},
	check_payment: function(control_number){
		var flag = false;
		var total_paid = 0;
		var total_payable = 0;
		var payments = customer_checks.find({control_number: control_number, date_encashed: {$ne: ""}});
		payments.forEach(function (checks){
			if(checks.date_encashed != null){
				total_paid += parseFloat(checks.amount);
			}
		});
		var payables = car_info.find({control_number: control_number});
		payables.forEach(function (cars){
			total_payable += parseFloat(cars.selling_price);
		});
		var total = total_payable - total_paid;
		if(total === 0){
			flag = true;
		}
		return flag;
	}
});

//sales invoice
Template.sales_invoice.events({
	"click #receipt-button": function(){
      var divToPrint = document.getElementById('printable2');
      var newWin = window.open('','Print-Window','width=800,height=800,top=100,left=100');
      newWin.document.open();
      newWin.document.write('<html><head></head><body onload="window.print()">'+divToPrint.innerHTML+'</body><footer><div class="col-lg-4 billing-approved" style="float:left;"><p>Approved by:</p><p>______________________</p><p>Signature over printed name</p></div><div class="col-lg-4 billing-received" style="float:right;"><p>Received by:</p><p>______________________</p><p>Signature over printed name</p></div></footer></html>');
      newWin.document.close();
    },
    'change input#start_date2' : function(e,t){
		Session.set('bill_start', $("#start_date2").val());
	},
	'change input#end_date2' : function(e,t){
		Session.set('bill_end', $("#end_date2").val());
	}
});

Template.sales_invoice.customer = function(){	
	var to_return = null;
	if (Session.get('billing_customer')) {
		to_return = customers.findOne(Session.get('billing_customer'));
	}
	return to_return;
};

Template.sales_invoice.date = function(){
	return moment().format("MMMM DD YYYY");
};

Template.invoices.payments = function(){
	var to_return = customer_checks.find(Session.get('billing_id'), {});
	return to_return;
}

Template.sales_invoice.to_pay = function(){
	var total_paid = 0;
	var total_payable = 0;
	var payments = customer_checks.find(Session.get('billing_id'));
	payments.forEach(function (checks){
		if(checks.date_encashed != null){
			total_paid += parseFloat(checks.amount);
		}
	});
	var payables = car_info.find(Session.get('billing_id'));
	payables.forEach(function (cars){
		total_payable += parseFloat(cars.selling_price);
	});
	var total = total_payable - total_paid;
	return parseFloat(total).toFixed(2);
}

Template.invoices.helpers({
	get_car_list: function(){
		return car_info.find(Session.get('billing_id'), {});
	},
	get_paid: function(control_number){
		var to_return = null;
		if(Session.get('bill_start') === "" || Session.get('bill_end') === ""){
			to_return = customer_checks.find({control_number: control_number,customer_id: Session.get('customer', this._id), date_encashed: {$ne: ""}},{});
		}else{
			to_return = customer_checks.find({control_number: control_number,customer_id: Session.get('customer', this._id), date_encashed: {$ne: ""},due_date: {$gte: Session.get('bill_start'), $lte: Session.get('bill_end')}},{});
		}
		return to_return;
	},
	get_unpaid: function(control_number){
		var to_return = null;
		if(Session.get('bill_start') === "" || Session.get('bill_end') === ""){
			to_return = customer_checks.find({control_number: control_number,customer_id: Session.get('customer', this._id), date_encashed: ""},{});
		}else{
			to_return = customer_checks.find({control_number: control_number,customer_id: Session.get('customer', this._id), date_encashed: "", due_date: {$gte: Session.get('bill_start'), $lte: Session.get('bill_end')}},{});
		}
		return to_return;
	},
	get_paid_count: function(control_number){
		var flag = false;
		if(Session.get('bill_start') === "" || Session.get('bill_end') === ""){
			if(customer_checks.find({control_number: control_number,date_encashed: {$ne: ""}},{}).count() > 0){
				flag = true;
			}
		}else{
			if(customer_checks.find({control_number: control_number,date_encashed: {$ne: ""}, due_date: {$gte: Session.get('bill_start'), $lte: Session.get('bill_end')}},{}).count() > 0){
				flag = true;
			}
		}
			
		return flag;
	},
	get_unpaid_count: function(control_number){
		var flag = false;
		if(Session.get('bill_start') === "" || Session.get('bill_end') === ""){
			if(customer_checks.find({control_number: control_number,date_encashed: ""},{}).count() > 0){
				flag = true;
			}
		}else{
			if(customer_checks.find({control_number: control_number,date_encashed: "", due_date: {$gte: Session.get('bill_start'), $lte: Session.get('bill_end')}},{}).count() > 0){
				flag = true;
			}
		}	
		return flag;
	},
	get_check_count: function(control_number){
		var flag = false;
		if(Session.get('bill_start') === ""|| Session.get('bill_end') === ""){
			if(customer_checks.find({control_number: control_number},{}).count() > 0){
				flag = true;
			}
		}else{
			if(customer_checks.find({control_number: control_number, due_date: {$gte: Session.get('bill_start'), $lte: Session.get('bill_end')}},{}).count() > 0){
				flag = true;
			}
		}
		return flag;
	}
});

//statement of accounts
Template.statement.events({
	"click #receipt-button": function(){
      var divToPrint = document.getElementById('printable3');
      var newWin = window.open('','Print-Window','width=800,height=800,top=100,left=100');
      newWin.document.open();
      newWin.document.write('<html><head></head><body onload="window.print()">'+divToPrint.innerHTML+'</body><footer><div class="col-lg-4 billing-approved" style="float:left;"><p>Approved by:</p><p>______________________</p><p>Signature over printed name</p></div><div class="col-lg-4 billing-received" style="float:right;"><p>Received by:</p><p>______________________</p><p>Signature over printed name</p></div></footer></html>');
      newWin.document.close();
    },
    'change input#start_date3' : function(e,t){
		Session.set('bill_start', $("#start_date3").val());
	},
	'change input#end_date3' : function(e,t){
		Session.set('bill_end', $("#end_date3").val());
	}
});

Template.statement.customer = function(){	
	var to_return = null;
	if (Session.get('billing_customer')) {
		to_return = customers.findOne(Session.get('billing_customer'));
	}
	return to_return;
};

Template.statement.date = function(){
	return moment().format("MMMM DD YYYY");
};

Template.statements.payments = function(){
	var to_return = customer_checks.find(Session.get('billing_id'), {});
	return to_return;
}

Template.statements.paid = function(){
	var to_return = customer_checks.find({customer_id: Session.get('customer', this._id), date_encashed: {$ne: ""}});
	return to_return;
}

Template.statements.unpaid = function(){
	var to_return = customer_checks.find({customer_id: Session.get('customer', this._id), date_encashed: ""});
	return to_return;
}

Template.statement.to_pay = function(){
	var total_paid = 0;
	var total_payable = 0;
	var payments = customer_checks.find(Session.get('billing_id'));
	payments.forEach(function (checks){
		if(checks.date_encashed != null){
			total_paid += parseFloat(checks.amount);
		}
	});
	var payables = car_info.find(Session.get('billing_id'));
	payables.forEach(function (cars){
		total_payable += parseFloat(cars.selling_price);
	});
	var total = total_payable - total_paid;
	return parseFloat(total).toFixed(2);
}

Template.statements.helpers({
	get_car_list: function(){
		return car_info.find(Session.get('billing_id'), {});
	},
	get_paid: function(control_number){
		var to_return = null;
		if(Session.get('bill_start') === "" || Session.get('bill_end') === ""){
			to_return = customer_checks.find({control_number: control_number,customer_id: Session.get('customer', this._id), date_encashed: {$ne: ""}},{});
		}else{
			to_return = customer_checks.find({control_number: control_number,customer_id: Session.get('customer', this._id), date_encashed: {$ne: ""},due_date: {$gte: Session.get('bill_start'), $lte: Session.get('bill_end')}},{});
		}
		return to_return;
	},
	get_unpaid: function(control_number){
		var to_return = null;
		if(Session.get('bill_start') === "" || Session.get('bill_end') === ""){
			to_return = customer_checks.find({control_number: control_number,customer_id: Session.get('customer', this._id), date_encashed: ""},{});
		}else{
			to_return = customer_checks.find({control_number: control_number,customer_id: Session.get('customer', this._id), date_encashed: "", due_date: {$gte: Session.get('bill_start'), $lte: Session.get('bill_end')}},{});
		}
		return to_return;
	},
	get_paid_count: function(control_number){
		var flag = false;
		if(Session.get('bill_start') === "" || Session.get('bill_end') === ""){
			if(customer_checks.find({control_number: control_number,date_encashed: {$ne: ""}},{}).count() > 0){
				flag = true;
			}
		}else{
			if(customer_checks.find({control_number: control_number,date_encashed: {$ne: ""}, due_date: {$gte: Session.get('bill_start'), $lte: Session.get('bill_end')}},{}).count() > 0){
				flag = true;
			}
		}
			
		return flag;
	},
	get_unpaid_count: function(control_number){
		var flag = false;
		if(Session.get('bill_start') === "" || Session.get('bill_end') === ""){
			if(customer_checks.find({control_number: control_number,date_encashed: ""},{}).count() > 0){
				flag = true;
			}
		}else{
			if(customer_checks.find({control_number: control_number,date_encashed: "", due_date: {$gte: Session.get('bill_start'), $lte: Session.get('bill_end')}},{}).count() > 0){
				flag = true;
			}
		}	
		return flag;
	},
	get_check_count: function(control_number){
		var flag = false;
		if(Session.get('bill_start') === ""|| Session.get('bill_end') === ""){
			if(customer_checks.find({control_number: control_number},{}).count() > 0){
				flag = true;
			}
		}else{
			if(customer_checks.find({control_number: control_number, due_date: {$gte: Session.get('bill_start'), $lte: Session.get('bill_end')}},{}).count() > 0){
				flag = true;
			}
		}
		return flag;
	}
});
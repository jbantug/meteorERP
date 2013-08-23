Session.set('billings_find', {});

Template.billing.events({
	"click #receipt-button": function(){
      var divToPrint = document.getElementById('print-receipt');
      var newWin = window.open('','Print-Window','width=800,height=800,top=100,left=100');
      newWin.document.open();
      newWin.document.write('<html><head></head><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>');
      newWin.document.close();
      setTimeout(function(){newWin.close();},10);
    }

});

Template.billing.customer = function(){	
	var to_return = null;
	if (Session.get('billing_customer')) {
		to_return = customers.findOne(Session.get('billing_customer')).contact_person;
	}
	return to_return;
};

Template.billing.date = function(){
	return moment().format("MMMM DD YYYY");
};

Template.billings.payments = function(){
	var to_return = customer_checks.find(Session.get('billing_id'), {});
	return to_return;
}

Template.billings.helpers({
	get_car_list: function(){
		return car_info.find(Session.get('billing_id'), {});
	},
	get_payments: function(control_number){
		return customer_checks.find({control_number: control_number},{});
	}
});

Template.sales_invoice.events({
	"click #receipt-button": function(){
      var divToPrint = document.getElementById('print-receipt2');
      var newWin = window.open('','Print-Window','width=800,height=800,top=100,left=100');
      newWin.document.open();
      newWin.document.write('<html><head></head><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>');
      newWin.document.close();
      setTimeout(function(){newWin.close();},10);
    }

});

Template.sales_invoice.customer = function(){	
	var to_return = null;
	if (Session.get('billing_customer')) {
		to_return = customers.findOne(Session.get('billing_customer')).contact_person;
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

Template.invoices.helpers({
	get_car_list: function(){
		return car_info.find(Session.get('billing_id'), {});
	},
	get_payments: function(control_number){
		return customer_checks.find({control_number: control_number},{});
	}
});
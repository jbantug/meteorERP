Template.sales_orders.cars_out = function(){
	return car_out.find( {}, {sort: {dateadded: -1} } );
};

Template.sales_order_form.events({
	'click #btnAddSO': function (e,t){
		form = {
			customer_id: $('#sale_customer').val(),
			sku: $('#so_item').val(),
			date_in: Date("yyyy-MM-DD HH:mm"),
			chassis_number: $('#so_chassis').val(),
			engine_number: $('#so_engine').val(),
			delivery_date: $('#so_delivery').val(),
			date_out: null,
			price: $('#so_price').val(),
			delivered: false
		};

		car_out.insert( form, function(err){
			if(err){
				if(err.error === 403){
					alert("Only admins can create new suppliers.")
				}else{
					alert("Something went wrong. Please try again.");
					console.log(err);
				}
				
			}
			else{
				$('#form_addSO')[0].reset();
			}
		});

		e.preventDefault();
	}

});
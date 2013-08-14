Template.customers.customers = function(){
	return customers.find( {}, {sort: {dateadded: -1} } );
}

Template.customer_form.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#form_addCustomer").serializeArray(),function(){
			form[this.name] = this.value;
		});

		form['dateadded'] = Date("yyyy-MM-DD HH:mm");

		customers.insert( form, function(err){
			if(err){
				if(err.error === 403){
					alert("Only admins can create new customers.")
				}else{
					alert("Something went wrong. Please try again.");
					console.log(err);
				}

			}
			else{
				$('#form_addCustomer')[0].reset();
			}
		});

		e.preventDefault();
	}
});
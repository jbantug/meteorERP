Template.suppliers.suppliers = function(){
	return suppliers.find( {}, {sort: {dateadded: -1} } );
};

Template.supplier_form.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#form_addSupplier").serializeArray(),function(){
			form[this.name] = this.value;
		});
			
		form['dateadded'] = Date("yyyy-MM-DD HH:mm");

		suppliers.insert( form, function(err){
			if(err){
				if(err.error === 403){
					alert("Only admins can create new suppliers.")
				}else{
					alert("Something went wrong. Please try again.");
					console.log(err);
				}
				
			}
			else{
				$('#form_addSupplier')[0].reset();
			}
		});

		e.preventDefault();
	}
});
Template.customers_table.info = function () {
	return customers.find({},{sort:{name: 1}});
};

Template.customers_list.info = function () {
	return customers.find({},{sort:{name: 1}});
};
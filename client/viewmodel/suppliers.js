Template.suppliers_table.info = function () {
	return suppliers.find({},{sort:{name: 1}});
};

Template.suppliers_list.info = function () {
	return suppliers.find({},{sort:{name: 1}});
};
LocalCollection.Cursor.prototype.distinct = function (key,random) {
  var self = this;

  if (self.db_objects === null)
    self.db_objects = self._getRawObjects(true);
  if (random)
    self.db_objects = _.shuffle(self.db_objects);
  if (self.reactive)
    self._depend({ordered: true,
                          added: true,
                          removed: true,
                          changed: true,
                          moved: true});
  var res = {};
  _.each(self.db_objects,function(value){

    if(!res[value[key]]){
        res[value[key]] = value;
    }
  });
  return _.values(res);
};

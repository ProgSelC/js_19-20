var skills = _(data)
    .map("skills")
    .flattenDeep()
    .uniq()
    .map(function(item){
      return _.toLower(item);
      })
    .sortBy()
    .value();

console.log("Sorted unique skills: ", skills);

var names = _(data)
  .sortBy(function(item){
    return item.friends.length;
  })
  .map("name")
  .value();

console.log("Names sorted by friends qty: ", names);

var friends = _(data)
  .map(function(item){
    return item.friends;
  })
  .flattenDeep()
  .map("name")
  .uniq()
  .value()

console.log("All users' friends unique: ", friends);

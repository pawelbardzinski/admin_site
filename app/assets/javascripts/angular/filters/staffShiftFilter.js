app.filter('selectFromSelected', [function() {
  return function(values, date, time) {
    if (values && $.isNumeric(date) && $.isNumeric(time)) {

      out = _.select(values, function(value) {
        if (value.get('dayOfTheWeek') == date && value.get('index') == time) {
          return value
        }
      })
      return out
    }
    // if (value) {
    //   for (x = 0; x < incItems.length; x++) {
    //     if (incItems[x].Value == value)
    //       out.push(incItems[x]);
    //   }
    //   return out;
    // }
    else {
      return values
    }
  };
}]);

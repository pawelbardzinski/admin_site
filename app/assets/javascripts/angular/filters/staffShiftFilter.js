app.filter('staffShiftFilter', [function() {
  return function(values, date, time) {
    if (values && $.isNumeric(date) && $.isNumeric(time)) {

      out = _.select(values, function(value) {
        if (value.get('dayOfTheWeek') == date) {
          return value
        }
      })
      return out
    } else {
      return values
    }
  };
}]);

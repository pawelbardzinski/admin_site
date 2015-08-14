app.filter('timestampToHHMMFilter', ['$filter', function($filter) {
  return function(arrayOfTimestamps) {
    if(arrayOfTimestamps){
      return _.map(arrayOfTimestamps, function(timestamp){   return $filter('date')(timestamp * 1000, 'HH:mm', 'GMT') })
    }else{
      return arrayOfTimestamps
    }
  };
}]);

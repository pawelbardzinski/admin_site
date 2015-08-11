angular.module('filters', [])
.filter('selectFromSelected', function () {
        return function (incItems, value) {
            var out = [{}];

            if(value){
                for(x=0; x<incItems.length; x++){
                    if(incItems[x].Value == value)
                        out.push(incItems[x]);
                }
                return out;
            }
            else if(!value){
                return incItems
            }
        };
    });

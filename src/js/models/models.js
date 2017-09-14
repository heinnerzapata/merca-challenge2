angular.module('helloWorldApp')
.service('models' , function(){
  return {
    markerModel : function (id,marker , selected , address , adddressFormated){
      this.id = id;
      this.marker = marker;
      this.selected = selected;
      this.address = address;
      this.adddressFormated = adddressFormated;
    },
    points : function(address1,address2){
      this.address1 = address1;
      this.address2 = address2;
      this.route = [];
      this.distance = 0.0;
    }
  }
});

angular.module('helloWorldApp')
.directive('ngFiles', ['$parse', function ($parse) {

            function fn_link(scope, element, attrs) {
                var onChange = $parse(attrs.ngFiles);
                element.on('change', function (event) {
                    onChange(scope, { $files: event.target.files });
                });
            };

            return {
                link: fn_link
            }
        } ])

.controller('HomeCtrl' , [
  '$scope', 'apiServices' , 'appConfig' , 'models' ,
  function($scope , apiServices , appConfig , models){

    $scope.message = 'heinner zapata';
    $scope.map;
    $scope.formdata = new FormData();
    $scope.bounds = new google.maps.LatLngBounds();
    $scope.markers = [];
    $scope.pointsDistance = new models.points('','');
    $scope.flightPath;
    $scope.flightPlanCoordinates = [];

    $scope.initMap = function() {

      var map_div = angular.element(document.querySelector('#map_div'));
      if(map_div.length){
        $scope.map = new google.maps.Map(document.getElementById('map_div'), {
           center: {lat: 4.60971, lng: -74.08175},
           zoom: 15
        });
      }
    }

    $scope.uploadFiles = function(){

      document.getElementById('loading').classList.remove('hidden');

      $scope.cleanMap();

      apiServices
            .uploadFiles($scope.formdata)
            .then(function(data){

                //for( i = 0; i < data.results.length; i++ ) {
                var image = {
                    url: "../images/star1.svg", // url
                    scaledSize: new google.maps.Size(50, 50), // scaled size
                    origin: new google.maps.Point(0,0), // origin
                    anchor: new google.maps.Point(0, 0) // anchor
                };

                var image2 = {
                    url: "../images/star1.svg", // url
                    scaledSize: new google.maps.Size(55, 55), // scaled size
                    origin: new google.maps.Point(0,0), // origin
                    anchor: new google.maps.Point(0, 0) // anchor
                };

                var image3 = {
                    url: "../images/star2.svg", // url
                    scaledSize: new google.maps.Size(55, 55), // scaled size
                    origin: new google.maps.Point(0,0), // origin
                    anchor: new google.maps.Point(0, 0) // anchor
                };



                data.data.results.forEach(function(resu , index){
                  console.log(resu)
                     var position = new google.maps.LatLng(resu.data.location.lat,resu.data.location.lng);
                     $scope.bounds.extend(position);
                     var marker = new google.maps.Marker({
                         position: position,
                         map: $scope.map,
                         animation: google.maps.Animation.DROP,
                         title: resu.data.formatted_address,
                         label: 'P' + (index + 1),
                         icon: image

                     });

                     $scope.markers.push(new models.markerModel(index + 1,marker,false,resu.data.location.lat + ',' + resu.data.location.lng , resu.data.formatted_address));

                     google.maps.event.addListener(marker, 'mouseover', function() {

                       var j;
                       var currentMarket = this;
                       var ismarker = false;
                       for(j = 0;j<$scope.markers.length;j++){
                         if( $scope.markers[j].selected == true && currentMarket.label[1] == $scope.markers[j].id ){
                           ismarker = true;
                           break;
                         }
                       }

                       if(!ismarker) marker.setIcon(image2);
                         else marker.setIcon(image3);

                      });

                      google.maps.event.addListener(marker, 'mouseout', function() {

                          var j;
                          var currentMarket = this;
                          var ismarker = false;
                          for(j = 0;j<$scope.markers.length;j++){
                            if( $scope.markers[j].selected == true && currentMarket.label[1] == $scope.markers[j].id ){
                              ismarker = true;
                              break;
                            }
                          }


                          if(!ismarker) marker.setIcon(image);
                          else marker.setIcon(image3);

                       });

                     // Allow each marker to have an info window


                     google.maps.event.addListener(marker, 'click', function() {

                       if($scope.pointsDistance.address1 == '' || $scope.pointsDistance.address2 == '') {

                        var j;
                        var currentMarket = this;
                        for(j = 0;j<$scope.markers.length;j++){
                          if( currentMarket.label[1] == $scope.markers[j].id){
                            $scope.markers[j].selected = !$scope.markers[j].selected;

                            if($scope.markers[j].selected) {

                              marker.setIcon(image3);
                            }
                            else{
                              marker.setIcon(image2);
                            }

                            if($scope.markers[j].selected){
                              if($scope.pointsDistance.address1 == '' && $scope.pointsDistance.address2 == '')
                                $scope.pointsDistance.address1 = $scope.markers[j].address;
                              else if($scope.pointsDistance.address1 != '' && $scope.pointsDistance.address2 == '' && $scope.pointsDistance.address1 != $scope.markers[j].address){
                                $scope.pointsDistance.address2 = $scope.markers[j].address;
                                $scope.getDistanceTwoPoints($scope.pointsDistance);
                              }
                            }
                            else{
/*
                              if($scope.pointsDistance.address1 != '' && $scope.pointsDistance.address2 != '')
                                $scope.pointsDistance.address2 = '';
                              else if($scope.pointsDistance.address1 != '' && $scope.pointsDistance.address2 == ''){
                                $scope.pointsDistance.address1 = '';
                              }
*/

                            }

                            break;
                          }
                        }

                      }

                     });

                     // Automatically center the map fitting all markers on the screen
                     $scope.map.fitBounds($scope.bounds);
                 });


                 document.getElementById('loading').classList.add('hidden');


            })
            .catch(function(err){
              console.log(err);
            })
    }

    $scope.getDistanceTwoPoints = function(point){

      document.getElementById('loading').classList.remove('hidden');

      apiServices
            .getDistanceTwoPoints(point.address1,point.address2)
            .then(function(data){


              $scope.pointsDistance.route = data.data.data.data.route;
              $scope.pointsDistance.distance = data.data.data.data.route.legs[0].distance.text;

              var i;
              for(i = 0;i<$scope.pointsDistance.route.legs[0].steps.length;i++){

                $scope.flightPlanCoordinates.push({ lat : $scope.pointsDistance.route.legs[0].steps[i].start_location.lat, lng : $scope.pointsDistance.route.legs[0].steps[i].start_location.lng });
                $scope.flightPlanCoordinates.push({ lat : $scope.pointsDistance.route.legs[0].steps[i].end_location.lat, lng : $scope.pointsDistance.route.legs[0].steps[i].end_location.lng });

              }

              $scope.flightPath = new google.maps.Polyline({
                path: $scope.flightPlanCoordinates,
                geodesic: true,
                strokeColor: '#1070FF',
                strokeOpacity: 1.0,
                strokeWeight: 4
              });


              $scope.flightPath.setMap($scope.map);

              document.getElementById('loading').classList.add('hidden');

            })
            .catch(function(err){

            })
    }

    $scope.getTheFiles = function ($files) {
                angular.forEach($files, function (value, key) {
                    $scope.formdata.append(key, value);
                });
    };

    $scope.cleanMap = function(){

      $scope.pointsDistance = new models.points('','');
      $scope.flightPlanCoordinates = [];
      if($scope.flightPath)
       $scope.flightPath.setMap(null);
      $scope.initMap();
      $scope.markers = [];

    }

    $scope.initMap();

    google.maps.event.addDomListener(window, 'load', $scope.initMap);

  }
]);

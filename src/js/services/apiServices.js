angular.module('helloWorldApp')
.service('apiServices' , function($http, $q , appConfig){

  return {
    geolocationByAddresss : geolocationByAddresss,
    uploadFiles : uploadFiles,
    getDistanceTwoPoints : getDistanceTwoPoints
  }

  function uploadFiles(data){
      console.log(data)
    var request = {
                    method: 'POST',
                    url: appConfig.api.uploadFiles,
                    data: data,
                    headers: {
                        'Content-Type': undefined
                    }
                };

    var defered = $q.defer();
    var promise = defered.promise;

        $http(request)
        .then(function (success){
          defered.resolve(success);
        },function (error){
          defered.reject(error);
        });

        return promise;

  }
  function geolocationByAddresss(address){
    //return data;

    var request = {
                    method: 'GET',
                    url: appConfig.api.geolocationByAddresss + '/' + address
                };

    var defered = $q.defer();
    var promise = defered.promise;

        $http(request)
              .then(function (success){
                defered.resolve(success);
              },function (error){
                defered.reject(error);
              });

        return promise;
        //return appConfig.api.geolocationByAddresss;
  }
  function getDistanceTwoPoints(address1,address2){
    var request = {
                    method: 'GET',
                    url: appConfig.api.getDistanceTwoPoints + '/' + address1 + '/' + address2                    
                };

    var defered = $q.defer();
    var promise = defered.promise;

          $http(request)
                .then(function (success){
                  defered.resolve(success);
                },function (error){
                  defered.reject(error);
                });

    return promise;

  }
});

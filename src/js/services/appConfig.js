angular.module('helloWorldApp')
.service('appConfig' , function(){
  return {
    api : {
      geolocationByAddresss : 'http://localhost:3002/api/geolocationByAddresss',
      //uploadFiles : 'http://localhost:3002/api/uploadFiles',
      //getDistanceTwoPoints : 'http://localhost:3002/api/getDistanceTwoPoints'
      uploadFiles : 'https://merca-challenge-api2.azurewebsites.net/api/uploadFiles',
      getDistanceTwoPoints : 'https://merca-challenge-api2.azurewebsites.net/api/getDistanceTwoPoints'
    }
  }
});

angular.module('starter.services', [])

  .factory('GestureLockService', [function () {
    return {
      getPassword: function () {
        return JSON.parse(window.localStorage.getItem('GestureLockPassword'));
      },
      setPassword: function (_password) {
        window.localStorage.setItem('GestureLockPassword', JSON.stringify(_password));
      }
    };
  }])


.factory('loginFactory', function($http) {
    return {
        login: function(user,time){
            $http({
                method:'POST',
                url:"http://localhost:8000/mock/Home/Save",
                params:{
                    "u":user.username,
                    "p":user.password
                }
            }).then(function(response) {
              console.log(time+":用"+user.username+":密"+user.password+":消息"+response.data.message);
                return response;});

        }
    };
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});

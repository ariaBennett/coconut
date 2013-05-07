//
// Collections
Clients = new Meteor.Collection("clients");

if (Meteor.isClient) {
  // Client Globals
  client = 0;
  // Templates
    Template.timeToday.get = function () {
      Deps.autorun( function () {
        if (Clients.findOne("default")) {
          date = new Date();
          client = Clients.findOne("default");
          dateString = (
            (date.getHours()).toString()
            + " " + (date.getMinutes()).toString()
            + " " + (date.getSeconds()).toString()
          );
          return "Beeees";
        }
      });
    }
Deps.autorun(function () {
  Template.timeToday.helpers({
    getTime: function () {
      return client.time;
    }
  });
});









  Meteor.startup(function () {
    // Execution sequence
    initClientVariables();
    startTimeUpdates();
    // End execution sequence

    function initClientVariables() {
      //serverTime = Meteor.call("getTimeCurrent");
    }
    function startTimeUpdates() {
      timeUpdateLoop = Meteor.setInterval(function () {
        client = Clients.findOne({account: "default"});





      }, 1000);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (!Clients.findOne({account: "default"})) {
      var currentTime = Date.now();
      Clients.insert({
        account: "default",
        time: currentTime 
      });
    }
    defaultUser = Clients.findOne({account: "default"});
    timeUpdateLoop = Meteor.setInterval(function () {
    // Time updating loop.
      var currentTime = Date.now();
      if (Clients.findOne({account: "default"})) {
        Clients.update({_id: defaultUser._id}, {$set: {time: currentTime}});
      }
    }, 1000);


  });
}

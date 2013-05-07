//
// Collections
Clients = new Meteor.Collection("clients");

if (Meteor.isClient) {

  // Client Globals
  Session.set("client", 0);
  Session.set("currentTime", 0);

  // Templates
  Template.timeToday.getTime = function () {
    return Session.get("currentTime");
  }

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
        Session.set("client", Clients.findOne({account: "default"}));
        Session.set("currentTime", Session.get("client").time);
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

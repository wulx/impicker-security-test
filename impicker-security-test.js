var EXPIRY = 12;

if (Meteor.isClient) {
  var API_KEY = "8PbzrhP9Tr2r6wPlSqzS";

  Template.hello.rendered = function () {
    impicker.load(API_KEY);
  };

  Template.hello.helpers({
    greeting: function () {
      return "Welcome to impicker-security-test.";
    },
    imgUrl: function () {
      return Session.get("imgUrl");
    }
  });

  Template.hello.events({
    "click input" : function (e) {

      Meteor.call("getUrl", function (error, result) {

        var count = 0;
        var intervalId = Meteor.setInterval(function () {
          console.log(++count + " sec.");

          if (count >= EXPIRY) {
            Session.set("imgUrl", "");

            Meteor.clearInterval(intervalId)
          }
        }, 1000);

        Session.set("imgUrl", result);

      }); 
    }
  });

}

if (Meteor.isServer) {
  var SECRET = "Z3IYZSH2UJA7VN3QYFVSVCF7PI"

  Meteor.methods({
    getUrl: function () {
      var inkUrl = "//www.filepicker.io/api/file/KW9EJhYtS6y48Whm2S6D",
          expiry = impicker.expiry(EXPIRY), // expiried in 12 seconds
          policy = {"handle": inkUrl.split("/").pop(), "expiry": expiry}, 
          securedUrl = impicker.secureUrl(inkUrl, policy, SECRET);
      
      return securedUrl;
    }
  });

}

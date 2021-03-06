var mysql = require('mysql')
var credentials = require('../../credentials.js');

var db_name = {
  development: "ryukyu_social_user_photos_service_dev",
  test: "ryukyu_social_user_photos_service_test",
  production: "ryukyu_social_user_photos_service"
}

var Patches = function() {

}

//Static Methods and Variables
Patches.db = "Yo!";

Patches.connect = function (env) {
  this.db = mysql.createConnection({
    host: credentials.mysql[env].host,
    user: credentials.mysql[env].username,
    password: credentials.mysql[env].password,
  });

  this.db.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
  });
}

Patches.disconnect = function () {
  this.db.end()
}

Patches.apply_patch = function(env, call_back) {
  Patches.connect(env);

  console.log("apply_patch called.");

  this.db.query('USE ' + db_name[env] + ';', function(err) {
    if(err) {
      console.log(err);
    }
  });

  this.db.query('ALTER TABLE user_photos ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;', function(err) {
    if(err) {
      console.log(err);
    } 
  }); 
 
  Patches.disconnect();

}

Patches.reverse_patch = function(call_back) {
  Patches.connect();

  Patches.disconnect();
}

module.exports = Patches;
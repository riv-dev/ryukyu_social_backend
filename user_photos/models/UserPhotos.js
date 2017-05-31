var mysql = require('mysql')
var credentials = require('../credentials.js');

//The UserPhotos model class
var UserPhotos = function (id, lastname, firstname, title) {

}

//Static Methods and Variables
UserPhotos.db = "Yo!";

UserPhotos.connect = function () {
  this.db = mysql.createConnection({
    host: credentials.mysql.host,
    user: credentials.mysql.username,
    password: credentials.mysql.password,
  });

  this.db.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
  });

  UserPhotos.initialize_db();
}

UserPhotos.disconnect = function () {
  this.db.end()
}

UserPhotos.initialize_db = function(call_back) {
  console.log("create_db called.");

  this.db.query('CREATE DATABASE IF NOT EXISTS ryukyu_social_user_photos_service;', function(err) {
    if(err) {
      console.log(err);
    }
  });

  this.db.query('USE ryukyu_social_user_photos_service;', function(err) {
    if(err) {
      console.log(err);
    }
  });

  this.db.query('CREATE TABLE IF NOT EXISTS user_photos (id int NOT NULL AUTO_INCREMENT, user_id int NOT NULL, lastname varchar(255), firstname varchar(255), caption varchar(255), filepath varchar(255), mimetype varchar(30), PRIMARY KEY(id));', function(err) {
    if(err) {
      console.log(err);
    } 
  });

}

UserPhotos.find_by_user_id = function (id, call_back) {
  console.log("find_by_user_id called.");
  this.db.query("SELECT * FROM user_photos WHERE user_id='"+id+"' LIMIT 1;", function (err, rows, fields) {
    call_back(err, rows, fields);
  });
}

UserPhotos.add = function(body, call_back) {
  console.log("add called.");
  //Only allow one photo
  this.db.query("INSERT into user_photos (user_id, lastname, firstname, caption, filepath, mimetype) values (?,?,?,?,?,?);", [body.user_id, body.lastname, body.firstname, body.caption, body.filepath, body.mimetype], function(err, rows, fields) {
    if(err) {
      console.log(err);
    }

    call_back(err, rows, fields);
  });
}

UserPhotos.update = function(user_id, body, call_back) {
  console.log("update called");

  var updateStringArray = [];
  var updateValuesArray = [];

  for (var property in body) {
      if (body.hasOwnProperty(property)) {
        updateStringArray.push(property + " = ?");
        updateValuesArray.push(body[property]);
      }
  }

  updateValuesArray.push(user_id);

  console.log(updateStringArray.join(", "));
  console.log(updateValuesArray.join(", "));
  console.log("UPDATE user_photos SET " + updateStringArray.join(", ") + " WHERE user_id = ?;");

  this.db.query("UPDATE user_photos SET " + updateStringArray.join(", ") + " WHERE user_id = ?;", updateValuesArray, function(err, rows, fields) {
    call_back(err, rows, fields);
  });  
}

UserPhotos.delete = function(user_id, call_back) {
  console.log("delete called");

  this.db.query("DELETE from user_photos WHERE user_id = ?;", [user_id], function(err, rows, fields) {
    call_back(err, rows, fields);
  });    
}

module.exports = UserPhotos;
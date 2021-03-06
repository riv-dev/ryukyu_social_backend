var mysql = require('mysql')
var credentials = require('../credentials.js');

//The ProjectUsers model class
var ProjectUsers = function (id, lastname, firstname, title) {

}

var db_name = {
  development: "ryukyu_social_projects_service_dev",
  test: "ryukyu_social_projects_service_test",
  production: "ryukyu_social_projects_service"
}

//Static Methods and Variables
ProjectUsers.db = "Yo!";

ProjectUsers.schema = {
  project_id: {type: "int", required: true},
  user_id: {type: "int", required: true},
  role: {type: "varchar(255)", required: false},
  status: {type: "varchar(255)", required: false, options: ["active", "inactive"]},
  write_access: {type: "int", required: false, options: [0,1,2]},
  user_pinned: {type: "boolean", required: false, default: false}
}

ProjectUsers.connect = function (env) {
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

  ProjectUsers.initialize_db(env);
}

ProjectUsers.disconnect = function () {
  this.db.end()
}

ProjectUsers.initialize_db = function(env, call_back) {
  console.log("create_db called.");

  this.db.query('CREATE DATABASE IF NOT EXISTS ' + db_name[env] + ';', function(err) {
    if(err) {
      console.log(err);
    }
  });

  this.db.query('USE ' + db_name[env] + ';', function(err) {
    if(err) {
      console.log(err);
    }
  });

  this.db.query('CREATE TABLE IF NOT EXISTS project_users (id int NOT NULL AUTO_INCREMENT, project_id int, user_id int, role varchar(255), status varchar(255), write_access int DEFAULT 1, user_pinned boolean DEFAULT FALSE, PRIMARY KEY(id));', function(err) {
    if(err) {
      console.log(err);
    } 
  });
}

ProjectUsers.find_all = function (call_back) {
  console.log("find_all called.");

  this.db.query('SELECT * FROM project_users;', function (err, results, fields) {
    call_back(err, results, fields);
  });
}

ProjectUsers.find_by_user_id = function (user_id, call_back) {
  console.log("find_by_id called.");

  this.db.query("SELECT * FROM project_users WHERE user_id = ?;", [user_id], function (err, results, fields) {
    call_back(err, results, fields);
  });
}

ProjectUsers.find_all_users_by_project_id = function(project_id, call_back) {
  console.log("find_by_id called.");

  this.db.query("SELECT user_id, role, status, write_access FROM project_users WHERE project_id = ?;", [project_id], function (err, results, fields) {
    call_back(err, results, fields);
  });  
}

ProjectUsers.find_by_project_id = function (project_id, call_back) {
  console.log("find_by_id called.");

  this.db.query("SELECT * FROM project_users WHERE project_id = ?;", [project_id], function (err, results, fields) {
    call_back(err, results, fields);
  });
}

ProjectUsers.find_project_user_pairing = function(project_id, user_id, call_back) {
  console.log("find_project_user_pairing called.");

  this.db.query("SELECT * FROM project_users WHERE project_id = ? AND user_id = ? LIMIT 1;", [project_id, user_id], function (err, results, fields) {
    call_back(err, results, fields);
  });
}

ProjectUsers.add = function(project_id, user_id, role, status, write_access, call_back) {
  console.log("add called.");
  this.db.query("INSERT into project_users (project_id, user_id, role, status, write_access) values (?,?,?,?,?);", [project_id, user_id, role, status, write_access], function(err, results, fields) {
    if(err) {
      console.log(err);
    }
    call_back(err, results, fields);
  });
}

ProjectUsers.update = function(project_id, user_id, body, call_back) {
  console.log("update called");

  var updateStringArray = [];
  var updateValuesArray = [];

  for (var property in body) {
      if (body.hasOwnProperty(property)) {
        updateStringArray.push(property + " = ?");
        updateValuesArray.push(body[property]);
      }
  }

  updateValuesArray.push(project_id);
  updateValuesArray.push(user_id);

  console.log(updateStringArray.join(", "));
  console.log(updateValuesArray.join(", "));

  this.db.query("UPDATE project_users SET " + updateStringArray.join(", ") + " WHERE project_id = ? AND user_id = ?;", updateValuesArray, function(err, results, fields) {
    call_back(err, results, fields);
  });  
}

ProjectUsers.delete = function(project_id, user_id, call_back) {
  console.log("delete called");

  this.db.query("DELETE from project_users WHERE project_id = ? AND user_id = ?;", [project_id, user_id], function(err, results, fields) {
    call_back(err, results, fields);
  });    
}

ProjectUsers.delete_all = function(project_id, call_back) {
  console.log("delete called");

  this.db.query("DELETE from project_users WHERE project_id = ?;", [project_id], function(err, results, fields) {
    call_back(err, results, fields);
  });
}

module.exports = ProjectUsers;
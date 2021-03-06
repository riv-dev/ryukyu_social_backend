var mysql = require('mysql')
var credentials = require('../credentials.js');

//The CodeCheckerProjects model class
var CodeCheckerProjects = function (id, lastname, firstname, title) {

}

var db_name = {
  development: "ryukyu_social_code_checker_projects_service_dev",
  test: "ryukyu_social_code_checker_projects_service_test",
  production: "ryukyu_social_code_checker_projects_service"
}

//Static Methods and Variables
CodeCheckerProjects.db = "Yo!";

CodeCheckerProjects.schema = {
  project_id: {type: "int"},
  source_code_server: {type: "varchar(255)"},
  development_server: {type: "varchar(255)"},
  dev_server_username: {type: "varchar(32)"},
  dev_server_password: {type: "varchar(32)"},
  last_checked: {type: "datetime"},
  last_check_status: {type: "varchar(32)"},
  last_check_message: {type: "text"},
  total_error_count: {type: "int"},
  w3c_error_count: {type: "int"},
  ryukyu_error_count: {type: "int"},
  w3c_warning_count: {type: "int"},
  ryukyu_warning_count: {type: "int"},
  achecker_warning_count: {type: "int"},
  total_warning_count: {type: "int"},
  ryukyu_checker: {type: "boolean"},
  w3c_checker: {type: "boolean"},
  a_checker: {type: "boolean"},
  source_username: {type: "varchar(255)"},
  source_password: {type: "varchar(255)"},
  check_sass: {type: "boolean"},
  check_html: {type: "boolean"}
}

CodeCheckerProjects.connect = function (env, call_back) {
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

  CodeCheckerProjects.initialize_db(env, call_back);
}

CodeCheckerProjects.disconnect = function () {
  this.db.end()
}

CodeCheckerProjects.initialize_db = function(env, call_back) {
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

  this.db.query('CREATE TABLE IF NOT EXISTS code_checker_projects (project_id int NOT NULL, source_code_server varchar(255), source_username varchar(255), source_password varchar(255), development_server varchar(255), dev_server_username varchar(32), dev_server_password varchar(32), last_checked datetime, last_check_status varchar(32), last_check_message text, total_error_count int , w3c_error_count int , ryukyu_error_count int , achecker_error_count int, w3c_warning_count int , ryukyu_warning_count int , achecker_warning_count int, total_warning_count int, ryukyu_checker BOOLEAN DEFAULT true, w3c_checker BOOLEAN DEFAULT true, a_checker BOOLEAN DEFAULT true, check_sass BOOLEAN DEFAULT true, check_html BOOLEAN DEFAULT true, PRIMARY KEY(project_id));', function(err) {
    if(err) {
      console.log(err);
    } 
    call_back();
  });

}

CodeCheckerProjects.find_all = function (query, call_back) {
  console.log("find_all called.");

  this.db.query('SELECT * FROM code_checker_projects;', function(err, results, fields) {
    call_back(err, results, fields);
  })
}

CodeCheckerProjects.find_by_project_id = function (project_id, call_back) {
  console.log("find_by_id called.");

  this.db.query("SELECT * FROM code_checker_projects WHERE project_id = ? LIMIT 1;", [project_id], function (err, results, fields) {
    call_back(err, results, fields);
  });
}

CodeCheckerProjects.add = function(body, call_back) {
  console.log("add called.");

  var addStringArray = [];
  var addMarksArray = [];
  var addValuesArray = [];

  for (var property in body) {
      if (body.hasOwnProperty(property) && body[property] != null) {
        addStringArray.push(property);
        addMarksArray.push("?");
        addValuesArray.push(body[property]);
      }
  }

  this.db.query("INSERT into code_checker_projects (" + addStringArray.join(", ") +") values ("+ addMarksArray.join(",")+");", addValuesArray, function(err, results, fields) {
    if(err) {
      console.log(err);
    }
    call_back(err, results, fields);
  });
}


CodeCheckerProjects.update = function(id, body, call_back) {
  console.log("update called");

  var updateStringArray = [];
  var updateValuesArray = [];

  for (var property in body) {
      if (body.hasOwnProperty(property) && body[property] != null) {
        updateStringArray.push(property + " = ?");
        updateValuesArray.push(body[property]);
      }
  }

  updateValuesArray.push(id);

  console.log(updateStringArray.join(", "));
  console.log(updateValuesArray.join(", "));

  this.db.query("UPDATE code_checker_projects SET " + updateStringArray.join(", ") + " WHERE project_id = ?;", updateValuesArray, function(err, results, fields) {
    call_back(err, results, fields);
  });  
}

CodeCheckerProjects.delete = function(id, call_back) {
  console.log("delete called");

  this.db.query("DELETE from code_checker_projects WHERE project_id = ?;", [id], function(err, results, fields) {
    call_back(err, results, fields);
  });    
}

module.exports = CodeCheckerProjects;
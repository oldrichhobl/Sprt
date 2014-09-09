/*
   Databáze  SQL  hkSQL pro DramSprt 2013-12-31
*/

  var hkSQL = {};
  hkSQL.webdb = {};
  hkSQL.webdb.db = null;
  hkSQL.webdb.status = -1;
//
//***********************************
  var dbName = "SprtHis";
  var dbVersion = "1.0";
  var dbDisplayName = "Databáze historie učení slovíček";
  var dbSize = 200000;
//
// konstanty 
  var typyAkce = {}; // typ akce
  
  var OpenPar = "";
                  
  var InsertParTodo = 'INSERT INTO TODO(todo, added_on) VALUES ("","")' ;
  var InsertParCinnost = 'INSERT INTO CINNOST ( id, idlec, idpart, casod, casdo) VALUES (35, 1, 2, datetime("now"), datetime("now") )';
  
  
  var SelectPar = "SELECT * FROM CINNOST";
  var SelectParTODO = "SELECT * FROM CINNOST";

  var DeletePar = "DELETE FROM CINNOST";
  
// 
// otevření databáze na začátku
hkSQL.webdb.open = function() {

	if (window.ActiveXObject) {
		// IE nema databazi
	        	return false;
	        }
	   try
	   {
		   hkSQL.webdb.db = window.openDatabase(dbName, dbVersion, dbDisplayName, dbSize);        
	   }
	   catch(err)
	   {
	       alert("Chyba OpenDB " + dbName + " : " +err.message);
	   } 
};

hkSQL.webdb.makeTrans = function(Par) {
  var db = hkSQL.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql(Par, []);
  });
};


function inithkSQL() {
  hkSQL.webdb.open();
  createTables();
  var ele = document.getElementById("lasterror");
  ele.innerHTML = "Databaze otevrena . ";

};

function createTables() {
  hkSQL.webdb.makeTrans("CREATE TABLE IF NOT EXISTS CINNOST (id INTEGER, idlec int, idpart int, casod, casdo,  PRIMARY KEY(id ASC));");
  hkSQL.webdb.makeTrans("CREATE TABLE IF NOT EXISTS LEKCE (id INTEGER, idlec int, idpart int, casod, casdo,   PRIMARY KEY(id ASC));");
  hkSQL.webdb.makeTrans("CREATE TABLE IF NOT EXISTS TODO (id INTEGER, druh int, casod, casdo, todotext,   PRIMARY KEY(id ASC));");
};

function dropTables() {
  hkSQL.webdb.makeTrans("DROP TABLE IF EXISTS CINNOST;");
  hkSQL.webdb.makeTrans("DROP TABLE IF EXISTS LEKCE;");
  hkSQL.webdb.makeTrans("DROP TABLE IF NOT EXISTS TODO;");
  $("#lasterror").html("Databaze Tables drop. ");
  // hkSQL.webdb.getAllTodoItems(loadTodoItems);
};



hkSQL.webdb.addTodo = function(todoText) {
	  var db = hkSQL.webdb.db;
	  db.transaction(function(tx){
	    var addedOn = new Date();
	    tx.executeSql(InsertPar,
	        [todoText, addedOn],
	        hkSQL.webdb.onSuccess,
	        hkSQL.webdb.onError);
	   });
	};

hkSQL.webdb.addPoslech = function(todoText) {
		  var db = hkSQL.webdb.db;
		  db.transaction(function(tx){
		    var addedOn = new Date();
		    tx.executeSql(InsertPar,
		        [],
		        null,
		        hkSQL.webdb.onError);
		   });
		};

hkSQL.webdb.onError = function(tx, e) {
  alert("There has been an error: " + e.message);
};

hkSQL.webdb.onSuccess = function(tx, r) {
  // re-render the data.
  hkSQL.webdb.getAllTodoItems(loadTodoItems);
};

//vypise seznam radku SQL do Alertu nebo jinam
hkSQL.webdb.getAllTodoItems = function(renderFunc) {
  var db = hkSQL.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql(SelectParTODO, [], renderFunc,
        hkSQL.webdb.onError);
  });
};
//vypise seznam radku SQL do Alertu nebo jinam
hkSQL.webdb.getAllItems = function(selectTx,renderFunc) {
  var db = hkSQL.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql(selectTx, [], renderFunc,
        hkSQL.webdb.onError);
  });
};


hkSQL.webdb.deleteAllItems = function() {
  var db = hkSQL.webdb.db;
  db.transaction(function(tx){
    tx.executeSql(DeletePar, [],
        hkSQL.webdb.onSuccess,
        hkSQL.webdb.onError);
    });
};


//**************************************************//

function loadTodoItems(tx, results) {
	var len = results.rows.length;
	console.log("CINNOST table: " + len + " rows found.");
	var s="RESULT:\n";
	for (var i=0; i<len; i++){
		s = s + "Row = " + i + " ID = " + results.rows.item(i).id + " idlec =  " + results.rows.item(i).idlec + 
		"casOD " + results.rows.item(i).casod + 
		"casDO " + results.rows.item(i).casdo + 
		
		"\n"
	};
	alert(s);	

}
function showTodoItems(tx, results) {
	var len = results.rows.length;
	console.log("CINNOST show: " + len + " rows found.");
	var s="<table> ";
	for (var i=0; i<len; i++){
		s = s + "<tr><td>" + results.rows.item(i).idlec + 
		"</td><td>"  + results.rows.item(i).casod + 
		"</td><td>"  + results.rows.item(i).casdo + 
		"</td></tr>"
	};
	s = s + "</table>" ;
	$("#idhistory").html(s);
}

function zobrazInIdhis(tx, results) {
   // alert("--transaction=" + tx + " --resultset=" + results);
 	var len = results.rows.length;
	console.log("ZOBRAZ show: " + len + " rows found.");
	var s="<table> ";
	for (var i=0; i<len; i++){
		s = s + "<tr><td>" + results.rows.item(i).id + 
		"</td><td>"  + results.rows.item(i).casod + 
		"</td><td>"  + results.rows.item(i).casdo + 
		"</td></tr>"
	};
	s = s + "</table>";
	$("#idhis").html(s);
}

function renderCinnostXX(tx, results) {
   // alert("--transaction=" + tx + " --resultset=" + results);
 	var len = results.rows.length;
	console.log("ZOBRAZ show: " + len + " rows found.");
	var s="<table> ";
	for (var i=0; i<len; i++){
		s = s + "<tr><td>" + results.rows.item(i).idlec + 
		"</td><td>"  + results.rows.item(i).casod + 
		"</td><td>"  + results.rows.item(i).casdo + 
		"</td></tr>"
	};
	s = s + "</table>" 
	alert(s); 
}




function renderTodo(row) {
  return "<li>" + row.todo  + " [<a href='javascript:void(0);'  onclick='hkSQL.webdb.deleteTodo(" + row.ID +");'>Delete</a>]</li>";
}
function addTodo() {
  var todo = document.getElementById("todo");
  hkSQL.webdb.addTodo(todo.value);
  todo.value = "";
}


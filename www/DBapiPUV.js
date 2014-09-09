/*
  API k databazi SQLite, která obsahuje slovíèka a výsledky

  historie:
    2014-06-24 OH: zalozeny prvni dve funkce otevriDB a dejNextSlovo
  
 */
 

var iGlobalRowId=0; // GJK hnusny podvos 2014.06.27. !!! ???


 
 
var Gjkdb = null; //this will become the sqlite database handle, global GJK001

var dbName = 'GJK0006DBs1';
var tableName = 'GJK0006TABs1';

var GlobalResult2 = {
    slovo: "sss1",
    word: ["sss2", "sss"],
    iPocet: 0,
    iRow: 0
};

// SELECT  rowId, w1, w2, p1, p2, a1, a2, MIN(c1), MIN(t1), st1  FROM GJK0006TABs1;

function GjkDebugPrintf(iSeverity, txt) {
    var date = new Date();
    var s, iColor = 'grey';
    var options = {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false
    };

    iSeverity = typeof iSeverity !== 'undefined' ? iSeverity : 0;

    if (iSeverity < 3) {
        iColor = 'lime';
    } else {
        if (iSeverity < 5) {
            iColor = 'orange';
        } else {
            if (iSeverity < 7) {
                iColor = 'magenta';
            }
            if (iSeverity < 11) {
                iColor = '#F75D59'; // red
            }
        }
    }

    // http://www.computerhope.com/htmcolor.htm
    s = '<font size="1" color="' + iColor + '">' + txt + '</font> ';
    s = s + '<font size="1" color="cyan">' + date.toLocaleDateString("en-GB-oed", options) + ' ' + date.toLocaleTimeString("en-GB-oed", options);
    '</font>';
    txt = s;
    app.log(txt);
}

function gjk001OpenDB() {
    var txt;

    if (Gjkdb === null) { // if Gjkdb 
        try {
            if (window.openDatabase) {
                Gjkdb = openDatabase(dbName, "1.0", "HTML5 Database API example", 200000);
                if (!Gjkdb)
                    alert("Error Failed to open the database, check version |" + dbName + "|");
                else {
                    txt = "GJK006.1056 after db = openDatabase(" + dbName + ")";
                    GjkDebugPrintf(0, txt);
                }
            } else
                alert("Error. Can\'t open the database \'" + dbName + "\'. Maybe your device have no HTML% DB support?");
        } catch (err) {
            alert("Catch ERROR. db= |" + dbName + "|, err=|" + err + "|");
        }
    }
}

function SplitAndSqlInsert(str) {
    var resultArray1 = [];

    resultArray1 = str.split(/\r?\n/);
    for (var p in resultArray1) {
        var rowId, w1, w2, p1, p2, a1, a2, c1, c2, st1, t1, t2;

        // for every line do  |0|and|und|prÃƒÆ’Ã¢â‚¬|Ã‚Â'ÃƒÆ’Ã¢â‚¬Â¹Ãƒâ€šÃ‚Âlk|http://1.mp3|http://2.mp4|3|0|7|7|conjunction|0.7316156|
		//                     1  2   3   4 == p1            5 == p2              6==a1        7==a2     8 9 0 1  12==v1      13==l1
        resultArray2 = resultArray1[p].split('|');
        rowId = resultArray2[1];
        w1 = resultArray2[2];
        w2 = resultArray2[3];
        p1 = resultArray2[4];
        p2 = resultArray2[5];
        a1 = resultArray2[6];
        a2 = resultArray2[7];
        c1 = resultArray2[8]; // count1, count good
        c2 = resultArray2[9]; // count2, count bad
        st1 = resultArray2[10]; // row type = 0..100 ordinary word
        t1 = resultArray2[11];  // last time good
        //t2 = resultArray2[12];  // last time bad
		v1 = resultArray2[12]; // word type
		
		if (v1) {v1=v1;} else {v1 ='';};
			
		l1 = resultArray2[13]; // word likelyhood 0.0 .. 0.9999, mam chybu na serveru?
		
        if (rowId) { // jen 'define' values
            t1 = 'INSERT INTO GJK0006TABs1(w1,w2,p1,p2,a1,a2,c1,c2,st1,v1,l1) VALUES("' + w1 + '","' + w2 + '","' + p1 + '","' + p2 + '","' + a1 + '","' + a2 + '",' + c1 + ',' + c2 + ',' + st1 + ',"' + v1 + '",' + l1 + ")";
            executeSql(t1);
            console.log("GJK 2014.06.27. 16:42, nactiDataReset sql=|" + t1 + '|');
        }
    }
}

function createTable(tableName) {
    var sql;

    //sql = "CREATE TABLE IF NOT EXISTS " + tableName + "(rowId INTEGER PRIMARY KEY AUTOINCREMENT, w1, w2, p1, p2, a1, a2 TEXT NOT NULL, c1 INTEGER DEFAULT 0, c2 INTEGER DEFAULT 0, st1 INTEGER DEFAULT 0, t1, t2 TIMESTAMP)";
    sql = "CREATE TABLE IF NOT EXISTS " + tableName + "(rowId INTEGER PRIMARY KEY AUTOINCREMENT, w1, w2, p1, p2, a1, a2 TEXT NOT NULL, c1 INTEGER DEFAULT 0, c2 INTEGER DEFAULT 0, st1 INTEGER DEFAULT 0, t1 IMESTAMP DEFAULT 0, t2 IMESTAMP DEFAULT 0, v1 TEXT NOT NULL DEFAULT'', l1 REAL DEFAULT 0.0, UNIQUE(w1, w2) ON CONFLICT IGNORE)";

	//CREATE TABLE IF NOT EXISTS GJK0006TABs1 (rowId INTEGER PRIMARY KEY AUTOINCREMENT, w1, w2, p1, p2, a1, a2 TEXT NOT NULL, c1 INTEGER DEFAULT 0, c2 INTEGER DEFAULT 0, st1 INTEGER DEFAULT 0, t1, t2 TIMESTAMP, UNIQUE(w1, w2) ON CONFLICT REPLACE);

	//CREATE TABLE a (i INT, j INT, UNIQUE(i, j) ON CONFLICT REPLACE);

    Gjkdb.transaction(function (tx) {
        tx.executeSql(sql, [], function (result) {
                GjkDebugPrintf(0, 'GJK0008.74001 OK sql=|' + sql + "|, result=|" + result + '|');
            },
            function (tx, error) {
                // on Apple OSX Safari, 'not authorized', MAX 5 MB!!. PRESS "PRIVATE" button on Safari
                GjkDebugPrintf(9, 'OLDA008.70066 Failed to create table = sql|' + sql + '|, error=' + error.message);
                Gjkdb = null;
                allert('Failed to create table = sql|' + sql + '|, in DB=|' + Gjkdb + '|, error=' + error.message + 'Using the Safari browser please turn Off the \"PRIVATE\" browsing feature and reload this page.');
                return;
            }

        )
    });
}

// Create the XHR object.
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    xhr.setRequestHeader("Content-type", "text/plain; charset=utf-8");
    myTimeout = 1000 * 6 * 1
    xhr.timeout = myTimeout; // 1 minute?
    xhr.ontimeout = function () {
        alert(" XHR Timed out!!!, url=|" + url + '|, myTimeout=' + myTimeout + '|');
    }

    return xhr;
}

function vypln3(slovo) // vratil GJK 2014.07.08.
	  
    // slovo je objekt obsahujici slova v obou jazycich
    {
      // alert("vypln " + slovo.slovo);

      /*
	  var s = '<div id="tabs-0" class="tab"> <div id="Word1"> ' +
       slovo.slovo +
       '</div> <div id="Word2"> '+
       slovo.word.toString()+
       '</div></div> ';
 */
 
      iGlobalRowId = slovo.rowId;  // GJK hnus 2014.06.27.

	  /*
      $("#slovo").html(s);
      $.ui.updateBadge("#slovo","cs","tl","green"); //Badge will appear on the top left
      $("#Word1").show();
      $("#Word2").hide();
      // canim('#slovo','animated flipInX',1000);
      showStatus(); 
	  */
      }
	  
function myWaitFunction() {
    console.log("GJK223 sleep 1.01 sec");
}
function t_h_i_s_setStatus(data) {
        this.nazev = "Book 003 lesson 004";   // doplnit z SQL !!!!
		//DBAPI.dbRow.iPocetSlovCelkem = 98;
		//iPocetLekciCelkem = 97;
		//iPocetKnihCelkem = 96;
    };
	
function executeSql(sql) {
    /*	
	db.transaction(function (tx) {
        tx.executeSql(q1, [], function (result) {
            alert('12SQL failed :|' + q1 + "|, result=" + result);
        })
    });
*/
    Gjkdb.transaction(function (tx) {
        tx.executeSql(sql, [], function (result) {
                //GjkDebugPrintf(0, 'GJK0006.84001 OLDA USPECH:|' + sql + "|, result" + result)
            },
            function (tx, error) {
                GjkDebugPrintf(0, 'OLDA006.80066 Failed = sql|' + sql + '|, error=' + error.message)
                return;
            }
        )
    });
}

	
	function selectOneValueFromTable9(t1, q1, clause, columnName, fvypln9) { // vysledek je vracen do funkce fvypln
        var s2, txt;
        var iMax = -1;
        //  vysledek volani pro funkci fvypln9(GlobalResult2)

        gjk001OpenDB();
        s2 = q1 + clause;
        txt = "GJK036.10166 before |" + s2 + "|";
        GjkDebugPrintf(9, txt);
        try {
            Gjkdb.transaction(function (tx) {
                // http://stackoverflow.com/questions/6780911/web-sql-transaction-returns-empty
                tx.executeSql(s2, [],
                    function (tx, rs) {
                        var result = '', iLastIndex=0;
                        for (var i = 0; i < rs.rows.length; i++) {
                            var row = rs.rows.item(i);
                            result[i] = {
                                value1: row[columnName]
                            };
							value2 = row[columnName];
							iLastIndex = i;
                        }
						GlobalResult2.iPocet = value2;
						DBAPI.dbRow.iPocetSlovCelkem = value2;
						console.log('GJK.2014.07.03..14:06 s2=|' + s2 + '|, columnName=|' + columnName + '|');
						console.log('GJK.2014.07.03..14:06 value2=|' + value2 + '|, columnName=|' + columnName + '|');
						alert("DB ingest finished OK. Ingested " + value2 + " words");
                        fvypln9(GlobalResult2);
                    },
                    function (tx, error) {
                        txt = "GJK0306.160107z ERROR  after |" + s2 + "|, iMax=" + iMax + "|, error=" + error.message;
                        GjkDebugPrintf(3, txt);
                        alert('GJK0306.160107 Failed sql=|' + s2 + "|, error=" + error.message);
                        //return;
                    });
                txt = "GJK0308.90002, sql=|" + s2 + "|";
                GjkDebugPrintf(77, txt);
            })
            txt = "GJK0308.90003, sql=|" + s2 + "|";
            GjkDebugPrintf(9, txt);
        } catch (err) {
            alert(" catch(err), table=|" + TableName + "|, sql=|" + s2 + "|, err=" + err + "|");
        }

        txt = "GJK0306.33333a selectFromTable8() OK? after |" + s2 + "|, iMax=" + iMax + "|" + ", GlobalResult2.slovo=|" + GlobalResult2.slovo + '|';
        GjkDebugPrintf(9, txt);
        return;
    }
	
    // ------------------  DBAPI  ------------------------------
    // ******  ruzne cesty na datovy soubor  *****************
path_android_asset_data = './data/';
path_dramatik = 'http://www.dramatik.cz/';
path_jarda = 'http://opesol.org/wwwSPRT/';

path_jarda = 'http://opesol.org/wwwSPRT/DATA/sf.php?fn=http://opesol.org/wwwSPRT/DATA/GS/w.666.ja.html&ln=19';
path_jarda = 'http://opesol.org/wwwSPRT/DATA/sf.php?fn=http://opesol.org/wwwSPRT/DATA/GS/w.666.ja.html&ln=1234'; // 'ln'=1, nacti jednu radku zs souboru 'fn'
path_jarda = 'http://opesol.org/wwwSPRT/DATA/sf.php?fn=http://opesol.org/wwwSPRT/DATA/GS/w.xy.html&ln=9'; // 'sf' send file, bez 'ln', nacti vsechny radky
path_jarda = 'http://opesol.org/wwwSPRT/DATA/sf.php?fn=http://opesol.org/wwwSPRT/DATA/GS/w.xy.html&ln=345'; // 'sf' send file, bez 'ln', nacti vsechny radky , 7891
path_extSdCard = 'file:///mnt/extSdCard/DramSprt/';
path_local = 'files:///local/data/DramSprt/';

var DBAPI = {
dbRow: {
	w1: "w1w1w1",         // anglicky = dotazovane slovo
	w2: ["w2.1", "w2.2"], // rusky = seznam moznych odpovedi
	n2: ["n2.1", "n2.2"], // verb 2.1, noun 2.2
	c2: [0.101, 0.102],   // pravdepodobnost 1, pravdepodobnost 2
	iPocetSlovCelkem: (-3),
	fromLang: "En2",
	toLang: "Fr2",
	nowLang: "En3",
	iRowId: 0, // cislo radky
	c1: 0, // likelyhood
	v1: '' // verb1
       },
	   
    index: 0,
    nazev: "Book 001 lesson 002",
    
    iPocetLekciCelkem: -4 ,
    iPocetKnihCelkem: -5,
	
result7: {
	myPole: [0.101, 0.102]
	},
	
// otevre a nacte databazi (resi i pripad, kdy databaze neni !!)
otevriDB: function () {
        var t1 = '',
            sl1 = '',
            clause = '';
        gjk001OpenDB();
        app.log("DBAPI.otevriDB ");
        createTable(tableName);
        //t1 = "INSERT INTO GJK0006TABs1(w1,w2,p1, p2, a1, a2) VALUES('kocka', 'cat', 'kocska', 'ket', 'brr1', 'brrrr2')";
        //executeSql(t1);

        //sql1 = ' rowId, w1, w2, p1, p2, a1, a2, MIN(c1), MIN(t1), st1 ';
        //sql1 = ' rowId, w1, w2, p1, p2, a1, a2, MIN(c1), st1 ';

        sql1 = 'SELECT COUNT(*) AS CurrentCount FROM '+ tableName +  ' WHERE st1 < 123' ; // 0..123 is a word in the row 
	selectOneValueFromTable9(tableName, sql1, '', 'CurrentCount', t_h_i_s_setStatus);
        GjkDebugPrintf(0, sql1);
        return;
    },
setStatus: function(data) {
        this.nazev = "Book 003 lesson 004";   // doplnit z SQL !!!!
		//DBAPI.dbRow.iPocetSlovCelkem = 98;
		//iPocetLekciCelkem = 97;
		//iPocetKnihCelkem = 96;
    },

znam: function () {
        var clause = '',
            sql1;
			
		console.log("DBAPI.znam");
		
		// novy global console.log(DBAPI.result7);
		
        /* this.index++;
		result.slovo = result.slovo + this.index;
		result.word[0] = result.word[0] + " index: " + this.index; */

        // GJK 2014.06.25 11:11
        //t1, q1, clause, arrayAllResults, myDiv, GlobalResult2) {
        console.log("660: GlobalResult2");
        console.log(GlobalResult2);
        iGlobalRowId = GlobalResult2.iRow;
        if (iGlobalRowId) {} else {
            iGlobalRowId = 1; // iGlobalRowId is undefined
        }
        // sql1 = "UPDATE GJK0006TABs1 SET c1=1, t1=(DATETIME('now')) WHERE rowId=0";
        // sql1 = "UPDATE " + tableName + " SET c1=0, t1=(DATETIME('now')) WHERE rowId=" + iGlobalRowId;

        sql1 = "UPDATE " + tableName + " SET t1=(DATETIME('now')), c1=1+(SELECT c1 AS c1 FROM " + tableName + " WHERE rowId=" + iGlobalRowId + ") WHERE rowId=" + iGlobalRowId;

        //sql1 = "UPDATE " + tableName + " SET c1=0, t1=(DATETIME('now')) WHERE w1='kocka'";
        //sql1 = ' * ';
        txt = "GJK008.00013 after  updateTable8(|" + sql1 + "|)";
        GjkDebugPrintf(0, txt);
        //this.updateTable8(tableName, sql1, clause, null);
		DBAPI.updateTable8(tableName, sql1, clause, vypln3);
        //************************************************************
        //console.log('011:' + sql1);
        app.log("DBAPI.znam konec");
    },

neznam: function ()
        // neznam posledni slovo
        {
            var clause = '',
                sql1;
				
			console.log("DBAPI.neznam");
			
            /* this.index++;
		result.slovo = result.slovo + this.index;
		result.word[0] = result.word[0] + " index: " + this.index; */

            // GJK 2014.06.25 11:11
            //t1, q1, clause, arrayAllResults, myDiv, GlobalResult2) {
            console.log("662: GlobalResult2");
            console.log(GlobalResult2);
            iGlobalRowId = GlobalResult2.iRow;
            if (iGlobalRowId) {} else {
                iGlobalRowId = 1; // iGlobalRowId is undefined
            }

            /*
		$str1  = "UPDATE mt_library_full_drives_and_slots 
		SET used_by_number_of_processes=(subquery.used_by_number_of_processes + 1) 
		FROM (SELECT used_by_number_of_processes FROM mt_library_full_drives_and_slots 
		WHERE mount_point='$strMountPoint' AND position_type=1 AND volume_tag_label='$strLabel') 
		AS subquery WHERE mount_point='$strMountPoint' AND position_type=1 AND volume_tag_label='$strLabel'";
*/

            sql1 = "UPDATE GJK0006TABs1 SET c1=1, t1=(DATETIME('now')) WHERE rowId=0";
            sql1 = "UPDATE " + tableName + " SET t2=(DATETIME('now')), c2=1+(SELECT c2 AS c2 FROM " + tableName + " WHERE rowId=" + iGlobalRowId + ") WHERE rowId=" + iGlobalRowId;
            //sql1 = "UPDATE " + tableName + " SET c1=0, t1=(DATETIME('now')) WHERE w1='kocka'";
            //sql1 = ' * ';
            txt = "GJK008.00013 after  updateTable8(|" + sql1 + "|)";
            GjkDebugPrintf(0, txt);
            //this.updateTable8(tableName, sql1, clause, null);
			DBAPI.updateTable8(tableName, sql1, clause, vypln3);
            //************************************************************
            //console.log('011:' + sql1);
            app.log("DBAPI.neznam ");
        },

nactiDataReset: function (path,filename)
        // nacte nova data ze serveru "path" a resetuje zobrazeni
        {
	var url = path + filename;
	//alert("nactiDataReset - " + url);  
  
	t1 = 'DROP TABLE IF EXISTS ' + tableName;  // znic starou tabulku semafor netreba
	executeSql(t1);
	
	createTable(tableName); // vytvor novou tabulku
				 
          $.ajax({
            type:"GET",
            url:url,
            success:this.ajaxOnLoad,
            error:function(data){alert("Ajax error = "+data)}
          });
        }, 
        
    // Response handlers.    
ajaxOnLoad: function (text) {
   	//alert("ajaxOnLoad : " + text);   
        var title = 'GJKgetTitle(text)';

        strGloblalText = text;
        console.log('GJK001: Response from CORS request to : ' + title);

        //document.write("<BR>|GJK.011:inde2.html, Oldo, toto nasaje stranku |" + url + '|<HR>|'+ strGloblalText + '|');
        //console.log('|' + strGloblalText + '|');

        resultArray1 = strGloblalText.split(/\r?\n/);

        notNow3 = 1;
        if (notNow3 == 0) {
            var iKolikCelkem = 0;

            console.log("GJK002.001 resultArray1.length=|" + resultArray1.length + '|');

            if (iKolikCelkem === 0) {
                preloz3('aaaaaaa'); // prvni kick?!
            }
            for (var p in resultArray1) {
                var rowId, w1, w2, p1, p2, a1, a2, c1, c2, st1, t1, t2;

                // for every line do
                resultArray2 = resultArray1[p].split('|');
                rowId = resultArray2[1];
                w1 = resultArray2[2];
                w2 = resultArray2[3];
                p1 = resultArray2[4];
                p2 = resultArray2[5];
                a1 = resultArray2[6];
                a2 = resultArray2[7];
                c1 = 0;
                c2 = 0;
                st1 = 0;
                t1 = 0;
                t2 = 0;

                if (rowId) { // jen 'define' values
                    t1 = 'INSERT INTO GJK0006TABs1(w1,w2,p1,p2,a1,a2,c1,c2,st1) VALUES("' + w1 + '","' + w2 + '","' + p1 + '","' + p2 + '","' + a1 + '","' + a2 + '",' + c1 + ',' + c2 + ',' + st1 + ")";
                    //executeSql(t1);
                    //console.log("GJK 2014.06.27. 16:42, nactiDataReset sql=|" + t1 + '|');
                    //if (w2 === w2 ) {
                    if ('GJKtext2' === w2) { // jeste nemam rozumne w2	    
                        if (iKolikCelkem < iMaxTranslate) {
                            // w1 is not not translated yet
                            //fruits[fruits.length] = "Lemon"; 
                            //indexesAskedFor[indexesAskedFor.length] = 0; // tim to definuji?
                            //indexesAskedFor[indexesAskedForTotal]['rowId']= rowId;

                            var iZ = indexesAskedForZ.length;

                            indexesAskedForZ[iZ] = w1;

                            //indexesAskedFor[indexesAskedFor.length]['w2'] = '';
                            /*
					console.log("0p=|" + p + "|, iKolikCelkem=|" + iKolikCelkem + '|, iZ=|' + iZ + '|, w1=|' 
					+ indexesAskedFor[iZ]
					+ '|, indexesAskedForTotal=|' + indexesAskedForTotal + '|, w2=|' + w2 + '|');
					*/
                            indexesAskedForTotal++;
                        }
                    }
                    iKolikCelkem++;
                    console.log("1p=|" + p + "|, iKolikCelkem=|" + iKolikCelkem + '|, w1=|' + w1 + '|, w2=|' + w2 + '|');
                }

                console.log("2p=|" + p + "|, iKolikCelkem=|" + iKolikCelkem + '|, w1=|' + w1 + '|, w2=|' + w2 + '|');
            }
        } else { // if (notNow3 == 0) {
            var strLongString = '', sql1='';
            strLongString = strGloblalText;
            //preloz3(indexesAskedForZ[0]);
            console.log("3p=|" + p + "|, iKolikCelkem=|" + iKolikCelkem + '|, w1=|' + w1 + '|, w2=|' + w2 + '|');
            //console.log(text);
            SplitAndSqlInsert(strLongString);

	    sql1 = 'SELECT COUNT(*) AS CurrentCount FROM '+ tableName +  ' WHERE st1 < 123' ; // 0..123 is a word in the row 
	    selectOneValueFromTable9(tableName, sql1, '', 'CurrentCount', t_h_i_s_setStatus);		// ted spocitej vsechny radky a zobraz to	
            return (strLongString);
        }
        console.log("4p=|" + p + "|, iKolikCelkem=|" + iKolikCelkem + '|, w1=|' + w1 + '|, w2=|' + w2 + '|');
        return (strOut);
    },

dejNextSlovo: function (fvypln) {
        app.log("DBAPI.dejNextSlovo ");
		console.log("DBAPI.dejNextSlovo ");
        //  
        var clause = '',
            sql1;

        /* this.index++;
		result.slovo = result.slovo + this.index;
		result.word[0] = result.word[0] + " index: " + this.index; */

        // GJK 2014.06.25 11:11
        //t1, q1, clause, arrayAllResults, myDiv, GlobalResult2) {
        //sql1 = ' rowId, w1, w2, p1, p2, a1, a2, MIN(c1), MIN(t1), st1 ';
        //sql1 = ' rowId, w1, w2, p1, p2, a1, a2, MIN(c1), st1 ';
        //sql1 = ' rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1 FROM ' + tableName + ' WHERE rowId !=  + iGlobalRowId + ' AND st1 < 101 ORDER BY c2 ASC, c1 ASC LIMIT 3';
        //sql1 = ' * ';
		
		Olda20140706 = 0;
		if (Olda20140706 == 1 ) {
		sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1 FROM ' 
		+ tableName + ' WHERE w1 IN ( SELECT DISTINCT w1 FROM ' + tableName + ' WHERE w1 = "castle" ORDER BY c2 ASC, c1 ASC LIMIT 3 )';
		}
		else {
		sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' 
		+ tableName + ' WHERE rowId <> '  + iGlobalRowId + ' AND w1 IN ( SELECT DISTINCT w1 FROM ' + tableName 
		+ ' WHERE st1 < 101 ORDER BY c2 ASC, c1 ASC LIMIT 10 )  order by c1 limit 9';
		}
		console.log(sql1);
		
        //sql1 = ' * ';
        txt = "GJK008.00013 after  selectFromTable8(|" + sql1 + "|)";
        GjkDebugPrintf(0, txt);
        this.selectFromTable8(tableName, sql1, clause, fvypln);
		
		if (Olda20140706 == 1 ) {
		 console.log(DBAPI.dbRow);
		}
        //************************************************************
        //console.log(sql1);
        return;
    },


selectFromTable8: function(t1, q1, clause, fvypln) { 
	// vysledek je vracen do funkce fvypln
        var s2, txt;
        var iMax = -1;

        gjk001OpenDB();
        s2 = "SELECT " + q1 + clause;
        txt = "GJK006.10166 before |" + s2 + "|";
        GjkDebugPrintf(9, txt);
        try {
            Gjkdb.transaction(function (tx) {
                // http://stackoverflow.com/questions/6780911/web-sql-transaction-returns-empty
                tx.executeSql(s2, [],
                    function (tx, rs) {
                        var result = [];
                        DBAPI.dbRow.w2.length = 0; // vyprazdnit seznam
                        for (var i = 0; i < rs.rows.length; i++) {
                            var row = rs.rows.item(i);
                            result[i] = {
			        			rowId: row['rowId'],
                                w1: row['w1'],
                                w2: row['w2'],
                                st1: row['st1'],
								l1: row['l1'],
								v1: row['v1']
                            };
                        
							iGlobalRowId = result[i].rowId; // GJK hnus
                            GlobalResult2.slovo = result[i].w1;
                            GlobalResult2.word[i] = result[i].w2;
                            GlobalResult2.iRow = result[i].rowId;
							
							DBAPI.dbRow.iRowId = row['rowId'];
							DBAPI.dbRow.w1 = row['w1'];
							DBAPI.dbRow.w2[i] = row['w2'];
							DBAPI.dbRow.n2[i] = row['n2'];
							DBAPI.dbRow.c2[i] = row['c2'];
							DBAPI.dbRow.l1 = row['l1'];  // likelyhood
							DBAPI.dbRow.v1 = row['v1'];	// verb1
							
                            GlobalResult2.iPocet = i;
                        }
						
						DBAPI.result7 = result;
						//DBAPI.dbRow.result7.pushd("w1=" + DBAPI.dbRow.w1);
						
                        console.log("001:" + s2);
                        console.log(result); // tohle pise OK na consoli 2014.06.25.  22:44
						console.log(DBAPI.result7); // tohle pise OK na consoli 2014.07.08.  14:04
						console.log(DBAPI.dbRow); // tohle pise OK na consoli 2014.07.08.  14:04
                        console.log(GlobalResult2); // tohle pise OK na consoli 2014.06.25.  22:44
                        
                        iGlobalRowId = GlobalResult2.rowId;  // Olda .
                        if (fvypln) fvypln(DBAPI.dbRow);
                    },
                    function (tx, error) {
                        txt = "GJK006.160107z ERROR  after |" + s2 + "|, iMax=" + iMax + "|, error=" + error.message;
                        GjkDebugPrintf(3, txt);
                        alert('GJK006.160107 Failed sql=|' + s2 + "|, error=" + error.message);
                        //return;
                    });
          
                txt = "GJK008.90002, sql=|" + s2 + "|";
                GjkDebugPrintf(77, txt);
            })
            txt = "GJK008.90003, sql=|" + s2 + "|";
            GjkDebugPrintf(9, txt);
        } catch (err) {
            alert(" catch(err), table=|" + TableName + "|, sql=|" + s2 + "|, err=" + err + "|");
        }

        txt = "GJK006.33333a selectFromTable8() OK? after |" + s2 + "|, iMax=" + iMax + "|" + ", GlobalResult2.slovo=|" + GlobalResult2.slovo + '|';
        GjkDebugPrintf(9, txt);
        return;
    },

updateTable8: function(t1, q1, clause, fvypln) {
    // vysledek je vracen do funkce fvypln pokud je definovana
    var s2, txt;
    var iMax = -1;
    gjk001OpenDB();
    s2 = q1;
    txt = "GJK009.10166 before |" + s2 + "|";
    GjkDebugPrintf(9, txt);
	console.log(txt);
	
    try {
        Gjkdb.transaction(function (tx) {
            // http://stackoverflow.com/questions/6780911/web-sql-transaction-returns-empty
            tx.executeSql(s2, [],
                function (tx, rs) {
                   if(fvypln) {
				   fvypln(DBAPI.dbRow);
				   txt = "GJK0003.2014.07.08..160117z after |" + s2 + "|, iMax=" + iMax + "|";
					console.log(txt);
				   }
				   else{
				   txt = "GJK0033.2014.07.08..160118z after |" + s2 + "|, iMax=" + iMax + "|";
					console.log(txt);
				   };
                },
                function (tx, error) {
                    txt = "GJK009.160107z ERROR  after |" + s2 + "|, iMax=" + iMax + "|, error=" + error.message;
                    GjkDebugPrintf(3, txt);
                    alert('GJK009.160107 Failed sql=|' + s2 + "|, error=" + error.message);
                    //return;
                });
            txt = "GJK009.90002, sql=|" + s2 + "|";
            GjkDebugPrintf(77, txt);
			console.log(txt);
        })
        txt = "GJK008.90003, sql=|" + s2 + "|";
        GjkDebugPrintf(9, txt);
		console.log(txt);
    } catch (err) {
        alert(" catch(err), table=|" + TableName + "|, sql=|" + s2 + "|, err=" + err + "|");
		console.log(txt);
    }

    txt = "GJK009.33333a selectFromTable8() OK? after |" + s2 + "|, iMax=" + iMax + "|" + ", GlobalResult2.slovo=|" + GlobalResult2.slovo + '|';
    GjkDebugPrintf(9, txt);
	console.log(txt);
    return;
},

kill: function () {
	alert("Not ymplemented yet ! kill");
},

audio: function () {
	alert("Not ymplemented yet ! audio");
},

reverse: function () {
	alert("Not ymplemented yet ! reverse");
}

};   // konec objektu DBAPI



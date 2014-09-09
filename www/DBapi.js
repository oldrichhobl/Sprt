/*
  API k databazi SQLite, která obsahuje slovíèka a výsledky

  historie:
    2014-06-24 OH: zalozeny prvni dve funkce otevriDB a dejNextSlovo
	2014.07.25. 16:55 chodi a nejaka slovicka hraje
 */
var iGlobalRowId = 0; // GJK hnusny podvod 2014.06.27. !!! ???

var Gjkdb = null; //this will become the sqlite database handle, global GJK001

var dbName = 'GJK0006DBs1';
var tableName = 'GJK0006TABs1';

var GlobalResult2 = {
    slovo: "sss1",
    word: ["sss2", "sss"],
    iPocet: 0,
    iRow: 0
};

var aGlobalFsRoot, fs_, iFileExist=0; // globals GJK, HTML5 File System  // iFileExist is fake to catch iFileExist--not defined nekde 2014.07.27.

// SELECT  rowId, w1, w2, p1, p2, a1, a2, MIN(c1), MIN(t1), st1  FROM GJK0006TABs1;

function vChangeTextOnButtonSynchronous(button_id) 
{
   var iPercent=0.0, sql1, el = document.getElementById(button_id);
   /*
   if (el.firstChild.data == "Lock") 
   {
       el.firstChild.data = "Unlock";
   }
   else 
   {
     el.firstChild.data = "Lock";
   }
   */
   DBAPI.dbRow.button_id = button_id;
   sql1 = 'SELECT COUNT(*) AS a1 FROM ' + tableName + ' WHERE a1 = 1'; // uz mam audio WAV file
   DBAPI.dbRow.toLang = selectOneValueFromTable10(tableName, sql1, '', 'a1', 'DBAPI.dbRow.iAudiosSyncedSoFar', vypln129);
   DBAPI.dbRow.iAudiosSyncedSoFar++;
   console.log(sql1);
   if (DBAPI.dbRow.iPocetSlovCelkem < 1) DBAPI.dbRow.iPocetSlovCelkem = 0.123; // deleni nulou
   iPercent = Math.round(100.0 * DBAPI.dbRow.iAudiosSyncedSoFar / DBAPI.dbRow.iPocetSlovCelkem);
   iPercent = iPercent || 0; // if iPercent == NaN then 0
   if (iPercent > 100) iPercent=100;
   el.firstChild.data = "Synchronizing all audio files4, " + iPercent + "% done. ("+DBAPI.dbRow.iPocetSlovCelkem+")";
   //console.log("vChangeTextOnButtonSynchronous(), radka 48, button_id=|"+button_id+"|, |"+iPercent+"%|, DBAPI.dbRow.iAudiosSyncedSoFar=|"+DBAPI.dbRow.iAudiosSyncedSoFar+"|");
   /*
   if (iPercent < 100)
   if (DBAPI.dbRow.iAudiosSyncedSoFar < DBAPI.dbRow.iPocetSlovCelkem){
	if (button_id){ 
		if (DBAPI.dbRow.iAudiosSyncedSoFar < 1)
		//setTimeout(vChangeTextOnButton(button_id), 92500); 
		else setTimeout(vChangeTextOnButton(button_id), 32500);
	} // zobrazeni % pokroku synhronizace audia, 0.250 sec 
   }
   */
   if (iPercent < 100) {
		console.log("vChangeTextOnButtonSynchronous, radka 60, sql1=|"+sql1+"|"); //call zzz
		// zzz DBAPI.synchronizeAudio(button_id);
	}
};

function vChangeTextOnButton2(button_id) 
{
   var iPercent=0.0, sql1, el = document.getElementById(button_id);

   sql1 = 'SELECT COUNT(*) AS CurrentCount FROM ' + tableName + ' WHERE st1 < 998'; // 0..1000 is a word in the row 
   selectOneValueFromTable9(tableName, sql1, '', 'CurrentCount', t_h_i_s_setStatus);

   console.log(sql1);
   el.firstChild.data = "Dictionary synchronization. Downloaded " + DBAPI.dbRow.iPocetSlovCelkem + " words.";
   console.log("vChangeTextOnButton(), line 45, button_id=|"+button_id+"|, |"+el.firstChild.data+"|");
   DBAPI.dbRow.iPocetSlovCelkemMax++;
   if (DBAPI.dbRow.iPocetSlovCelkemMax < 7) { // aby to moc nerekursovalo
   if (DBAPI.dbRow.iPocetSlovCelkemOld < DBAPI.dbRow.iPocetSlovCelkem){
	DBAPI.dbRow.iPocetSlovCelkemOld - DBAPI.dbRow.iPocetSlovCelkem;
	if (button_id){ 
		if ( DBAPI.dbRow.iPocetSlovCelkem < 1)
		setTimeout(vChangeTextOnButton2(button_id), 9250); 
		else setTimeout(vChangeTextOnButton2(button_id), 3250);
	} // zobrazeni % pokroku synhronizace audia, 0.250 sec 
	}
   }
};

function checkConnection() { // http://docs.phonegap.com/en/2.2.0/cordova_connection_connection.md.html
        var networkState, states = {};
		
		if(typeof navigator === 'undefined'){
			if(typeof navigator.connection === 'undefined'){
				if(typeof navigator.connection.type === 'undefined'){
					return null;
				}
				else 
				{
		networkState = navigator.connection.type;
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.NONE]     = 'No network connection';

        //alert('Connection type: ' + states[networkState]);
		console.log('checkConnection(), line 39, Connection type: ' + states[networkState]);
					return states;
				};
			return null;
			}
		return null;
		}
		else 
		return states;
		
};
	
function nulujKolikMluvi() {
    iGlobalRowId = DBAPI.dbRow.rowId;
    iGlobalRowId = 0;
    // pokracuj v mluveni za "undefined" word !!	

    if (DBAPI.dbRow.automaticaudio2 == 1) {

        DBAPI.dbRow.iKolikMluvi = 0;

        if (DBAPI.dbRow.iKolikMluvi > 1) return;
        nextAutomaticSlovo(); // mluv dal
    }
};

function nextAutomaticSlovo() {
    if (DBAPI.dbRow.iKolikMluvi > 2) return;

    if (DBAPI.dbRow.iKolikMluvi < 0) DBAPI.dbRow.iKolikMluvi = 0;
    if (DBAPI.dbRow.iKolikMluvi == 0) {
        iGlobalRowId = DBAPI.dbRow.rowId;
        iGlobalRowId = 0;
        //DBAPI.dejNextSlovo(this.vAuto11); // kkkk
        //setTimeout(DBAPI.dejNextSlovo(vypln), 3456);  // 3.456seconds
        DBAPI.dejNextSlovo(vypln);
    } else {
        if (DBAPI.dbRow.iKolikMluvi > 0) DBAPI.dbRow.iKolikMluvi--; // nemluv !!
        setTimeout(nulujKolikMluvi, 2567 * 2);
    };

};

function vMluv3() {
    var i = 1;

    if (DBAPI.dbRow.iUzMluvilo++ > 345) return;

    if (DBAPI.dbRow.iKolikMluvi > 2) return;
    vMluv(DBAPI.dbRow.toLang, DBAPI.dbRow.w2[0]);
    if (DBAPI.dbRow.iKolikMluvi > 0) i = 1 + DBAPI.dbRow.iKolikMluvi;
    setTimeout(nextAutomaticSlovo, 2567 * i); // schedule vMluv3 w2 za 2.345 seconds
    //alert("vMluv3 from=|" + DBAPI.dbRow.toLang + "|, w2=|" + DBAPI.dbRow.w2[0] + '|');
    DBAPI.dbRow.iKolikMluvi++;
};

function VeryBadSleep(delay) { // zere 1100% CPU
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
};

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

    return;

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

        // init CDV FS
        function init() {
            // window.requestFileSystem is recognized, so far so good.
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 5 * 1024 * 1024 /*5MB*/ , function(fileSystem) {
				fs_ = fs;
                //alert('success');
            }, function(e) {
                // 'e' is an object, {code: 'Class not found'}
                alert('Error accessing local file system');
            });
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
        t1 = resultArray2[11]; // last time good
        //t2 = resultArray2[12];  // last time bad
        v1 = resultArray2[12]; // word type

        if (v1) {
            v1 = v1;
        } else {
            v1 = '';
        };

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

    Gjkdb.transaction(function(tx) {
        tx.executeSql(sql, [], function(result) {
                GjkDebugPrintf(0, 'GJK0008.74001 OK sql=|' + sql + "|, result=|" + result + '|');
            },
            function(tx, error) {
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
    xhr.ontimeout = function() {
        alert(" XHR Timed out!!!, url=|" + url + '|, myTimeout=' + myTimeout + '|');
    }

    return xhr;
}

function vypln3(slovo) // vratil GJK 2014.07.08.

// slovo je objekt obsahujici slova v obou jazycich
{
    iGlobalRowId = slovo.rowId; // GJK hnus 2014.06.27. 

    // alert("vypln " + slovo.slovo);

    /*
	  var s = '<div id="tabs-0" class="tab"> <div id="Word1"> ' +
       slovo.slovo +
       '</div> <div id="Word2"> '+
       slovo.word.toString()+
       '</div></div> ';
 */



    /*
      $("#slovo").html(s);
      $.ui.updateBadge("#slovo","cs","tl","green"); //Badge will appear on the top left
      $("#Word1").show();
      $("#Word2").hide();
      // canim('#slovo','animated flipInX',1000);
      showStatus(); 
	  */
};

function vypln129() 
{
   console.log("vypln129(), radka 366, iPocetSynchronizedAudioSlovCelkem=|"+DBAPI.dbRow.iPocetSynchronizedAudioSlovCelkem+"|, iPocetSlovCelkem=|"+DBAPI.dbRow.iPocetSlovCelkem+"|");
   // next
   DBAPI.dbRow.iPocetSynchronizedAudioSlovCelkem++; // omezeni background Audio synchronizeAudio, pocet vsecH slo v DB * 2 (+32 safety?)  :-) 
   if (DBAPI.dbRow.iPocetSynchronizedAudioSlovCelkem < ((DBAPI.dbRow.iPocetSlovCelkem * 2) + 32)){ 
		//if (DBAPI.dbRow.iPocetSynchronizedAudioSlovCelkem < 32){ 
		// setTimeout(DBAPI.synchronizeAudio(DBAPI.dbRow.button_id), 123);
	DBAPI.synchronizeAudio(DBAPI.dbRow.button_id);
	console.log("vypln129(), radka 373, BYLO A TED OPET JE, DBAPI.synchronizeAudio(DBAPI.dbRow.button_id)");
   }
   else  console.log("vypln129(), radka 375, DBAPI.synchronizeAudio(DBAPI.dbRow.button_id);");;
};

function vypln10(val, variableName) { // vratil GJK 2014.07.08.
    window["variableName"] = val;
    //alert(window["variableName"]); // to mi nefunguje 
    DBAPI.dbRow.fromLang = val;
    DBAPI.dbRow.nowLang = DBAPI.dbRow.fromLang;
    //alert(DBAPI.dbRow.fromLang); // to mi nefunguje 
    return (val);
}

function vypln11(val, variableName) { // vratil GJK 2014.07.08.
    window["variableName"] = val;
    //alert(window["variableName"]); // to mi nefunguje 
    DBAPI.dbRow.toLang = val;
    //alert(DBAPI.dbRow.toLang); // to mi nefunguje 
    return (val);
}

function vypln212(val, variableName) { // vratil GJK 2014.07.08.
    //window["variableName"] = val;
    //alert(window["variableName"]); // to mi nefunguje 
    DBAPI.dbRow.iAudiosSyncedSoFar = val;
    //alert(DBAPI.dbRow.toLang); // to mi nefunguje 
    return (val);
}

function myWaitFunction() {
    console.log("GJK223 sleep 1.01 sec");
}

function t_h_i_s_setStatus(data, setValName) {
    this.nazev = "Book 003 lesson 004"; // doplnit z SQL !!!!
    //DBAPI.dbRow.iPocetSlovCelkem = 98;
    //iPocetLekciCelkem = 97;
    //iPocetKnihCelkem = 96;
    setValName = data;
    return (data); // je to ma SQL select callback()
};

function executeSql(sql) {
    /*	
	db.transaction(function (tx) {
        tx.executeSql(q1, [], function (result) {
            alert('12SQL failed :|' + q1 + "|, result=" + result);
        })
    });
*/
    Gjkdb.transaction(function(tx) {
        tx.executeSql(sql, [], function(result) {
                //GjkDebugPrintf(0, 'GJK0006.84001 OLDA USPECH:|' + sql + "|, result" + result)
            },
            function(tx, error) {
                GjkDebugPrintf(0, 'OLDA006.80066 Failed = sql|' + sql + '|, error=' + error.message)
                return;
            }
        )
    });
};

function vMluv129(lang, w2) {
    var snd, string, str2='', iFileSize = 0;

    //w2 = "retrieved";
    //lang = "en";

    if (w2) { // not undefined

        var path = 'DATA/AUDIO/',
            pathDir = '';

        path = path + lang + '/';
        pathDir = path;
        console.log("GJK, radka 446, vMluv129(lang, w2), lang=|" + lang + "|, w2=|" + w2 + "|, path=|" + path + "|");
        //vGJkCreateDirTree(fs_.root, path.split('/')); // check if exist !!!! fs.root is a DirectoryEntry.

        string = "http://opesol.org/wwwSPRT/DATA/PosliAudio.php?tl=" + lang + "&wo=" + w2 + "&so=1";
        url1 = string;

        strFileName = path + w2 + '.wav'; //filename 
        CDVstrFileName = 'cdvfile://localhost/persistent/path/to/downloads/' + strFileName;
		str2 = lang;
		str2 = str2 || '';
        if (str2.length  > 1) 
			cdvPrehraj129(CDVstrFileName, url1, 1); // language defined 
    }
	else {
	    console.log("GJK, radka 457, vMluv129(lang, w2), lang=|" + lang + "|, w2=|" + w2 + "|, path=|" + path + "|");
	}
};

function vMluv(lang, w2) {
    var snd, string, iFileSize = 0;

    if (DBAPI.dbRow.iUzMluvilo++ > 345) return;

    //w2 = "retrieved";
    //lang = "en";

    if (w2) { // not undefined

        var path = 'DATA/AUDIO/',
            pathDir = '';

        path = path + lang + '/';
        pathDir = path;
        console.log(" GJK 2014.07.16, vMluv(lang, w2) 331, lang=|" + lang + "|, w2=|" + w2 + "|, path=|" + path + "|");
        //vGJkCreateDirTree(fs_.root, path.split('/')); // check if exist !!!! fs.root is a DirectoryEntry.

        string = "http://opesol.org/wwwSPRT/DATA/PosliAudio.php?tl=" + lang + "&wo=" + w2 + "&so=1";
        url1 = string;

        strFileName = path + w2 + '.wav'; //filename 
        CDVstrFileName = 'cdvfile://localhost/persistent/path/to/downloads/' + strFileName;

        iFileSize = iGjkCheckFileSize(fs_, CDVstrFileName); // tam by to melo asynchrone hrat

        if (2 == 3) {
            GJKasync1 = 1;
            if (GJKasync1 == 3) {
                console.log("vMluv(), DBAPI.dbRow.toLang=|" + lang + '|, string=|' + string + "|");

                if (iFileSize == 0) {
                    var blob = new Blob(['Blbe Kecy'], {
                        type: 'audio/x-wav'
                    });

                    console.log(blob);
                    console.log("vMluv(), 345, DBAPI.dbRow.toLang=|" + lang + '|, string=|' + string + "|");

                    urlPath = string;
                    blob = DBAPI.nactiWave(string, DBAPI.dbRow.toLang, w2);

                    strFileName = path + w2 + '.wav'; //filename 

                    console.log("GJK vMluv(), 331");
                    vGJkWriteFile2(fs_, strFileName, blob); // zapis blob "string"
                };
            };

            if (iFileSize > 1024) {
                if (cordova == cordova) {
                    cdvPrehraj(CDVstrFileName, url1, 1);
                } else {
                    if (DBAPI.dbRow.iKolikMluvi == 0) {
                        //snd = new Audio(string); // buffers automatically when created
                        snd = new Audio(urlPath); // buffers automatically when created
                        console.log(snd);
                        snd.play();
                        DBAPI.dbRow.iKolikMluvi++;
                        console.log("after snd.play fn=|" + strFileName + "|, size=" + iFileSize + "|"); // was Alert
                    }; // if (jesteNeumimGJk == 3 ) {
                }
            };
        } // if( 2 == 3) {
        else {
            /*
			if (iFileSize > 1024) {
				console.log("vMluv(), 384,  fn=|" + CDVstrFileName + "|, size=" + iFileSize + "|"); 
				cdvPrehraj(CDVstrFileName);
			}
			else {
				console.log("vMluv(), 388,  fn=|" + CDVstrFileName + "|, size=" + iFileSize + "|"); 
				cdvDownloadFile(url1, CDVstrFileName); // + play
			}
			*/
            cdvPrehraj(CDVstrFileName, url1, 1);
        };
    }
};

function cdvPrehraj(file)
{
  console.log("cdvPrehraj(), radka 546, fn=|" + file + "|"); // was Alert
   
  url = file;
  // Play audio
  //
    // Play the audio file at url
    var my_media = new Media(url,
        // success callback
        function () {
            console.log("cdvPrehraj(), 415, Audio Success, fn="+url+"|"); 
        },
        // error callback
        function (err) {
            console.log("playAudio():Audio Error: " + err);
        }
    );
    // Play audio
	my_media.setVolume('1.0');
    my_media.play();

  //playFile(file);
  console.log("cdvPrehraj(), radka 567, fn=|" + file + "|"); // was Alert

};

function cdvPrehraj129(file, url1, iLast) {
    console.log("cdvPrehraj129(), radka 575, fn=|" + file + "|, last=|" + iLast + "|, url=|" + url1 + "|"); // was Alert

    url = file;
    // cache audio
    //
     if (iLast == 1) {
		console.log("cdvPrehraj129(), radka 581, fn=|" + file + "|, last=" + iLast + "|, url=" + url1 + "|");
		cdvDownloadFile129(url1, CDVstrFileName); // + play
    }
   
    // Play audio
    //my_media.setVolume('1.0');
    //my_media.play();

    //playFile(file);
    console.log("cdvPrehraj129(), setVolume(100%), radka 590, fn=|" + file + "|"); // was Alert

};


function cdvDownloadFile129(url, fileURL) {
    // !! Assumes variable fileURL contains a valid URL to a path on the device,
    //    for example, cdvfile://localhost/persistent/path/to/downloads/
    //                            = adresar v interni pameti:  //path/to/dovnloads/

	var iFileSize=0, fileURL2='';
	
	fileURL2 = fileURL.replace("cdvfile://localhost/persistent", "file:///storage/sdcard/path"); // blbe !!! harcoded stuff
	iFileSize = iGjkCheckFileSize77(fs_, fileURL2); // aaa
	console.log("cdvDownloadFile129(), radka 604, fileURL2=|"+fileURL2+"|, iFileSize="+iFileSize+"|");
	
	
    var fileTransfer = new FileTransfer();
    var uri = encodeURI(url);
    // fileURL = 'cdvfile://localhost/persistent/path/to/downloads/Hlas.mp3';

    if (iFileSize < 0) { //     file:///storage/sdcard/path/to/downloads/DATA/AUDIO/en/en.wav   fileURL=|cdvfile://localhost/persistent/path/to/downloads/DATA/AUDIO/en/retrieved.wav|
    fileTransfer.download(
        uri,
        fileURL,
        function(entry) {
            //console.log("cdvDownloadFile129(), fileTransfer.download(), 451, download complete: |" + entry.toURL() + "|, url=" + url + "|, fileURL="+fileURL+"|");
            console.log("cdvDownloadFile129(), fileTransfer.download(), radka 616,  download complete: |" + entry.toURL() + "|, url=|" + url + "|, fileURL=" + fileURL + "|, iFileExist=" + iFileExist + "|");

			//window.resolveLocalFileSystemURL("file:///example.txt", onSuccess, onError);
			if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) { callback(); }; //CORDOVA error https://supportforums.blackberry.com/t5/Web-and-WebWorks-Development/Cordova-3-4-File-plugin-1-0-1-resolveLocalFileSystemURL-for/td-p/2818304
}

window.resolveLocalFileSystemURL(entry.toURL(), gotFile779, function(e) {
                // 'e' is an object, {code: 'Class not found'}
                alert('cdvDownloadFile129(), OK, radka 621, entry.toURL()=|'+entry.toURL()+"|");  //errorHandler(e);
        });

			//alert("cdvDownloadFile129(), fileTransfer.download(), radka 624, download complete: |" + entry.toURL() + "|, url=" + url + "|, fileURL=" + fileURL + "|, iFileExist=" + iFileExist + "|");
            //cdvPrehraj(fileURL, url, 0); // 0 == uz nestahuj dalsi stejny soubor dvakrat (infinite cycle!!)
			//update SQL
        },
        function(error) {
            //•1 =  FileTransferError.FILE_NOT_FOUND_ERR  
            //•2 =  FileTransferError.INVALID_URL_ERR  
            //•3 =  FileTransferError.CONNECTION_ERR  
            //•4 =  FileTransferError.ABORT_ERR  
            //•5 =  FileTransferError.NOT_MODIFIED_ERR 

            console.log("cdvDownloadFile129("+url+", "+fileURL+"),"+ "download error source " + error.source);
            console.log("cdvDownloadFile129("+url+", "+fileURL+"),"+ "download error target " + error.target);
            console.log("cdvDownloadFile129("+url+", "+fileURL+"),"+ "download error code " + error.code);
        },
        false, {
            headers: {
                "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
            }
        }
    );
	} else {
		console.log("cdvDownloadFile129(), fileTransfer.download(), radka 635, download skiped: |" 
		+ entry.toURL() + "|, url=" + url + "|, fileURL=" + fileURL + "|, iFileExist=" + iFileExist + "|, iFileSize="+iFileSize+"|");
	}
};

function cdvDownloadFile(url, fileURL) {
    // !! Assumes variable fileURL contains a valid URL to a path on the device,
    //    for example, cdvfile://localhost/persistent/path/to/downloads/
    //                            = adresar v interni pameti:  //path/to/dovnloads/

    var fileTransfer = new FileTransfer();
    var uri = encodeURI(url);
    // fileURL = 'cdvfile://localhost/persistent/path/to/downloads/Hlas.mp3';

    fileTransfer.download(
        uri,
        fileURL,
        function(entry) {
            //console.log("cdvDownloadFile(), fileTransfer.download(), 451, download complete: |" + entry.toURL() + "|, url=" + url + "|, fileURL="+fileURL+"|");
            iFileExist = iCheckIfFileExists(fileURL)
            console.log("cdvDownloadFile(), fileTransfer.download(), 453, download complete: |" + entry.toURL() + "|, url=" + url + "|, fileURL=" + fileURL + "|, iFileExist=" + iFileExist + "|");

            cdvPrehraj(fileURL, url, 0); // 0 == uz nestahuj dalsi stejny soubor dvakrat (infinite cycle!!)
        },
        function(error) {
            //•1 =  FileTransferError.FILE_NOT_FOUND_ERR  
            //•2 =  FileTransferError.INVALID_URL_ERR  
            //•3 =  FileTransferError.CONNECTION_ERR  
            //•4 =  FileTransferError.ABORT_ERR  
            //•5 =  FileTransferError.NOT_MODIFIED_ERR 

            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("download error code " + error.code);
        },
        false, {
            headers: {
                "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
            }
        }
    );
};

function vMluv2(lang, w2) {
    var snd;

    if (DBAPI.dbRow.iUzMluvilo++ > 345) return;

    if (w2) { // not undefined
        if (DBAPI.dbRow.iKolikMluvi == 0) {
            string = "http://translate.google.com/translate_tts?tl=" + lang + "&q=Welcome%20to%20Flash%20cards.%20%20%20version%20 0.2.3 %20%20%20you%20have%20%20" + w2 + "%20%20words%20into%20your%20local%20database"; // buffers automatically when created
            console.log("vMluv2(), DBAPI.dbRow.toLang=|" + lang + '|, string=|' + string + "|");
            //snd = new Audio(string); // buffers automatically when created
            //snd.play();
            DBAPI.dbRow.iKolikMluvi++;
        }
    };
};

function selectOneValueFromTable9(t1, q1, clause, columnName, fvypln9) { // vysledek je vracen do funkce fvypln
    var s2, txt;
    var iMax = -1;
    //  vysledek volani pro funkci fvypln9(GlobalResult2)

    gjk001OpenDB();
    s2 = q1 + clause;
    txt = "GJK036.10166 before |" + s2 + "|";
    GjkDebugPrintf(9, txt);
    try {
        Gjkdb.transaction(function(tx) {
            // http://stackoverflow.com/questions/6780911/web-sql-transaction-returns-empty
            tx.executeSql(s2, [],
                function(tx, rs) {
                    var result = '',
                        iLastIndex = 0,
                        snd;
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
                    //vMluv2(DBAPI.dbRow.fromLang, value2);
                    vMluv2('en', value2);
                    if (value2 < 1) {
                        alert("DB ingest finished OK. Ingested " + value2 + ' words. For an empty database please go to "SETUP" and select source of your Lesson data (eg. "from http://www.opesol.org".');
                    } else {
                        alert("Download finished OK with " + value2 + " words");
                    }
                    fvypln9(GlobalResult2);
                },
                function(tx, error) {
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

    txt = "GJK0306.33333a selectFromTable13() OK? after |" + s2 + "|, iMax=" + iMax + "|" + ", GlobalResult2.slovo=|" + GlobalResult2.slovo + '|';
    GjkDebugPrintf(9, txt);
    return;
}

function selectOneValueFromTable10(t1, q1, clause, columnName, setValName, fvypln10) { // vysledek je vracen do funkce fvypln
    var s2, txt;
    var iMax = -1,
        returnValue = '';
    //  vysledek volani pro funkci fvypln10(GlobalResult2)

    gjk001OpenDB();
    s2 = q1 + clause;
    txt = "GJK036.10166..2014.07.09. before |" + s2 + "|";
    GjkDebugPrintf(9, txt);
    try {
        Gjkdb.transaction(function(tx) {
            // http://stackoverflow.com/questions/6780911/web-sql-transaction-returns-empty
            tx.executeSql(s2, [],
                function(tx, rs) {
                    var result = '',
                        iLastIndex = 0;
                    for (var i = 0; i < rs.rows.length; i++) {
                        var row = rs.rows.item(i);
                        result[i] = {
                            value1: row[columnName]
                        };
                        returnValue = row[columnName];
                        iLastIndex = i;
                    }

                    console.log("DBapi.js, radka 761, selectOneValueFromTable10, returnValue=|" + returnValue + '|, columnName=|' + columnName + '|');
                    fvypln10(returnValue, setValName);
                },
                function(tx, error) {
                    txt = "GJK0306.160107z.2014.07.09.  ERROR  after |" + s2 + "|, iMax=" + iMax + "|, error=" + error.message;
                    GjkDebugPrintf(3, txt);
                    alert('GJK0306.160107.2014.07.09.  Failed sql=|' + s2 + "|, error=" + error.message);
                    //return;
                });
            txt = "GJK0308.90002.2014.07.09. , sql=|" + s2 + "|";
            GjkDebugPrintf(77, txt);
        })
        txt = "GJK0308.90003.2014.07.09. , sql=|" + s2 + "|";
        GjkDebugPrintf(9, txt);
    } catch (err) {
        alert(" catch(err), table=|" + TableName + "|, sql=|" + s2 + "|, err=" + err + "|");
    }

    txt = "GJK0306.33333a.2014.07.09.  selectFromTable13() OK? after |" + s2 + "|, iMax=" + iMax + "|" + ", GlobalResult2.slovo=|" + GlobalResult2.slovo + '|';
    GjkDebugPrintf(9, txt);
    //console.log("2 selectOneValueFromTable10, radka 790, returnValue=|" + returnValue + '|, columnName=|' + columnName + '|, s2='+s2+"|");
    return (returnValue);
}

// ------------------  DBAPI  ------------------------------
// ******  ruzne cesty na datovy soubor  *****************
path_android_asset_data = './data/';
path_dramatik = 'http://www.dramatik.cz/';
path_jarda = 'http://opesol.org/wwwSPRT/';

path_jarda = 'http://opesol.org/wwwSPRT/DATA/sf.php?fn=http://opesol.org/wwwSPRT/DATA/DB/w.666.ja.html&ln=19';
path_jarda = 'http://opesol.org/wwwSPRT/DATA/sf.php?fn=http://opesol.org/wwwSPRT/DATA/DB/w.666.ja.html&ln=3454'; // 'ln'=1, nacti jednu radku zs souboru 'fn'
path_jarda = 'http://opesol.org/wwwSPRT/DATA/sf.php?fn=http://opesol.org/wwwSPRT/DATA/DB/w.xy.html&ln=9'; // 'sf' send file, bez 'ln', nacti vsechny radky
path_jarda = 'http://opesol.org/wwwSPRT/DATA/sf.php?fn=http://opesol.org/wwwSPRT/DATA/DB/w.xy.html&ln=19876'; // 'sf' send file, bez 'ln', nacti vsechny radky , 7891
path_extSdCard = 'file:///mnt/extSdCard/DramSprt/';
path_local = 'files:///local/data/DramSprt/';

var DBAPI = {
    dbRow: {
        w1: "start", // anglicky = dotazovane slovo
        w2: ["start", "w2.2"], // rusky = seznam moznych odpovedi
        n2: ["n2.1", "n2.2"], // verb 2.1, noun 2.2
        c2: [0.101, 0.102], // pravdepodobnost 1, pravdepodobnost 2
        iPocetSlovCelkem: (-3),
		iPocetSlovCelkemOld: (-4), // pro zastaveni zobrazovani stavu nacitani DB
		iPocetSlovCelkemMax: 0,
		iPocetSynchronizedAudioSlovCelkem: (-3),
		iAudiosSyncedSoFar: (-1),
        fromLang: "En2",
        toLang: "Fr2",
        nowLang: "En3",
		button_id: null, // last clicked button ID in index.html
        iRowId: 0, // cislo radky
        c1: 0, // likelyhood
        v1: '', // verb1
        iDirection: 0, // 0 == zleva do prava, 1 == z prava do leva
        iOtoc: 0, // jeste jsme neotocili sedive okenko
        automaticaudio2: 0,
        plusaudio2: 0,
        onlyaudio2: 0,
        iKolikMluvi: 0,
        iUzMluvilo: 0,
		
        selectFromTable129_iRowId: 0,
        selectFromTable129_w1: 0,
        selectFromTable129_w2: ["start", "w2.2"], 
        selectFromTable129_n2: ["n2.1", "n2.2"],
        selectFromTable129_c2: [0.101, 0.102], 
        selectFromTable129_l1: 0,
        selectFromTable129_v1: 0,
		selectFromTable129_a1: 0,
		selectFromTable129_a2: 0		
    },

    index: 0,
    nazev: "Book 001 lesson 002",

    iPocetLekciCelkem: -4,
    iPocetKnihCelkem: -5,

	selectFromTable129_result7: {
        myPole: [0.101, 0.102]
    },
    result7: {
        myPole: [0.101, 0.102]
    },

    // otevre a nacte databazi (resi i pripad, kdy databaze neni !!)
    otevriDB: function() {
        var t1 = '',
            sl1 = '',
            clause = '';
        gjk001OpenDB();

        // openFS(this); // open local sandbox File System on client 
        // openFS2();  -- vyhodil OH 2014-09-09 file system neni treba otvirat - cordova asi vse zajisti
        //                a cteni i zapis funguji bez explicitního volani requestfilesystem ???
        // open local sandbox File System on client 
        // var fs2; 
        // onInitFs2(aGlobalFsRoot); //Uncaught TypeError: undefined is not a function 
        //openFS('<button onclick="openFS(this)">Open filesystem</button>');

        app.log("DBAPI.otevriDB ");
        console.log("DBAPI.otevriDB ");
        createTable(tableName);
        //t1 = "INSERT INTO GJK0006TABs1(w1,w2,p1, p2, a1, a2) VALUES('kocka', 'cat', 'kocska', 'ket', 'brr1', 'brrrr2')";
        //executeSql(t1);

        //sql1 = ' rowId, w1, w2, p1, p2, a1, a2, MIN(c1), MIN(t1), st1 ';
        //sql1 = ' rowId, w1, w2, p1, p2, a1, a2, MIN(c1), st1 ';

        sql1 = 'SELECT COUNT(*) AS CurrentCount FROM ' + tableName + ' WHERE st1 < 998'; // 0..1000 is a word in the row 
        selectOneValueFromTable9(tableName, sql1, '', 'CurrentCount', t_h_i_s_setStatus);

        sql1 = 'SELECT w1 AS w1 FROM ' + tableName + ' WHERE st1 = 4002'; // najdi zJazyka
        DBAPI.dbRow.fromLang = selectOneValueFromTable10(tableName, sql1, '', 'w1', 'DBAPI.dbRow.fromLang', vypln10); // t_h_i_s_setStatus
        console.log(sql1);

        sql1 = 'SELECT w2 AS w2 FROM ' + tableName + ' WHERE st1 = 4002'; // najdi doJazyka
        DBAPI.dbRow.toLang = selectOneValueFromTable10(tableName, sql1, '', 'w2', 'DBAPI.dbRow.toLang', vypln11);
        console.log(sql1);

        DBAPI.dbRow.nowLang = DBAPI.dbRow.fromLang;

        sql1 = "4 DBAPI.dbRow.fromLang =|" + DBAPI.dbRow.fromLang + "|, DBAPI.dbRow.toLang=|" + DBAPI.dbRow.toLang + "|, DBAPI.dbRow.nowLang=|" + DBAPI.dbRow.nowLang + "|";
        console.log(sql1);
        //alert(sql1); 

        GjkDebugPrintf(0, sql1);

        return;
    },
    setStatus: function(data) {
        this.nazev = "Book 003 lesson 004"; // doplnit z SQL !!!!
        //DBAPI.dbRow.iPocetSlovCelkem = 98;
        //iPocetLekciCelkem = 97;
        //iPocetKnihCelkem = 96;
    },

    znam: function() {
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

    neznam: function()
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


    nactiWave: function(path, dirName, fileName) {
        // nacte nova Wave data ze serveru "path" 
        var url = path;

        console.log("nactiWave(), 665,  data start., dirName=|" + dirName + "|, fn=|" + fileName + "|");
        //alert("nactiDataReset - " + url);   		 
        var apiKey = 'AIzaSyBUXBfmtyai20OuRDSTn4uTAZF8549wJkE';
        //url = url + '&key=' + apiKey;
        //url = 'http://opesol.org/wwwSPRT/index.html';
        //url    = 'https://www.googleapis.com/language/translate/v2?key=' . $apiKey . '&q=' . rawurlencode($text) . '&source=en&target=fr';
        url = path;

        $.ajax({
            //crossDomain: true,
            type: "GET",
            //contentType: 'audio/x-wav',
            //dataType: 'jsonp',
            //origin: 'http://translate.google.com/',  // snazim se sidt strycka Google 
            //async:false,
            //withCredentials: true,
            error: function(jqxhr) {
                console.log(jqxhr);
                console.log("Je to CHYBA???, Ajax 2 error = |" + jqxhr.responseText + '|' + url);
                //$("#register_area").text(jqxhr.responseText); // @text = response error, it is will be errors: 324, 500, 404 or anythings else
            },
            url: url,
            //header: "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-GB; rv:1.8.1.6) Gecko/20070725 Firefox/2.0.0.6",  

            // OLDA2014.07.13 , sizeni strycka Google,  Je to CHYBA???, Ajax 2 Proc to nema zadny kod chyby?
            //beforeSend: "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-GB; rv:1.8.1.6) Gecko/20070725 Firefox/2.0.0.6",
            //beforeSend: "ja jsem blbec",
            success: this.ajaxOnLoad2
        });
    },
    // Response handlers.    
    ajaxOnLoad2: function(WaveData) {
        //alert("ajaxOnLoad : " + text);   
        console.log("nactiWave ajaxOnLoad2 data done.");
        console.log("nactiWave ajaxOnLoad2 data end.");
        return (WaveData);
        //return;
    }, // nacti Wave

	synchronizeAudio: function(clicked_id)  //clicked_id
		{ var sql1='';
			console.log("synchronizeAudio(), radka 1042, clicked_id=|" + clicked_id +"|"); 
			vChangeTextOnButtonSynchronous(clicked_id); // zobrazeni % pokroku synhronizace audia 
			checkConnection();
      if(typeof navigator === 'undefined'){
			if(typeof navigator.connection === 'undefined'){
				if(typeof navigator.connection.type === 'undefined'){
					return null;
				}
				else 
				{
				if(navigator.network.connection.type == Connection.NONE){
					alert("No Internet Connection!?"); return null;
				}
				else {
			if(navigator.network.connection.type == Connection.WIFI
			|| navigator.network.connection.type == Connection.ETHERNET
			|| navigator.network.connection.type == Connection.CELL_2G
			|| navigator.network.connection.type == Connection.CELL_3G
			|| navigator.network.connection.type == Connection.CELL_4G ){ 
			}
			else {
				alert("No Internet WiFi Connection!?"); return null;
			}; //alert("yescon");
		if (clicked_id){
			//setTimeout(vChangeTextOnButton(clicked_id), 1123); // zobrazeni % pokroku synhronizace audia 
		};
		iRandom = Math.round(Math.random() + 1); // 1..iPocetSlovCelkem // abychom zamezili cyklum, budeme vybirat nahodnou radku
		if (iRandom == 1) // we don't have audio1 
		sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE a1 <> 1 LIMIT 1';
		else // we don't have audio2
		sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE a2 <> 1 LIMIT 1';
		
        console.log("synchronizeAudio(), radka 1032, sql1=|"+sql1+"|");
		clause = '';
        this.selectFromTable129(tableName, sql1, clause, vypln129);
			} // else 
			}
			}
		} // if(typeof navigator === 'undefined'){ 
		else {
			// just to test in CHROME
			clause = '';
			sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE a2 <> 1 LIMIT 1';
			this.selectFromTable129(tableName, sql1, clause, vypln129);
		};
		DBAPI.dbRow.iAudiosSyncedSoFar = DBAPI.dbRow.iPocetSlovCelkem;
		// zzz vypln129() vola async synchronizeAudio(),  setTimeout(DBAPI.synchronizeAudio(DBAPI.dbRow.button_id), 123);
		},
		
    nactiDataReset: function(path, filename)
        // nacte nova data ze serveru "path" a resetuje zobrazeni
        {
            var url = path + filename;
            //alert("nactiDataReset - " + url);  

            t1 = 'DROP TABLE IF EXISTS ' + tableName; // znic starou tabulku semafor netreba
            executeSql(t1);

            createTable(tableName); // vytvor novou tabulku

            $.ajax({
                type: "GET",
                url: url,
                success: this.ajaxOnLoad,
                error: function(data) {
                    alert("Ajax 1 error = " + data)
                }
            });
        },

    // Response handlers.    
    ajaxOnLoad: function(text) {
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
            var strLongString = '',
                sql1 = '';
            strLongString = strGloblalText;
            //preloz3(indexesAskedForZ[0]);
            console.log("3p=|" + p + "|, iKolikCelkem=|" + iKolikCelkem + '|, w1=|' + w1 + '|, w2=|' + w2 + '|');
            //console.log(text);
            SplitAndSqlInsert(strLongString);

            sql1 = 'SELECT COUNT(*) AS CurrentCount FROM ' + tableName + ' WHERE st1 < 997'; // 0..1000 is a word in the row 
            selectOneValueFromTable9(tableName, sql1, '', 'CurrentCount', t_h_i_s_setStatus); // ted spocitej vsechny radky a zobraz to	


            sql1 = 'SELECT w1 AS w1 FROM ' + tableName + ' WHERE st1 = 4002'; // najdi zJazyka
            console.log(sql1);
            DBAPI.dbRow.fromLang = selectOneValueFromTable10(tableName, sql1, '', 'w1', 'DBAPI.dbRow.fromLang', vypln10);

            sql1 = 'SELECT w2 AS w2 FROM ' + tableName + ' WHERE st1 = 4002'; // najdi doJazyka
            DBAPI.dbRow.toLang = selectOneValueFromTable10(tableName, sql1, '', 'w2', 'DBAPI.dbRow.toLang', vypln11);
            console.log(sql1);

            DBAPI.dbRow.nowLang = DBAPI.dbRow.fromLang;
            sql1 = "3 DBAPI.dbRow.fromLang =|" + DBAPI.dbRow.fromLang + "|, DBAPI.dbRow.toLang=|" + DBAPI.dbRow.toLang + "|, DBAPI.dbRow.nowLang=|" + DBAPI.dbRow.nowLang + "|";
            console.log(sql1);
            sql1 = 'Reading in DB OK';
            //alert(sql1); 

            return (strLongString);
        }
        console.log("4p=|" + p + "|, iKolikCelkem=|" + iKolikCelkem + '|, w1=|' + w1 + '|, w2=|' + w2 + '|');
        return (strOut);
    },

    dejNextSlovo: function(fvypln) {
        //app.log("DBAPI.dejNextSlovo ");
        //console.log("DBAPI.dejNextSlovo ");
        //  
        var clause = '',
            iRandom = 1,
            sql1;

        DBAPI.dbRow.iOtoc = 0; // jeste jsme neotaceli sedive okenko

        iRandom = Math.round(Math.random() * DBAPI.dbRow.iPocetSlovCelkem) + 1; // 1..iPocetSlovCelkem
        // abychom zamezili cyklum, budeme vybirat nahodnou radku

        if (DBAPI.dbRow.iUzMluvilo++ > 345) return;

        if (DBAPI.dbRow.iDirection == 0) {

            sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE rowId <> ' + iGlobalRowId + ' AND w1 IN ( SELECT DISTINCT w1 FROM ' + tableName + ' WHERE st1 < 101 ORDER BY c2 DESC, c1 ASC LIMIT 10 )  order by c1 ASC limit 9';

            sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE rowId <> ' + iGlobalRowId + ' AND w1 IN ( SELECT DISTINCT w1 FROM ' + tableName + ' WHERE st1 < 101 ORDER BY c1 ASC LIMIT 5 )  order by t2 ASC, t1 ASC limit 2';

            sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE rowId = ' + iRandom + ' AND rowId <> ' + iGlobalRowId;

        } else {

            sql1 = ' DISTINCT rowId AS rowId, w1 AS w2, w2 AS w1, p1 AS p2, p2 AS p1, a1 AS a2, a2 AS a1, c1 AS c2, c2 AS c1, t1 AS t2, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE rowId <> ' + iGlobalRowId + ' AND w1 IN ( SELECT DISTINCT w1 FROM ' + tableName + ' WHERE st1 < 101 ORDER BY c2 DESC, c1 ASC LIMIT 10 )  order by c1 ASC LIMIT 9';

            sql1 = ' DISTINCT rowId AS rowId, w1 AS w2, w2 AS w1, p1 AS p2, p2 AS p1, a1 AS a2, a2 AS a1, c1 AS c2, c2 AS c1, t1 AS t2, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE rowId <> ' + iGlobalRowId + ' AND w1 IN ( SELECT DISTINCT w1 FROM ' + tableName + ' WHERE st1 < 101 ORDER BY c1 ASC LIMIT 5 )  order by t2 ASC, t1 ASC LIMIT 2';

            sql1 = ' DISTINCT rowId AS rowId, w1 AS w2, w2 AS w1, p1 AS p2, p2 AS p1, a1 AS a2, a2 AS a1, c1 AS c2, c2 AS c1, t1 AS t2, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE rowId = ' + iRandom + ' AND rowId <> ' + iGlobalRowId;

        }

        console.log(sql1);

        iRandom = Math.round(Math.random() * (DBAPI.dbRow.iPocetSlovCelkem + iGlobalRowId)) + 1; // 1..iPocetSlovCelkem, zamichej random
        //sql1 = ' * ';
        txt = "GJK008.00013 after  selectFromTable13(|" + sql1 + "|)";
        GjkDebugPrintf(0, txt);
        this.selectFromTable13(tableName, sql1, clause, fvypln);

        //************************************************************
        //console.log(sql1);
        return;
    },

selectFromTable129: function(t1, q1, clause, fvypln) {
        // vysledek je vracen do funkce fvypln
        var s2, txt;
        var iMax = -1;

		DBAPI.dbRow.selectFromTable129_iRowId = (-129);
        gjk001OpenDB();
        s2 = "SELECT " + q1 + clause;
        txt = "GJK006.10166, 2014.07.27, 1114,  before |" + s2 + "|";
        GjkDebugPrintf(9, txt);
		console.log("selectFromTable129(), radka 1244, selectFromTable129(), s2=|" + s2 + "|");

        try {
            Gjkdb.transaction(function(tx) {
                // http://stackoverflow.com/questions/6780911/web-sql-transaction-returns-empty
                tx.executeSql(s2, [],
                    function(tx, rs) {
                        var result = [];
                        DBAPI.dbRow.w2.length = 0; // vyprazdnit seznam
                        for (var i = 0; i < rs.rows.length; i++) {
                            var row = rs.rows.item(i);
                            result[i] = {
                                rowId: row['rowId'],
                                w1: row['w1'],
                                w2: row['w2'],
								a1: row['a1'],
                                a2: row['a2'],
                                st1: row['st1'],
                                l1: row['l1'],
                                v1: row['v1']
                            };

                            DBAPI.dbRow.selectFromTable129_iRowId = row['rowId'];
                            DBAPI.dbRow.selectFromTable129_w1 = row['w1'];
							DBAPI.dbRow.selectFromTable129_a1 = row['a1'];
							DBAPI.dbRow.selectFromTable129_a2 = row['a2'];
                            DBAPI.dbRow.selectFromTable129_w2[i] = row['w2'];
                            DBAPI.dbRow.selectFromTable129_n2[i] = row['n2'];
                            DBAPI.dbRow.selectFromTable129_c2[i] = row['c2'];
                            DBAPI.dbRow.selectFromTable129_l1 = row['l1']; // likelyhood
                            DBAPI.dbRow.selectFromTable129_v1 = row['v1']; // verb1
                        }

                        DBAPI.selectFromTable129_result7 = result;
                        //DBAPI.dbRow.result7.pushd("w1=" + DBAPI.dbRow.w1);
						if (DBAPI.dbRow.selectFromTable129_iRowId > 0) {
                        console.log("selectFromTable129(), radka 1290,  selectFromTable129_iRowId=|" + DBAPI.dbRow.selectFromTable129_iRowId + "|");
						
						console.log("selectFromTable129(), vypln129(), radka 1293, pred vMluv129("+DBAPI.dbRow.fromLang+","+DBAPI.dbRow.selectFromTable129_w1+");");  
						vMluv129(DBAPI.dbRow.fromLang, DBAPI.dbRow.selectFromTable129_w1); // zzz copy audio file from server to client disk
						// now update SQL 
						//sql1 = "UPDATE " + tableName + " SET a1=1 WHERE rowId=" + DBAPI.dbRow.selectFromTable129_iRowId;
						//DBAPI.updateTable8(tableName, sql1, clause, vypln3);
						
						console.log("selectFromTable129(), vypln129(), radka 1299, pred vMluv129("+DBAPI.dbRow.toLang+","+DBAPI.dbRow.selectFromTable129_w2[0]+");");
						vMluv129(DBAPI.dbRow.toLang, DBAPI.dbRow.selectFromTable129_w2[0]); // zzz copy audio file from server to client disk
						// now update SQL 
						sql1 = "UPDATE " + tableName + " SET a1=1, a2=1 WHERE rowId=" + DBAPI.dbRow.selectFromTable129_iRowId;
						DBAPI.updateTable8(tableName, sql1, clause, vypln129);
					
                        if (fvypln) fvypln(DBAPI.dbRow);
						}
						else {
							console.log("GJK 2014.07.27, 1200, selectFromTable129(), finished, selectFromTable129_iRowId=|" + DBAPI.dbRow.selectFromTable129_iRowId + "|");
						};
                    },
                    function(tx, error) {
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

        txt = "GJK026.33337 selectFromTable129() OK? after |" + s2 + "|, iMax=" + iMax + "|" + ", GlobalResult2.slovo=|" + GlobalResult2.slovo + '|';
        GjkDebugPrintf(9, txt);
        return;
    },

    selectFromTable13: function(t1, q1, clause, fvypln) {
        // vysledek je vracen do funkce fvypln
        var s2, txt;
        var iMax = -1;
        if (DBAPI.dbRow.iKolikMluvi > 2) return;

        gjk001OpenDB();
        s2 = "SELECT " + q1 + clause;
        txt = "GJK006.10166 before |" + s2 + "|";
        GjkDebugPrintf(9, txt);
        try {
            Gjkdb.transaction(function(tx) {
                // http://stackoverflow.com/questions/6780911/web-sql-transaction-returns-empty
                tx.executeSql(s2, [],
                    function(tx, rs) {
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
                            DBAPI.dbRow.l1 = row['l1']; // likelyhood
                            DBAPI.dbRow.v1 = row['v1']; // verb1

                            GlobalResult2.iPocet = i;
                        }

                        DBAPI.result7 = result;
                        //DBAPI.dbRow.result7.pushd("w1=" + DBAPI.dbRow.w1);

                        //console.log("001:" + s2);
                        //console.log(result); // tohle pise OK na consoli 2014.06.25.  22:44
                        //console.log(DBAPI.result7); // tohle pise OK na consoli 2014.07.08.  14:04
                        //console.log(DBAPI.dbRow); // tohle pise OK na consoli 2014.07.08.  14:04
                        console.log("selectFromTable13(), radek 1390, auto=|" + DBAPI.dbRow.automaticaudio2 + "|, kolik=|" + DBAPI.dbRow.iKolikMluvi + "|");
                        if (DBAPI.dbRow.automaticaudio2 == 1) { // zadne vstupy mluvime 
                            if (DBAPI.dbRow.iKolikMluvi == 0) {
                                if (DBAPI.dbRow.w2[0] && DBAPI.dbRow.w1) { // w2 is defined 
                                    console.log("1 vMluv|" + DBAPI.dbRow.fromLang + "|" + DBAPI.dbRow.w1 + "|");
                                    //vMluv(DBAPI.dbRow.fromLang, DBAPI.dbRow.w1);

                                    vMluv(DBAPI.dbRow.fromLang, DBAPI.dbRow.w1); // schedule vMluv w1 za 0.001seconds									
                                    //VeryBadSleep(3454);

                                    //setTimeout(vMluv(DBAPI.dbRow.toLang, DBAPI.dbRow.w2[0]), 3454); // 1.23 seconds
                                    //VeryBadSleep(3454);

                                    console.log("2 vMluv|" + DBAPI.dbRow.toLang + "|" + DBAPI.dbRow.w2[0] + "|, DBAPI.dbRow.iKolikMluvi=|" + DBAPI.dbRow.iKolikMluvi + '|, uzMluvilo=|' + DBAPI.dbRow.iUzMluvilo + '|');
                                    setTimeout(vMluv3, 1567); // schedule vMluv w2 za 2.345 seconds
                                    //setTimeout(vMluv(DBAPI.dbRow.fromLang, DBAPI.dbRow.w1), 2345); 

                                    //vMluv(DBAPI.dbRow.toLang, DBAPI.dbRow.w2[0]);
                                    //vMluv(DBAPI.dbRow.toLang, DBAPI.dbRow.w2[0]);	
                                    //alert("from=|" + DBAPI.dbRow.fromLang + '|, w1=' + DBAPI.dbRow.w1 + '|');
                                } else {
                                    console.log("gjk.2014.97.12, is NOT defined!, w1=|" + DBAPI.dbRow.w1 + "|, w2=|" + DBAPI.dbRow.w2[0] + '|');
                                };
                                console.log("GJK 2014.07.11..16:24, WARNING!!! DBAPI.dbRow.w1=" + DBAPI.dbRow.w1 + "|, DBAPI.dbRow.w2[0]=" + DBAPI.dbRow.w2[0] + "|");
                                iRandom = Math.round(Math.random() * DBAPI.dbRow.iPocetSlovCelkem) + 1; // zamichejme random
                                setTimeout(nextAutomaticSlovo, 3456);
                            } else {
                                DBAPI.dbRow.iKolikMluvi++;
                            };
                        };

                        iRandom = Math.round(Math.random() * DBAPI.dbRow.iPocetSlovCelkem) + 1; // zamichejme random

                        console.log(GlobalResult2); // tohle pise OK na consoli 2014.06.25.  22:44

                        iGlobalRowId = GlobalResult2.rowId; // Olda .
                        if (fvypln) fvypln(DBAPI.dbRow);
                    },
                    function(tx, error) {
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

        txt = "GJK006.33333a selectFromTable13() OK? after |" + s2 + "|, iMax=" + iMax + "|" + ", GlobalResult2.slovo=|" + GlobalResult2.slovo + '|';
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
            Gjkdb.transaction(function(tx) {
                // http://stackoverflow.com/questions/6780911/web-sql-transaction-returns-empty
                tx.executeSql(s2, [],
                    function(tx, rs) {
                        if (fvypln) {
                            fvypln(DBAPI.dbRow);
                            txt = "GJK0003.2014.07.08..160117z after |" + s2 + "|, iMax=" + iMax + "|";
                            console.log(txt);
                        } else {
                            txt = "GJK0033.2014.07.08..160118z after |" + s2 + "|, iMax=" + iMax + "|";
                            console.log(txt);
                        };
                    },
                    function(tx, error) {
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

        txt = "GJK009.33333a selectFromTable13() OK? after |" + s2 + "|, iMax=" + iMax + "|" + ", GlobalResult2.slovo=|" + GlobalResult2.slovo + '|';
        GjkDebugPrintf(9, txt);
        console.log(txt);
        return;
    },

    kill: function() {
        var sql1 = '',
            clause = '';

        sql1 = "UPDATE " + tableName + " SET st1 = 3000, t1=(DATETIME('now')), c1=1+(SELECT c1 AS c1 FROM " + tableName + " WHERE rowId=" + DBAPI.dbRow.iRowId + ") WHERE rowId=" + DBAPI.dbRow.iRowId;
        // 0..1000 normal word, 3000 killed words
        //sql1 = "UPDATE " + tableName + " SET c1=0, t1=(DATETIME('now')) WHERE w1='kocka'";
        //sql1 = ' * ';
        txt = "GJK011.00013.2014.07.09.  after  updateTable8(|" + sql1 + "|)";
        GjkDebugPrintf(0, txt);
        //this.updateTable8(tableName, sql1, clause, null);
        DBAPI.updateTable8(tableName, sql1, clause, vypln3);

        // znova prepocitej slova po KILL

        sql1 = 'SELECT COUNT(*) AS CurrentCount FROM ' + tableName + ' WHERE st1 < 998'; // 0..1000 is a word in the row 
        selectOneValueFromTable9(tableName, sql1, '', 'CurrentCount', t_h_i_s_setStatus);

        //alert("Not implemented yet ! kill");
    },

    audio: function() {
        //var snd = new Audio("AUDIO/file.wav"); // buffers automatically when created

        var snd, pole1, pole2;

        pole1 = DBAPI.result7;

        //if (pole1.isArray) 

        {
            var l1, rowId, st1, v1, w1, w2, string, lang;
            //pole2 = pole1.reverse;
            //console.log(pole2);
            pole1.forEach(function(entry) {

                l1 = entry.l1;
                rowId = entry.rowId;
                st1 = entry.st1;
                v1 = entry.v1;
                w1 = entry.w1;
                w2 = entry.w2;
            })
            if (DBAPI.dbRow.nowLang == DBAPI.dbRow.fromLang) lang = DBAPI.dbRow.toLang;
            if (DBAPI.dbRow.nowLang == DBAPI.dbRow.toLang) lang = DBAPI.dbRow.toLang;
            vMluv(lang, w2);
        }

        // http://translate.google.com/translate_tts?tl=cs&q=Ahoj%20Pepo
        //(new Audio()).canPlayType("audio/ogg; codecs=vorbis")
        console.log(pole1);
        //alert("Not implemented yet ! audio");
    },

    plusaudio: function() {
        if (DBAPI.dbRow.plusaudio2 == 0) { // preklapni
            DBAPI.dbRow.plusaudio2 = 1;
            DBAPI.dbRow.onlyaudio2 = 0;
            DBAPI.dbRow.automaticaudio2 = 0;
        } else
            DBAPI.dbRow.plusaudio2 = 0;

        DBAPI.dbRow.iKolikMluvi = 0;
        //alert("plusaudio Not implemented DBAPI.dbRow.plusaudio2=" + DBAPI.dbRow.plusaudio2);
    },
    onlyaudio: function() {

        if (DBAPI.dbRow.onlyaudio2 == 0) { // preklapni
            DBAPI.dbRow.onlyaudio2 = 1;
            DBAPI.dbRow.plusaudio2 = 0;
            DBAPI.dbRow.automaticaudio2 = 0;
        } else
            DBAPI.dbRow.onlyaudio2 = 0;

        DBAPI.dbRow.iKolikMluvi = 0;
        //alert("onlyaudio Not implemented DBAPI.dbRow.onlyaudio2=" + DBAPI.dbRow.onlyaudio2);
    },
    automaticaudio: function() {

        DBAPI.dbRow.iUzMluvilo = 0;
        if (DBAPI.dbRow.automaticaudio2 == 0) { // preklapni
            DBAPI.dbRow.automaticaudio2 = 1;
            DBAPI.dbRow.plusaudio2 = 0;
            DBAPI.dbRow.onlyaudio2 = 0;
        } else
            DBAPI.dbRow.automaticaudio2 = 0;

        DBAPI.dbRow.iKolikMluvi = 0;

        for (var i = 1; i < 2; i++) {
            iGlobalRowId = DBAPI.dbRow.rowId;
            iGlobalRowId = 0;
            //DBAPI.dejNextSlovo(this.vAuto11); // kkkk
            //setTimeout(DBAPI.dejNextSlovo(vypln), 3456);  // 3.456seconds
            DBAPI.dejNextSlovo(vypln);
            //VeryBadSleep(2345);
        }

        //alert("automaticaudio Not implemented");
    },

    vAuto11: function() {
        // slovo je objekt (dbRow) obsahujici slova v obou jazycich
        var s = '',
            s2 = '';

        iColor1 = 'green'; //'lime';
        iColor2 = 'lime'; //'orange';
        iColor3 = 'magenta';
        iColor4 = 'red'; //#F75D59'; // red

        s2 = DBAPI.dbRow.w2.toString();
        s3 = DBAPI.dbRow.w2;
        s4 = s2;
        //if( Object.prototype.toString.call( someVar ) === '[object Array]' ) {
        if (s3.isArray) {
            for (var p in s3) {
                var s5 = '',
                    carka = ",?",
                    iC = 0;
                console.log("----s5=|" + s5 + '|');
                s5 = s5 + s3[p] + carka;
                if (iC > 4) {
                    carka = ",!<P>";
                    iC = 0;
                } else {
                    iC++;
                }
                s4 = s5;
            };
        } else {
            s3 = s2.split(','); // s3 je string
            for (var p in s3) {
                var s5 = '',
                    carka = " ",
                    iC = 0;
                //console.log("----s5=|" + s5 + '|');
                s5 = s5 + s3[p] + carka;
                if (iC > 4) {
                    carka = ",<P>";
                    iC = 0;
                } else {
                    iC++;
                    carka = ", ";
                }
                s4 = s5;
            };
        };

        console.log(DBAPI.dbRow); // DBAPI.dbRow == 'people', fromLang==nowLang=='En', toLang == 'Fr',  

        if (DBAPI.dbRow.onlyaudio2 == 1) {
            vMluv(DBAPI.dbRow.fromLang, DBAPI.dbRow.w1);
            s = '<div id="tabs-0" class="tab"> <div id="Word1"> ' + '<font color="' + iColor1 + '">' +
                'Only Audio mode' + "</font>" +
                '</div> <div id="Word2"> ' + '<font color="' + iColor4 + '">' +
                s4 + "</font>" +
                '</div></div> ';
        } else {
            s = '<div id="tabs-0" class="tab"> <div id="Word1"> ' + '<font color="' + iColor1 + '">' +
                slovo.w1 + "</font>" +
                '</div> <div id="Word2"> ' + '<font color="' + iColor4 + '">' +
                s4 + "</font>" +
                '</div></div> ';
        };

        // console.log(DBAPI.result7); global na zobrazeni

        $("#slovo").html(s);
        // $.ui.updateBadge("#mysipka",DBAPI.dbRow.fromLang,"tl","green"); //Badge will appear on the top left
        // $.ui.updateBadge("#mysipka",DBAPI.dbRow.toLang,"dr","red"); 
        $("#mysipka").html("From known language:  &nbsp;&nbsp;&nbsp;   " + '<font color="' + iColor1 + '">' + DBAPI.dbRow.fromLang + "</font>" + "  &nbsp;&nbsp;&nbsp;    -->    &nbsp;&nbsp;&nbsp;  to a new language:    &nbsp;&nbsp;&nbsp;  " + '<font color="' + iColor4 + '">' + DBAPI.dbRow.toLang + "</font>");
        $.ui.updateBadge("#slovo", DBAPI.dbRow.fromLang, "tl", "green"); //Badge will appear on the top left
        // DBAPI.dbRow.nowLang = DBAPI.dbRow.toLang; // jazyk po otoceni
        $("#Word1").show();
        $("#Word2").hide();
        // canim('#slovo','animated flipInX',1000);
        showStatus();
        if (DBAPI.dbRow.onlyaudio2 == 1) {
            // nemluv dvakrat!
        } else {
            if (DBAPI.dbRow.plusaudio2 == 1) vMluv(DBAPI.dbRow.fromLang, DBAPI.dbRow.w1);
        }
    },

    reverse: function() {
        var v1, v2;

        v1 = DBAPI.dbRow.fromLang;
        v2 = DBAPI.dbRow.toLang;
        DBAPI.dbRow.fromLang = v2;
        DBAPI.dbRow.toLang = v1;
        DBAPI.dbRow.nowLang = DBAPI.dbRow.fromLang;

        if (DBAPI.dbRow.iDirection == 0) { // zmena smeru prekladu
            DBAPI.dbRow.iDirection = 1;
        } else {
            DBAPI.dbRow.iDirection = 0;
        }
        //alert("Not ymplemented yet ! reverse");
    }

}; // konec objektu DBAPI

function openFS(button) {
    console.log("GJK 267 openFS()");
    //filer.init(false, 4*1024*1024,
    filer.init(true, 1024 * 1024,
        function(fs) {
            // GJK filer.init(true, 1024*1024, function(fs) {

            filer.readDir(function(entries) {
                var html = [];
                toArray(entries).forEach(function(entry, i) {
                    addEntryToList(entry);
                });

                console.log('<p>Opened file system: ' + fs.name, +'</p>');
                button.disabled = true;
            }, errorHandler);

        }, errorHandler);
};


window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder;
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;

var util = util || {};
util.toArray = function(list) {
    return Array.prototype.slice.call(list || [], 0);
};


var filer = filer || new function() {

    var fs_ = null;
    const FS_INIT_ERROR_MSG = 'Filesystem has not been initialized.';

    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
    };

    var init_ = function(persistent, size, successCallback, opt_errorHandler) {
        var type = persistent ? window.PERSISTENT : window.TEMPORARY;

        console.log("GJK002, requestFS, size=|" + size + '|');

        window.requestFileSystem(
            // GJK type, // persistent vs. temporary storage
            window.TEMPORARY, // persistent vs. temporary storage
            size, // size (bytes) of needed space
            function(fs) {
                fs_ = fs;
                successCallback(fs);
            }, // success callback
            opt_errorHandler // opt. error callback, denial of access
        );
    };
};

function errorHandler(e) {
    console.log("GJK001 errorHandler(), radka 1172, , e=|" + e + '|');
    console.log("GJK001 errorHandler(), radka 1773, e.code=|" + e.code + '|');
    var msg = '';
    //switch (e.code) {
    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg += 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg += 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg += 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg += 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg += 'INVALID_STATE_ERR';
            break;
        default:
            msg += 'Unknown Error';
            break;
    };
    console.log('GJK001 errorHandler(), radka 1773, msg=|' + msg + '|');
};

function aFilerInitOK(fs) {
    var type = window.TEMPORARY;
    //var type = persistent ? window.PERSISTENT : window.TEMPORARY;

    size = 1024 * 1024;
    console.log("GJK002, requestFS, size=|" + size + '|');
    window.requestFileSystem(
        // GJK type, // persistent vs. temporary storage
        window.TEMPORARY, // persistent vs. temporary storage
        size, // size (bytes) of needed space
        function(fs) {
            fs_ = fs;
            aGlobalFsRoot = fs;
            successCallback(fs);
        }, // success callback
        errorHandler // error callback, denial of access
    )
};

var Filer = window.Filer; // Option 3: Filer on global

function onInitFs3(fs) {
    //var filer = new window.Filer();
    //var filer = new window.Filer;
    //var filer = require('filer'); // Option 1: Filer loaded via require() in node/browserify

    // Option 2: Filer loaded via RequireJS
    /* requirejs.config({
      baseUrl: '/',
      paths: {
        'filer': 'filer/dist/filer'
      }
    });
    requirejs(['filer'], function(Filer) {});
    */
    console.log(fs);
    //console.log(fs.name);
    console.log('GJK onInitFs2(), line 1337, 2014.07.14.');

    //filer.init(true, 1024*1024, aFilerInitOK(fs), errorHandler);

    var Filer = window.Filer; // Option 3: Filer on global
    console.log(Filer);
    //Filer.init({persistent: false, size: 1024 * 1024}, aFilerInitOK(fs), errorHandler);
    //filer.init();

    /*filer.init(true, 1024*1024,
	function(fs) {// GJK filer.init(true, 1024*1024, function(fs) {
		filer.readDir(function(entries) {
			var html = [];
			toArray(entries).forEach(function(entry, i) {
			addEntryToList(entry);}	);
		console.log('<p>Opened file system: ' + fs.name, + '</p>');
		button.disabled = true;
		}, errorHandler);
	}, errorHandler);
    aGlobalFsRoot = fs.root; 
	fs_ = fs; // GJK
    console.log('04Position');
    alert("Welcome to Filesystem! It's showtime :)"+fs); // Just to check if everything is OK :)
*/
};


function openFS2() {
    //navigator.webkitPersistentStorage.requestQuota (1*1024*1024, function(grantedBytes) {
    navigator.webkitTemporaryStorage.requestQuota(1 * 1024 * 1024,
        function(grantedBytes) {
            console.log('GJK openFS2(), line 1368, 2014.07.14.');
            reqFS2(grantedBytes);
        }, errorHandler);
    console.log('GJK openFS2(), line 1371, 2014.07.14.');
}

function reqFS2(grantedBytes) {
    //window.webkitRequestFileSystem(window.PERSISTENT, grantedBytes, function(fs) {
    /*
    window.webkitRequestFileSystem(window.TEMPORARY, grantedBytes, function(fs) {
      
     console.log ('GJK reqFS2(), line 1316, 2014.07.14.');
        alert("Welcome to Filesystem! It's showtime :)"+fs); // Just to check if everything is OK :)
      }, errorHandler);
      */
    // http://stackoverflow.com/questions/7508770/how-to-use-filesystem-api-to-debug-javascript-the-execution-order-issue
    console.log('GJK reqFS2(), line 1384, 2014.07.15.');
    window.requestFileSystem(window.TEMPORARY, 1 * 1024 * 1024, function(fs) {
		fs_ = fs;
        onInitFs2(fs);
    }, errorHandler);

};

function onInitFs12(fs) { // http://www.html5rocks.com/en/tutorials/file/filesystem/?redirect_from_locale=fr
    console.log(fs);
    console.log('GJK onInitFs2(), line 1392, 2014.07.15.');
    vGJkWriteFile(fs);
};



function vGJkWriteFile(fs) {

    fs.root.getFile('log.txt', {
        create: true
    }, function(fileEntry) {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function(fileWriter) {

            fileWriter.onwriteend = function(e) {
                console.log('GJK onInitFs2(), 2014.07.15. line= 1468, OK! Write into the client local sandbox FS completed OK.');
                vGJkReadDir(fs);
            };

            fileWriter.onerror = function(e) {
                console.log('Write failed: ' + e.toString());
            };

            // Create a new Blob and write it to log.txt.
            var blob = new Blob(['Lorem Ipsum'], {
                type: 'text/plain'
            });

            fileWriter.write(blob);

        }, errorHandler);

    }, errorHandler);
};

function iCheckIfFileExists(path) {
    if (cordova == cordova) {
        if (path.isDirectory) {
            return 1;
        }
        if (path.isFile) {
            return 0;
        }
        return 3;
    } else {
        var result = false;
        if (fs_.isDirectory) {
            fs_.root.getFile(
                path, {
                    create: false
                },
                function() {
                    result = true;
                    alert("radka 1505, file exist, fn=" + path + "|");
                },
                function() {
                    result = false;
                    alert("radka 1505, file does NOT exist, fn=" + path + "|");
                }
            );
        };
        return true; // FALE blbe GJK 2014.07.23.
    }
};


function vGJkWriteFile2(fs, strFileName, vBlob) {
    var iFileSize = 0;

    console.log('GJK vGJkWriteFile2(fs), 2014.07.15. line= 1504, OK! Write into the client local sandbox FS completed OK.');
    console.log('GJK vGJkWriteFile2(|' + strFileName + '|, lze otevrit na http://opesol.org/HTML5/terminal/terminal.html  "cd DATA/AUIDO/em" "ls"');
    console.log(fs);
    fs.root.getFile(strFileName, {
        create: true
    }, function(fileEntry) {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function(fileWriter) {

            fileWriter.onwriteend = function(e) {
                console.log('GJK vGJkWriteFile2(), 2014.07.15. line= 1514, OK! fn=|' + strFileName + ' Write into the client local sandbox FS completed OK.');
                // get file size
                iFileSize = iGjkCheckFileSize(fs, strFileName);
                //vGJkReadDir(fs);
            };

            fileWriter.onerror = function(e) {
                console.log('Write failed: vGJkWriteFile2, 1522, :' + e.toString());
            };

            // Create a new Blob and write it to log.txt.
            var blob = new Blob([], {
                type: 'audio/x-wav'
            });

            // Create a new Blob and write it to log.txt.
            //var bb = new BlobBuilder(); 
            // Note: window.WebKitBlobBuilder.
            //blob.append(vBlob);

            //fileWriter.write(blob.getBlob('audio/x-wav'));

            //fileWriter.write(vBlob);
            fileWriter.write(blob);

            // get file size
            iFileSize = iGjkCheckFileSize(fs, strFileName);

            console.log('GJK vGJkWriteFile2(), 2014.07.15. line= 1543, OK! fn=|' + strFileName + ' Write after fileWriter.write(blob); OK.');

        }, errorHandler);

    }, errorHandler);
};

function vGJkReadDir(fs) {
    var dirReader = fs.root.createReader();
    var entries = [];

    console.log('vGJkReadDir(fs), radka= 2043');

    // Call the reader.readEntries() until no more results are returned.
    var readEntries = function() {
        dirReader.readEntries(function(results) {
            if (!results.length) {
                listResults(entries.sort());
            } else {
                entries = entries.concat(toArray(results));
                readEntries();
            }
        }, errorHandler);
    };

    readEntries(); // Start reading dirs.
};

function toArray(list) {
    return Array.prototype.slice.call(list || [], 0);
}

function listResults(entries) {
    console.log('GJK listResults(entries), 2014.07.15. line= 1444');
    // Document fragments can improve performance since they're only appended
    // to the DOM once. Only one browser reflow occurs.
    var fragment = document.createDocumentFragment();

    entries.forEach(function(entry, i) {
        var img = entry.isDirectory ? '<img src="folder-icon.gif">' :
            '<img src="file-icon.gif">';
        var li = document.createElement('li');
        //li.innerHTML = [img, '<span>', entry.name, '</span>'].join('');
        //fragment.appendChild(li);
        console.log("listResults(), radka 2076, GJK directory ----> entry=|" + entry.name + '|  <-----');
    });

    //document.querySelector('#filelist').appendChild(fragment);
}

function vGjkReadFile(fs) {

    fs.root.getFile('log.txt', {}, function(fileEntry) {

        // Get a File object representing the file,
        // then use FileReader to read its contents.
        fileEntry.file(function(file) {
            var reader = new FileReader();

            reader.onloadend = function(e) {
                var txtArea = document.createElement('textarea');
                txtArea.value = this.result;
                document.body.appendChild(txtArea);
            };

            reader.readAsText(file);
        }, errorHandler);

    }, errorHandler);


};

function onDeviceReady778(GJKstrFileName) {
	console.log("onDeviceReady778(), radka 2109, strFileName=|"+GJKstrFileName+"|");
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
		gotFS778(fileSystem, GJKstrFileName)
		, 
		function(e) {
                // 'e' is an object, {code: 'Class not found'}
                alert('Fail radka 2114'); errorHandler(e);
        }
	);
};

function gotFS778(fileSystem, GJKstrFileName) { 
	var fn='/DATA/AUDIO/en/retrieved.wav'; 
	fn = GJKstrFileName;
	console.log("gotFS778(), radka 2122, fn=|"+fn+"|, fn=|"+fn+"|, GJKstrFileName=|"+GJKstrFileName+"|");
	vGJkReadDir(fileSystem); fs_ = fileSystem;
	// proc nasledujici radka nefunguje ??
    fileSystem.root.getFile(fn,  {create: false, exclusive: false}, 
		gotFileEntry778, 
		function(e) {
                // 'e' is an object, {code: 'Class not found'}
                alert('Fail radka 2130, fn=|'+fn+"|");  errorHandler(e);
        }
	);
};
	
function gotFileEntry778(fileEntry, GJKstrFileName) {
	console.log("gotFileEntry778(), radka 2136,  GJKstrFileName=|"+GJKstrFileName+"|");
    fileEntry.file(gotFile778(file, GJKstrFileName)
		, 
		function(e) {
                // 'e' is an object, {code: 'Class not found'}
                alert('Fail radka 2141'); errorHandler(e);
        }
	);
};

function gotFile778(file, GJKstrFileName){
        //readDataUrl(file);
        //readAsText(file);
		console.log("gotFile778(), radka 2148,  GJKstrFileName=|"+GJKstrFileName+"|");
		  file.getMetadata(function(metadata) {
                //alert("Metadata size=|" + metadata.size + "|, fn=|" + strFileName + "|");
                if (metadata.size > 0) {
                    // snad mame dobry local WAV file
                    console.log("gotFile778(), radka 2123, fn=|" + strFileName + "|, size=" + metadata.size + "|");
                    alert("gotFile778(), radka 2124, fn=|" + strFileName + "|, size=" + metadata.size + "|");
                }
                return metadata.size;
            }, function(e) {
                // 'e' is an object, {code: 'Class not found'}
                alert('Fail radka 2159'); errorHandler(e);
            })		
};

function gotFile779(file, GJKstrFileName){
        //readDataUrl(file);
        //readAsText(file);
		GJKstrFileName="file:///storage/sdcard/path/to/downloads/DATA/AUDIO/en/en.wav";
		console.log("gotFile779(), radka 2179,  GJKstrFileName=|"+GJKstrFileName+"|");
		  file.getMetadata(function(metadata) {
                //alert("Metadata size=|" + metadata.size + "|, fn=|" + strFileName + "|");
                if (metadata.size > 0) {
                    // snad mame dobry local WAV file
                    console.log("gotFile779(), radka 2184, fn=|" + strFileName + "|, size=|" + metadata.size + "|");
                    alert("gotFile779(), radka 2185, fn=|" + strFileName + "|, size=|" + metadata.size + "|");
                }
                return metadata.size;
            }, function(e) {
                // 'e' is an object, {code: 'Class not found'}
                alert('Fail radka 2190'); errorHandler(e);
				return -1;
            })		
		return -1;
};

// WEB local storage 2014.07.23.
// http://diveintohtml5.info/storage.html
// http://www.w3schools.com/html/html5_webstorage.asp
function iGjkCheckFileSize77(fs, strFileName) {
	//onDeviceReady778(strFileName);
	/*
    fs.root.getFile(strFileName, {
        create: false
    }, function(fileEntry) {
        //    fileEntry.size - ????????
        fileEntry.getMetadata(function(metadata) {
                //alert("Metadata size=|" + metadata.size + "|, fn=|" + strFileName + "|");
                if (metadata.size > 0) {
                    // snad mame dobry local WAV file
                    snd = new Audio(strFileName); // buffers automatically when created
                    console.log(snd);
                    snd.play();
                    DBAPI.dbRow.iKolikMluvi++;
                    console.log("in iGjkCheckFileSize, 1640, after snd.play fn=|" + strFileName + "|, size=" + metadata.size + "|");
                    //alert("in iGjkCheckFileSize, 1641, after snd.play fn=|" + strFileName + "|, size=" + metadata.size + "|");
                }
                return metadata.size;
            }),
            function(fileEntry) {
                console.log("GJK 2014.07.20, fs.root.getFile(), fileEntry.getMetaData() ERROR, 1588, iGjkCheckFileSize(), fn=|" + strFileName + "|");
                alert("Metadata ERROR size=|" + metadata.size + "|, fn=|" + strFileName + "|");
                return 0;
            }
    });
	*/
	
	console.log("iGjkCheckFileSize77(), radka 2223, strFileName=|"+strFileName + "|");  	if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) { callback(); }; //CORDOVA error https://supportforums.blackberry.com/t5/Web-and-WebWorks-Development/Cordova-3-4-File-plugin-1-0-1-resolveLocalFileSystemURL-for/td-p/2818304
} // http://www.raymondcamden.com/2014/2/17/Cordova-File-System--Important-Update
                  
	window.resolveLocalFileSystemURL(strFileName
		,
		function(file){
		    console.log("iGjkCheckFileSize77(), radka 2228, fn=|" + strFileName + "|");
			file.getMetadata(
				function(metadata) {
                //alert("Metadata size=|" + metadata.size + "|, fn=|" + strFileName + "|");
					if (metadata.size > 0) {
                    // snad mame dobry local WAV file
                    console.log("iGjkCheckFileSize77(), radka 2234, fn=|" + strFileName + "|, size=|" + metadata.size + "|");
                    alert("iGjkCheckFileSize77(), radka 2234, fn=|" + strFileName + "|, size=|" + metadata.size + "|");
					}
					return metadata.size;
				}, function(e) {
                // 'e' is an object, {code: 'Class not found'}
                alert('Fail radka 2239'); errorHandler(e);
				return -1;
            }
			)	
			console.log("iGjkCheckFileSize77(), radka 2244, fn=|" + strFileName + "|");			
			return -1;
		}		
		,
		function(e) {
                // 'e' is an object, {code: 'Class not found'}
			console.log("iGjkCheckFileSize77(), radka 2250, fn=|" + strFileName + "|, size=|" + metadata.size + "|");
            alert('cdvDownloadFile129(), OK, radka 2251, entry.toURL()=|'+entry.toURL()+"|"); errorHandler(e);
        }		
	);
		
	console.log("iGjkCheckFileSize77(), radka 2255, fn=|" + strFileName + "|");
                 	
    return -1;
};

function iGjkCheckFileSize(fs, strFileName) {

    return (-1);

    function success2(file) {
        var iSize = 0;
        iSize = file.size
        console.log("iGjkCheckFileSize(), 1763, File size: " + iSize);
        return iSize;
    }

    function fail2(error) {
        alert("1768, Unable to retrieve file properties: " + error.code);
        return (-1);
    }

    function success(entry) {
        console.log("GJK 2014.07.25, iGjkCheckFileSize(),  1772, iGjkCheckFileSize(), success(), fn=|" + entry + "|");
        // obtain properties of a file
        entry.file(success2, fail2);

        return (-1);
    }

    function fail(error) {
        //alert("Unable to retrieve file properties: " + error.code);
        return (-1);
    }

    console.log("GJK 2014.07.20, 1571, iGjkCheckFileSize(), fn=|" + strFileName + "|");

    if (1 == 2) {
        fs.root.getFile(strFileName, {
                cretate: false
            },
            //fs.root.getFile(strFileName, {cretate: true, exclusive: true}, 
            //fs.root.getFile(strFileName, {},

            success(fileEntry),

            function(fileEntry) {
                console.log("GJK 2014.07.20, fs.root.getFile(), fileEntry.getMetaData() ERROR, 1779, iGjkCheckFileSize(), fn=|" + strFileName + "|");
                return (-1);
            }
        );
    } else {
        success(strFileName);
    }
    console.log("GJK 2014.07.20, 1590, iGjkCheckFileSize(), fn=|" + strFileName + "|");
    return (-1);
};

function vGJkGetMetadata1(fileEntry) {
    // Get a File object representing the file,
    // fileEntry.isFile === true
    // fileEntry.neme == strFileName
    // fileEntry.duleePath == "?StrFileName"	
    console.log("GJK 2014.07.20, 1581, iGjkCheckFileSize() before fileEntry.getMetaData() , fn=|" + strFileName + "|");
    fileEntry.getMetaData(

        vGJkGetMetadata2(md),

        function(fileEntry) {
            console.log("GJK 2014.07.20, ERROR, 1586, iGjkCheckFileSize(), fn=|" + strFileName + "|");
        });

};

function vGJkGetMetadata2(md) {
    console.log(md);
    console.log("GJK 2014.07.20, 1595, vGJkGetMetadata(" + strFileName + ") OK, time=|" +
        md.modificationTime.toDateString() + "|");
};

function vGJkMkdir(fs) {
    window.requestFileSystem(window.TEMPORARY, 1024 * 1024, function(fs) {
		fs_ = fs;
        fs.root.getDirectory('MyPictures', {
            create: true
        }, function(dirEntry) {
            // ...
        }, errorHandler);
    }, errorHandler);
};

function vGJkCreateDirTree(rootDirEntry, folders) {

    console.log('GJK vGJkCreateDirTree(fs), 2014.07.15. line= 1566, OK!');

    // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
    if (folders[0] == '.' || folders[0] == '') {
        folders = folders.slice(1);
    }
    rootDirEntry.getDirectory(folders[0], {
        create: true
    }, function(dirEntry) {
        console.log('GJK vGJkCreateDirTree(|' + folders[0] + '|, 2014.07.15. line= 1818, directory created OK!');

        // Recursively add the new subfolder (if we still have another to create).
        if (folders.length) {
            console.log('GJK vGJkCreateDirTree(|' + folders.slice(1) + '|, 2014.07.15. line= 1822, OK!');

            vGJkCreateDirTree(dirEntry, folders.slice(1));
        }
    }, errorHandler);
};
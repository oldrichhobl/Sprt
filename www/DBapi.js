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

var aGlobalFsRoot, fs_, iFileExist = 0; // globals GJK, HTML5 File System  // iFileExist is fake to catch iFileExist--not defined nekde 2014.07.27.
var iGlobalCurrentZvuk = 0,
    iGlobalMaxZvuk = (-1),
    bGlobalTedPraveHraji = false;
var poleGlobalVsechnyZvuky = [],
    MinulaHodnotaPoleGlobalVsechnyZvuky = '',
    iMaxUzSkoroMluvilo = 666987,
    iMaxUrciteUzMluvilo = 333,
	iGlobalFileSize=0;
	poleGlobalVsechnyZvuky[0] = "",
	poleDvaUzMluvilo1 = [],
	poleDvaUzMluvilo2 = [],
	iGlobal1392 = (-1392);

/*
http://www.rangde.org/static/bell-ring-01.mp3";
poleGlobalVsechnyZvuky[1]="http://opesol.org/wwwSPRT/DATA/PosliAudio.php?tl=en&wo=about&so=1";
poleGlobalVsechnyZvuky[2]="http://opesol.org/wwwSPRT/DATA/PosliAudio.php?tl=en&wo=car&so=1";
poleGlobalVsechnyZvuky[3]="http://opesol.org/wwwSPRT/DATA/PosliAudio.php?tl=fr&wo=adjectif&so=1";
poleGlobalVsechnyZvuky[4]="http://opesol.org/wwwSPRT/DATA/PosliAudio.php?tl=fr&wo=principalement&so=1";
poleGlobalVsechnyZvuky[5]="http://opesol.org/wwwSPRT/DATA/PosliAudio.php?tl=ru&wo=реабилитировать&so=1";
poleGlobalVsechnyZvuky[6]="http://opesol.org/wwwSPRT/DATA/PosliAudio.php?tl=ja&wo=しばしば&so=1";
poleGlobalVsechnyZvuky[7]="http://opesol.org/wwwSPRT/DATA/PosliAudio.php?tl=de&wo=abhalten&so=1";
poleGlobalVsechnyZvuky[8]="http://opesol.org/wwwSPRT/DATA/PosliAudio.php?tl=ja&wo=土産&so=1";
*/

function vPridejZvuk2(urlPath, lang, word) {
    var m;
    for (m = iGlobalMaxZvuk; m > (-1); m--) {
        if (urlPath == poleGlobalVsechnyZvuky[m]) return; // kdyz uz mame zvuk v buufferu tak nedelej nic
    }
    if (lang.length > 1 && word.length > 1) {
        vMyConsoleLog("vPridejZvuk2(), radka 38, str=|" + str + "|, iGlobalMaxZvuk=|" + iGlobalMaxZvuk + "|, bGlobalTedPraveHraji=|" + bGlobalTedPraveHraji + "|, lange=|" + lang + "|, word=|" + word + "|");
        vMluv129(lang, word); // pokud mame rozumne? Language a Word, zkus zda je treba dowload Zvuk ze serveru				
    }
    vPridejZvuk(urlPath);
};

function vPridejZvuk(str) {
    var pole1 = [],
        pole2 = [],
        mylang1, myword1;
    vMyConsoleLog("vPridejZvuk(), radka 46, str=|" + str + "|, iGlobalMaxZvuk=|" + iGlobalMaxZvuk + "|, bGlobalTedPraveHraji=|" + bGlobalTedPraveHraji + "|");
    pole1 = str.split(".wav");
    pole2 = pole1[0].split("/");
    mylang1 = pole2[pole2.length - 2];
    myword1 = pole2[pole2.length - 1];
    // stahni zvuk natvrdo this.src ze serveru 		vMluv129(lang, word); // pokud mame rozumne? Language a Word, zkus zda je treba dowload Zvuk ze serveru		
    vMyConsoleLog("onError298(), radka 00067, str=|" +str+ "|, mylang1=|" + mylang1 + "|, myword1=|" + myword1 + "|");
    vMluv129(mylang1, myword1); // stahne ze serveru
    iGlobalMaxZvuk++;
    poleGlobalVsechnyZvuky[iGlobalMaxZvuk] = str;
    if (!bGlobalTedPraveHraji) vHrajMedia();
}

function vHrajMedia() {
	var iSize=0;
	
	poleGlobalVsechnyZvuky[iGlobalCurrentZvuk] = poleGlobalVsechnyZvuky[iGlobalCurrentZvuk]  || '';
	if ( poleGlobalVsechnyZvuky[iGlobalCurrentZvuk].length < 1) {iGlobalCurrentZvuk++; return;} // if zvuk undefined do nothing
    if (iGlobalCurrentZvuk > iGlobalMaxZvuk) { // uz jsem vsechno prehrali, zacneme znovu
        iGlobalCurrentZvuk = 0;
        iGlobalMaxZvuk = -1;
        bGlobalTedPraveHraji = false;
        return; // nehraj, ne co
    }

    if (poleGlobalVsechnyZvuky[iGlobalCurrentZvuk].length > 0 && !(MinulaHodnotaPoleGlobalVsechnyZvuky == poleGlobalVsechnyZvuky[iGlobalCurrentZvuk])) { // nehraj prazdne zvuky ani minuly zvuk
        iSize = iGjkCheckFileSize77(fs_, poleGlobalVsechnyZvuky[iGlobalCurrentZvuk]);
        vMyConsoleLog("vHrajMedia(), radka 000088, iSize=|" + iSize + "|, iGlobalCurrentZvuk=|" + iGlobalCurrentZvuk + "|, zvuk=|" 
		+ poleGlobalVsechnyZvuky[iGlobalCurrentZvuk] 
		+ "|, bGlobalTedPraveHraji=|" + bGlobalTedPraveHraji + "|, iGlobalMaxZvuk=|" + iGlobalMaxZvuk + "|", 2000);
		
		if (iSize > 0 || true) {
        var my_media = new Media(poleGlobalVsechnyZvuky[iGlobalCurrentZvuk], onSuccess298, onError298);
        // Play audio

        MinulaHodnotaPoleGlobalVsechnyZvuky = poleGlobalVsechnyZvuky[iGlobalCurrentZvuk];
        poleGlobalVsechnyZvuky[iGlobalCurrentZvuk] = ""; // vynuluj current zvuk, ktery snad hrajeme ted 
        bGlobalTedPraveHraji = true;

        my_media.setVolume('1.0');
        my_media.play();
        //iSize = iGjkCheckFileSize77(fs_, poleGlobalVsechnyZvuky[iGlobalCurrentZvuk]);
        iGlobalCurrentZvuk++; // posun na dalsi zvuk 
        DBAPI.dbRow.iUrciteUzMluvilo++;

        for (m = 0; m < (iGlobalMaxZvuk + 1); m++) { // debug GJK tisk co jeste mame ve front na hrani
            vMyConsoleLog("1 onSuccess298(), radka 000107, m=|" + m + "|, poleGlobalVsechnyZvuky[]=|" 
			+ poleGlobalVsechnyZvuky[m] + "|, iGlobalCurrentZvuk=|" + iGlobalCurrentZvuk + "|, bGlobalTedPraveHraji=|" + bGlobalTedPraveHraji + "|", 7000);
        }
		poleGlobalVsechnyZvuky[iGlobalCurrentZvuk] = poleGlobalVsechnyZvuky[iGlobalCurrentZvuk]  || '';
		if ( poleGlobalVsechnyZvuky[iGlobalCurrentZvuk].length < 1) {iGlobalCurrentZvuk++; return;} // if zvuk undefined do nothing

        vMyConsoleLog("alert 1, radka 000113, poleGlobalVsechnyZvuky[" + iGlobalCurrentZvuk 
		+ "]=|" + poleGlobalVsechnyZvuky[iGlobalCurrentZvuk] + "|, iSize=|" + iSize + "|", 2000);
		poleGlobalVsechnyZvuky[iGlobalCurrentZvuk] = poleGlobalVsechnyZvuky[iGlobalCurrentZvuk]  || '';
		if ( poleGlobalVsechnyZvuky[iGlobalCurrentZvuk].length < 1) {iGlobalCurrentZvuk++; return;} // if zvuk undefined do nothing
        //alert("1 , radka 000117, vHrajMedia(), hrajeme_ted?==poleGlobalVsechnyZvuky["+iGlobalCurrentZvuk+"]=|"+poleGlobalVsechnyZvuky[iGlobalCurrentZvuk]+"|, iSize=|"+iSize+"|");
		}
		
        /*
	//document.getElementById('audio').addEventListener('ended', function(){
	my_media.addEventListener('ended', function(){
		vMyConsoleLog("my_media.addEventListener(ended), radka 57, this.src=|"+this.src+"|, iGlobalCurrentZvuk=|"+iGlobalCurrentZvuk+"|, bGlobalTedPraveHraji=|"+bGlobalTedPraveHraji+"|");
		bGlobalTedPraveHraji=false;
		vHrajMedia();     
        }, false);	
	*/

    } else {
        vMyConsoleLog("vHrajMedia(), radka 106, iGlobalCurrentZvuk=|" + iGlobalCurrentZvuk + "|, zvuk=|" + poleGlobalVsechnyZvuky[iGlobalCurrentZvuk] + "|, bGlobalTedPraveHraji=|" + bGlobalTedPraveHraji + "|");
    }

};

function onSuccess298() // sem vlezeme teprve az predchozi hrani SKONCILO !!! i to, ktere nas vola?!
    {
        var iSize = (-6);
        //iSize = iGjkCheckFileSize77(fs_, this.src);
        vMyConsoleLog("onSuccess298(), radka 000139, iSize=|" + iSize + "|, this.src=|" + this.src 
		+ "|, iGlobalCurrentZvuk=|" + iGlobalCurrentZvuk + "|, bGlobalTedPraveHraji=|" + bGlobalTedPraveHraji + "|");
        // mediaSuccess: (Optional) The callback that is invoked after a Media object has completed the current play/record or stop action. (Function)
        // http://docs.phonegap.com/en/2.1.0/cordova_media_media.md.html
        // like addEventListener ??

        //this.setVolume('1.0'); //this.play();
        vMyConsoleLog("alert 8, onSuccess298, radka 156, tohle ted dohralo->this.src=|" + this.src 
		+ "|, tohle ma ted zacit hrat->poleGlobalVsechnyZvuky[" + iGlobalCurrentZvuk + "]=|" + poleGlobalVsechnyZvuky[iGlobalCurrentZvuk] + "|");
        /*
		lert("alert 8, onSuccess298, radka 145, tohle ted dohralo->this.src=|"+this.src+"|, tohle ma ted zacit hrat->poleGlobalVsechnyZvuky["
		+iGlobalCurrentZvuk+"]=|"+poleGlobalVsechnyZvuky[iGlobalCurrentZvuk]+"|");
		*/
		MinulaHodnotaPoleGlobalVsechnyZvuky = this.src;
        this.release(); // release predchozi zvuk a Media

        if (iGlobalCurrentZvuk > iGlobalMaxZvuk) { // uz jsem vsechno prehrali, zacneme znovu
            iGlobalCurrentZvuk = 0;
            iGlobalMaxZvuk = -1;
            bGlobalTedPraveHraji = false;
        } else {
		poleGlobalVsechnyZvuky[iGlobalCurrentZvuk] = poleGlobalVsechnyZvuky[iGlobalCurrentZvuk] || '';
            if (poleGlobalVsechnyZvuky[iGlobalCurrentZvuk].length > 0 && !(MinulaHodnotaPoleGlobalVsechnyZvuky == poleGlobalVsechnyZvuky[iGlobalCurrentZvuk])) { // nehraj prazdne zvuky ani minuly zvuk
                var m, my_media = new Media(poleGlobalVsechnyZvuky[iGlobalCurrentZvuk], onSuccess298, onError298);
                // Play audio 
                poleGlobalVsechnyZvuky[iGlobalCurrentZvuk] = ""; // vynuluj current zvuk, ktery snad hrajeme ted 
                bGlobalTedPraveHraji = true;

                my_media.setVolume('1.0');
                my_media.play();
                //iSize = iGjkCheckFileSize77(fs_, poleGlobalVsechnyZvuky[iGlobalCurrentZvuk]);
                iGlobalCurrentZvuk++; // posun na dalsi zvuk
                bGlobalTedPraveHraji = true;
                DBAPI.dbRow.iUrciteUzMluvilo++;
                /*
	//document.getElementById('audio').addEventListener('ended', function(){
	my_media.addEventListener('ended', function(){
		vMyConsoleLog("my_media.addEventListener(ended), radka 92, this.src=|"+this.src+"|, iGlobalCurrentZvuk=|"+iGlobalCurrentZvuk+"|, bGlobalTedPraveHraji=|"+bGlobalTedPraveHraji+"|");
		bGlobalTedPraveHraji=false;
		vHrajMedia();     
        }, false);	
	*/
                for (m = 0; m < (iGlobalMaxZvuk + 1); m++) {
                    vMyConsoleLog("2 onSuccess298(), radka 135, m=|" + m + "|, poleGlobalVsechnyZvuky[]=|" + poleGlobalVsechnyZvuky[m] + "|, iGlobalCurrentZvuk=|" + iGlobalCurrentZvuk + "|, bGlobalTedPraveHraji=|" + bGlobalTedPraveHraji + "|", 2000);
                }
                vMyConsoleLog("alert 2, onSuccess298, radka 000185, iSize=|" + iSize + "|, poleGlobalVsechnyZvuky[" + iGlobalCurrentZvuk + "]=|" + poleGlobalVsechnyZvuky[iGlobalCurrentZvuk] + "|", 2000);
                //alert("2 onSuccess298(), radka 000185,  iSize=|"+iSize+"|, poleGlobalVsechnyZvuky["+iGlobalCurrentZvuk+"]=|"+poleGlobalVsechnyZvuky[iGlobalCurrentZvuk]+"|");
            } else {
                onError298();
            }
        }
    };

function onError298() // popostrc zvuky+1
    {
        var pole1 = [],
            pole2 = [],
            mylang1 = '',
            myword1 = '';   this.src =  this.src || ''; if (this.src.length < 1) {iGlobalCurrentZvuk++; bGlobalTedPraveHraji = false; return; } // if "undefined" this.src, do nothing 
        vMyConsoleLog("onError298(), radka 179, this.src=|" + this.src + "|, iGlobalCurrentZvuk=|" 
		+ iGlobalCurrentZvuk + "|, poleGlobalVsechnyZvuky[" + iGlobalCurrentZvuk + "]=|" + poleGlobalVsechnyZvuky[iGlobalCurrentZvuk] + "|", 9000);
        /* alert("3 onError298(), radka 167, this.src=|"+this.src
	+"|, iGlobalCurrentZvuk=|"+iGlobalCurrentZvuk+"|, poleGlobalVsechnyZvuky["
	+iGlobalCurrentZvuk+"]=|"+poleGlobalVsechnyZvuky[iGlobalCurrentZvuk]+"|"); */

        // str=|cdvfile://localhost/persistent/path/to/downloads/DATA/AUDIO/de/focusing.wav|  string.split(separator,limit)
        pole1 = this.src.split(".wav");
        pole2 = pole1[0].split("/");
        mylang1 = pole2[pole2.length - 2];
        myword1 = pole2[pole2.length - 1];
        // stahni zvuk this.src ze serveru 		vMluv129(lang, word); // pokud mame rozumne? Language a Word, zkus zda je treba dowload Zvuk ze serveru		
        vMyConsoleLog("onError298(), radka 00190, this.src=|" + this.src + "|, mylang1=|" + mylang1 + "|, myword1=|" + myword1 + "|", 9000);
        vMluv129(mylang1, myword1); // stahne ze serveru
        this.release();
        iGlobalCurrentZvuk++;
        bGlobalTedPraveHraji = false;

        if (iGlobalCurrentZvuk > iGlobalMaxZvuk) { // uz jsem vsechno prehrali, zacneme znovu
            iGlobalCurrentZvuk = 0;
            iGlobalMaxZvuk = -1;
            bGlobalTedPraveHraji = false;
        } else {
            if (!bGlobalTedPraveHraji) vHrajMedia(); // zkus hrat dalsi zvuk
        }
    }

// SELECT  rowId, w1, w2, p1, p2, a1, a2, MIN(c1), MIN(t1), st1  FROM GJK0006TABs1;

function vChangeTextOnButtonSynchronous(button_id) {
    var iPercent = 0.0,
        sql1, el = document.getElementById(button_id);
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
    //asi blbe? GJK 2014.09.19.  DBAPI.dbRow.toLang = selectOneValueFromTable10(tableName, sql1, '', 'a1', 'DBAPI.dbRow.iAudiosSyncedSoFar', vypln129);
    DBAPI.dbRow.iAudiosSyncedSoFar++;
    vMyConsoleLog(sql1);
    if (DBAPI.dbRow.iPocetSlovCelkem < 1) DBAPI.dbRow.iPocetSlovCelkem = 0.123; // deleni nulou
    iPercent = Math.round(100.0 * DBAPI.dbRow.iAudiosSyncedSoFar / DBAPI.dbRow.iPocetSlovCelkem);
    iPercent = iPercent || 0; // if iPercent == NaN then 0
    if (iPercent > 100) iPercent = 100;
    el.firstChild.data = "Synchronizing all audio files4, " + iPercent + "% done. (" + DBAPI.dbRow.iPocetSlovCelkem + ")";
    //vMyConsoleLog("vChangeTextOnButtonSynchronous(), radka 48, button_id=|"+button_id+"|, |"+iPercent+"%|, DBAPI.dbRow.iAudiosSyncedSoFar=|"+DBAPI.dbRow.iAudiosSyncedSoFar+"|");
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
        vMyConsoleLog("vChangeTextOnButtonSynchronous, radka 60, sql1=|" + sql1 + "|"); //call zzz
        // zzz DBAPI.synchronizeAudio(button_id);
    }
};

function vChangeTextOnButton2(button_id) {
    var iPercent = 0.0,
        sql1, el = document.getElementById(button_id);

    sql1 = 'SELECT COUNT(*) AS CurrentCount FROM ' + tableName + ' WHERE st1 < 998'; // 0..1000 is a word in the row 
    selectOneValueFromTable9(tableName, sql1, '', 'CurrentCount', t_h_i_s_setStatus);

    vMyConsoleLog(sql1);
    el.firstChild.data = "Dictionary synchronization. Downloaded " + DBAPI.dbRow.iPocetSlovCelkem + " words.";
    vMyConsoleLog("vChangeTextOnButton(), line 45, button_id=|" + button_id + "|, |" + el.firstChild.data + "|");
    DBAPI.dbRow.iPocetSlovCelkemMax++;
    if (DBAPI.dbRow.iPocetSlovCelkemMax < 7) { // aby to moc nerekursovalo
        if (DBAPI.dbRow.iPocetSlovCelkemOld < DBAPI.dbRow.iPocetSlovCelkem) {
            DBAPI.dbRow.iPocetSlovCelkemOld - DBAPI.dbRow.iPocetSlovCelkem;
            if (button_id) {
                if (DBAPI.dbRow.iPocetSlovCelkem < 1)
                    setTimeout(vChangeTextOnButton2(button_id), 9250);
                else setTimeout(vChangeTextOnButton2(button_id), 3250);
            } // zobrazeni % pokroku synhronizace audia, 0.250 sec 
        }
    }
};

function checkConnection() { // http://docs.phonegap.com/en/2.2.0/cordova_connection_connection.md.html
    var networkState, states = {};

    if (typeof navigator === 'undefined') {
        if (typeof navigator.connection === 'undefined') {
            if (typeof navigator.connection.type === 'undefined') {
                return null;
            } else {
                networkState = navigator.connection.type;
                states[Connection.UNKNOWN] = 'Unknown connection';
                states[Connection.ETHERNET] = 'Ethernet connection';
                states[Connection.WIFI] = 'WiFi connection';
                states[Connection.CELL_2G] = 'Cell 2G connection';
                states[Connection.CELL_3G] = 'Cell 3G connection';
                states[Connection.CELL_4G] = 'Cell 4G connection';
                states[Connection.NONE] = 'No network connection';

                //alert('Connection type: ' + states[networkState]);
                vMyConsoleLog('checkConnection(), line 39, Connection type: ' + states[networkState]);
                return states;
            };
            return null;
        }
        return null;
    } else
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

    if (DBAPI.dbRow.iUrciteUzMluvilo > iMaxUrciteUzMluvilo || DBAPI.dbRow.iSkoroUzMluvilo++ > iMaxUzSkoroMluvilo) return;

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

    resultArray1 = str.split(/\r?\n/); vMyConsoleLog("SplitAndSqlInsert(), radka 450", 0000); // vsechen input rozdel na jednotlive radky
    for (var p in resultArray1) {
        var rowId, w1, w2, p1, p2, a1, a2, c1, c2, st1, t1, t2;

        vMyConsoleLog("SplitAndSqlInsert(), radka 454, resultArray1[p]="+resultArray1[p]+"|, p=|"+p+"|", 0000); // for every line do  |0|and|und|prÃƒÆ’Ã¢â‚¬|Ã‚Â'ÃƒÆ’Ã¢â‚¬Â¹Ãƒâ€šÃ‚Âlk|http://1.mp3|http://2.mp4|3|0|7|7|conjunction|0.7316156|
        //                     1  2   3   4 == p1            5 == p2              6==a1        7==a2     8 9 0 1  12==v1      13==l1
        resultArray2 = resultArray1[p].split('|'); // split jeden radek na polozky
        rowId = mysql_real_escape_string(resultArray2[1]);
        w1 = mysql_real_escape_string(resultArray2[2]); 
        w2 = mysql_real_escape_string(resultArray2[3]);
        p1 = mysql_real_escape_string(resultArray2[4]);
        p2 = mysql_real_escape_string(resultArray2[5]);
        a1 = mysql_real_escape_string(resultArray2[6]);
        a2 = mysql_real_escape_string(resultArray2[7]);
        c1 = mysql_real_escape_string(resultArray2[8]); // count1, count good
        c2 = mysql_real_escape_string(resultArray2[9]); // count2, count bad
        st1 = mysql_real_escape_string(resultArray2[10]); // row type = 0..100 ordinary word
        t1 = mysql_real_escape_string(resultArray2[11]); // last time good
        //t2 = mysql_real_escape_string(resultArray2[12]);  // last time bad
        v1 = mysql_real_escape_string(resultArray2[12]); // word type

        if (v1) {
            v1 = v1;
        } else {
            v1 = '';
        };

        l1 = mysql_real_escape_string(resultArray2[13]); // word likelyhood 0.0 .. 0.9999, mam chybu na serveru?

        if (rowId) { // jen 'define' values
            t1 = 'INSERT INTO GJK0006TABs1(w1,w2,p1,p2,a1,a2,c1,c2,st1,v1,l1) VALUES("' + w1 + '","' + w2 + '","' + p1 + '","' + p2 + '","' + a1 + '","' + a2 + '",' + c1 + ',' + c2 + ',' + st1 + ',"' + v1 + '",' + l1 + ")";
            executeSql(t1);
            // vMyConsoleLog("GJK 2014.06.27. 16:42, nactiDataReset sql=|" + t1 + '|');
        }
    }
};

function createTable(tableName) {
    var sql;

    //sql = "CREATE TABLE IF NOT EXISTS " + tableName + "(rowId INTEGER PRIMARY KEY AUTOINCREMENT, w1, w2, p1, p2, a1, a2 TEXT NOT NULL, c1 INTEGER DEFAULT 0, c2 INTEGER DEFAULT 0, st1 INTEGER DEFAULT 0, t1, t2 TIMESTAMP)";
    //sql = "CREATE TABLE IF NOT EXISTS " + tableName + "(rowId INTEGER PRIMARY KEY AUTOINCREMENT, w1, w2, p1, p2, a1, a2 TEXT NOT NULL, c1 INTEGER DEFAULT 0, c2 INTEGER DEFAULT 0, st1 INTEGER DEFAULT 0, t1 TIMESTAMP DEFAULT 0, t2 TIMESTAMP DEFAULT 0, v1 TEXT NOT NULL DEFAULT'', l1 REAL DEFAULT 0.0, UNIQUE(w1, w2) ON CONFLICT IGNORE)";
	sql = "CREATE TABLE IF NOT EXISTS " + tableName + "(rowId INTEGER PRIMARY KEY AUTOINCREMENT, w1, w2, p1, p2 TEXT NOT NULL, a1, a2, c1, c2, st1 INTEGER DEFAULT 0, t1 TIMESTAMP DEFAULT 0, t2 TIMESTAMP DEFAULT 0, v1 TEXT NOT NULL DEFAULT'', l1 REAL DEFAULT 0.0, UNIQUE(w1, w2) ON CONFLICT IGNORE)";

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

function vypln129() {
    vMyConsoleLog("vypln129(), radka 546, iPocetSynchronizedAudioSlovCelkem=|" + DBAPI.dbRow.iPocetSynchronizedAudioSlovCelkem + "|, iPocetSlovCelkem=|" + DBAPI.dbRow.iPocetSlovCelkem + "|");
    // next
    DBAPI.dbRow.iPocetSynchronizedAudioSlovCelkem++; // omezeni background Audio synchronizeAudio, pocet vsecH slo v DB * 2 (+32 safety?)  :-) 
    if (DBAPI.dbRow.iPocetSynchronizedAudioSlovCelkem < ((DBAPI.dbRow.iPocetSlovCelkem * 2) + 32)) {
        //if (DBAPI.dbRow.iPocetSynchronizedAudioSlovCelkem < 32){ 
        // setTimeout(DBAPI.synchronizeAudio(DBAPI.dbRow.button_id), 123);
        //DBAPI.synchronizeAudio(DBAPI.dbRow.button_id); // GJK rekurze?!,  
        vMyConsoleLog("vypln129(), radka 479, BYLO A TED OPET JE, DBAPI.synchronizeAudio(DBAPI.dbRow.button_id)");
    } else vMyConsoleLog("vypln129(), radka 481, DBAPI.synchronizeAudio(DBAPI.dbRow.button_id);");
};

function vypln7129() {
    vMyConsoleLog("vypln7129(), radka 560, iPocetSynchronizedAudioSlovCelkem=|" + DBAPI.dbRow.iPocetSynchronizedAudioSlovCelkem + "|, iPocetSlovCelkem=|" + DBAPI.dbRow.iPocetSlovCelkem + "|");
    // next
    DBAPI.dbRow.iPocetSynchronizedAudioSlovCelkem++; // omezeni background Audio synchronizeAudio, pocet vsecH slo v DB * 2 (+32 safety?)  :-) 
    if (DBAPI.dbRow.iPocetSynchronizedAudioSlovCelkem < ((DBAPI.dbRow.iPocetSlovCelkem * 2) + 32)) {
        //if (DBAPI.dbRow.iPocetSynchronizedAudioSlovCelkem < 32){ 
        // setTimeout(DBAPI.synchronizeAudio(DBAPI.dbRow.button_id), 123);
        //DBAPI.synchronizeAudio(DBAPI.dbRow.button_id); // GJK rekurze?!,  
        vMyConsoleLog("vypln7129(), radka 567, BYLO A TED OPET JE, DBAPI.synchronizeAudio(DBAPI.dbRow.button_id)");
    } else vMyConsoleLog("vypln7129(), radka 569, DBAPI.synchronizeAudio(DBAPI.dbRow.button_id);");
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
    vMyConsoleLog("GJK223 sleep 1.01 sec");
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
    var snd, string, str2 = '',
        iFileSize = 0;

    //w2 = "retrieved";
    //lang = "en";

    if (w2) { // not undefined

        var path = 'DATA/AUDIO/',
            pathDir = '';

        path = path + lang + '/';
        pathDir = path;
        vMyConsoleLog("GJK, radka 446, vMluv129(lang, w2), lang=|" + lang + "|, w2=|" + w2 + "|, path=|" + path + "|");
        //vGJkCreateDirTree(fs_.root, path.split('/')); // check if exist !!!! fs.root is a DirectoryEntry.

        string = "http://opesol.org/wwwSPRT/DATA/PosliAudio.php?tl=" + lang + "&wo=" + w2 + "&so=1";
        url1 = string;

        strFileName = path + w2 + '.wav'; //filename 
        CDVstrFileName = 'cdvfile://localhost/persistent/path/to/downloads/' + strFileName;
        str2 = lang;
        str2 = str2 || '';
        if (str2.length > 1)
            cdvPrehraj129(CDVstrFileName, url1, 1); // language defined 
    } else {
        vMyConsoleLog("GJK, radka 457, vMluv129(lang, w2), lang=|" + lang + "|, w2=|" + w2 + "|, path=|" + path + "|");
    }
};

function vMluv7129(lang, w2) {
    var snd, string, str2 = '',
        iFileSize = 0;

    //w2 = "retrieved";
    //lang = "en";

    if (w2) { // not undefined

        var path = 'DATA/AUDIO/',
            pathDir = '';

        path = path + lang + '/';
        pathDir = path;
        vMyConsoleLog("vMluv7129(lang, w2), radka 686, lang=|" + lang + "|, w2=|" + w2 + "|, path=|" + path + "|", 8000);
        //vGJkCreateDirTree(fs_.root, path.split('/')); // check if exist !!!! fs.root is a DirectoryEntry.

        string = "http://opesol.org/wwwSPRT/DATA/PosliAudio.php?tl=" + lang + "&wo=" + w2 + "&so=1";
        url1 = string;

        strFileName = path + w2 + '.wav'; //filename 
        CDVstrFileName = 'cdvfile://localhost/persistent/path/to/downloads/' + strFileName;
        str2 = lang;
        str2 = str2 || '';
        if (str2.length > 1)
            cdvPrehraj129(CDVstrFileName, url1, 1); // language defined 
    } else {
        vMyConsoleLog("vMluv7129(lang, w2),, radka 699, lang=|" + lang + "|, w2=|" + w2 + "|, path=|" + path + "|", 8000);
    }
};

function vMluv(lang, w2) {
    var snd, string, iFileSize = 0;

    if (DBAPI.dbRow.iUrciteUzMluvilo > iMaxUrciteUzMluvilo || DBAPI.dbRow.iSkoroUzMluvilo++ > iMaxUzSkoroMluvilo) return;

    //w2 = "retrieved";
    //lang = "en";

    if (w2) { // not undefined

        var path = 'DATA/AUDIO/',
            pathDir = '';

        path = path + lang + '/';
        pathDir = path;
        vMyConsoleLog(" GJK 2014.07.16, vMluv(lang, w2) 331, lang=|" + lang + "|, w2=|" + w2 + "|, path=|" + path + "|");
        //vGJkCreateDirTree(fs_.root, path.split('/')); // check if exist !!!! fs.root is a DirectoryEntry.

        string = "http://opesol.org/wwwSPRT/DATA/PosliAudio.php?tl=" + lang + "&wo=" + w2 + "&so=1";
        url1 = string;

        strFileName = path + w2 + '.wav'; //filename 
        CDVstrFileName = 'cdvfile://localhost/persistent/path/to/downloads/' + strFileName;

        iFileSize = iGjkCheckFileSize(fs_, CDVstrFileName); // tam by to melo asynchrone hrat

        if (2 == 3) {
            GJKasync1 = 1;
            if (GJKasync1 == 3) {
                vMyConsoleLog("vMluv(), DBAPI.dbRow.toLang=|" + lang + '|, string=|' + string + "|");

                if (iFileSize == 0) {
                    var blob = new Blob(['Blbe Kecy'], {
                        type: 'audio/x-wav'
                    });

                    vMyConsoleLog(blob);
                    vMyConsoleLog("vMluv(), radka 668, DBAPI.dbRow.toLang=|" + lang + '|, string=|' + string + "|");

                    urlPath = string;
                    blob = DBAPI.nactiWave(string, DBAPI.dbRow.toLang, w2);

                    strFileName = path + w2 + '.wav'; //filename 

                    vMyConsoleLog("GJK vMluv(), radka 675");
                    vGJkWriteFile2(fs_, strFileName, blob); // zapis blob "string"
                };
            };

            if (iFileSize > 1024) {
                if (cordova == cordova) {
                    cdvPrehraj(CDVstrFileName, url1, 1);
                } else {
                    if (DBAPI.dbRow.iKolikMluvi == 0) {
                        //snd = new Audio(string); // buffers automatically when created
                        /*
						snd = new Audio(urlPath); // buffers automatically when created
                        vMyConsoleLog(snd);
                        snd.play(); */

                        //vPridejZvuk(urlPath);
                        vPridejZvuk2(urlPath, lang, w2);

                        DBAPI.dbRow.iKolikMluvi++;
                        vMyConsoleLog("after snd.play fn=|" + strFileName + "|, size=" + iFileSize + "|"); // was Alert
                    }; // if (jesteNeumimGJk == 3 ) {
                }
            };
        } // if( 2 == 3) {
        else {
            /*
			if (iFileSize > 1024) {
				vMyConsoleLog("vMluv(), 384,  fn=|" + CDVstrFileName + "|, size=" + iFileSize + "|"); 
				cdvPrehraj(CDVstrFileName);
			}
			else {
				vMyConsoleLog("vMluv(), 388,  fn=|" + CDVstrFileName + "|, size=" + iFileSize + "|"); 
				cdvDownloadFile(url1, CDVstrFileName); // + play
			}
			*/
            cdvPrehraj(CDVstrFileName, url1, 1);
        };
    }
};

function cdvPrehraj(file) {
    vMyConsoleLog("cdvPrehraj(), radka 546, fn=|" + file + "|"); // was Alert

    url = file;
    vPridejZvuk(file);

    /*
  // Play audio
  //
    // Play the audio file at url
    var my_media = new Media(url,
        // success callback
        function () {
            vMyConsoleLog("cdvPrehraj(), 415, Audio Success, fn="+url+"|"); 
        },
        // error callback
        function (err) {
            vMyConsoleLog("playAudio():Audio Error: " + err);
        }
    );
    // Play audio
	my_media.setVolume('1.0');
    my_media.play();
	*/


    //playFile(file);
    vMyConsoleLog("cdvPrehraj(), radka 567, fn=|" + file + "|"); // was Alert

};

function cdvPrehraj129(file, url1, iLast) {
    vMyConsoleLog("cdvPrehraj129(), radka 820, fn=|" + file + "|, last=|" + iLast + "|, url=|" + url1 + "|", 8000); // was Alert

    url = file;
    // cache audio
    //
    if (iLast == 1) {
        vMyConsoleLog("cdvPrehraj129(), radka 826, fn=|" + file + "|, last=" + iLast + "|, url=" + url1 + "|", 8000);
        cdvDownloadFile129(url1, CDVstrFileName); // + play
    }

    // Play audio
    //my_media.setVolume('1.0');
    //my_media.play();

    //playFile(file);
    vMyConsoleLog("cdvPrehraj129(), radka 835, fn=|" + file + "|", 8000); // was Alert

};

function cdvDownloadFile129(url, fileURL1) {
    // !! Assumes variable fileURL1 contains a valid URL to a path on the device,
    //    for example, cdvfile://localhost/persistent/path/to/downloads/
    //                            = adresar v interni pameti:  ulr//path/to/dovnloads/

    var iFileSize = 0,
        fileURL2 = '';

    fileURL2 = fileURL1; //fileURL2 = fileURL1.replace("cdvfile://localhost/persistent", "file:///storage/sdcard/path"); // blbe !!! harcoded stuff
    iFileSize = iGjkCheckFileSize77(fs_, fileURL2); // aaa
    vMyConsoleLog("cdvDownloadFile129(), radka 849, fileURL2=|" + fileURL2 + "|, iFileSize=" + iFileSize + "|", 8000);

	if(true) {
		 setTimeout(vGJKfileTransfer(url, fileURL2), 001); // pouzijeme Oldovo vylepseni
	}
	else {
    var fileTransfer = new FileTransfer(); // Saved file: cdvfile://localhost/persistent/path/to/downloads/DATA/AUDIO/de/unit.wav
    var uri = encodeURI(url);
    // fileURL1 = 'cdvfile://localhost/persistent/path/to/downloads/Hlas.mp3';
    vMyConsoleLog("cdvDownloadFile129(), radka 832, fileURL2=|" + fileURL2 + "|, iFileSize=" + iFileSize + "|, url=" + url + "|"); //     file:///storage/sdcard/path/to/downloads/DATA/AUDIO/en/en.wav   fileURL2=|cdvfile://localhost/persistent/path/to/downloads/DATA/AUDIO/en/retrieved.wav|

    if (iFileSize < 1 || true) {
        vMyConsoleLog("cdvDownloadFile129(), radka 835, fileURL2=|" + fileURL2 + "|, iFileSize=" + iFileSize + "|"); //     file:///storage/sdcard/path/to/downloads/DATA/AUDIO/en/en.wav   fileURL2=|cdvfile://localhost/persistent/path/to/downloads/DATA/AUDIO/en/retrieved.wav|
        fileTransfer.download(
            uri,
            fileURL2,
            function(entry) {
                //vMyConsoleLog("cdvDownloadFile129(), fileTransfer.download(), 451, download complete: |" + entry.toURL() + "|, url=" + url + "|, fileURL2="+fileURL2+"|");
                vMyConsoleLog("cdvDownloadFile129(), fileTransfer.download(), radka 841,  download complete OK: |" 
				+ entry.toURL() + "|, url=|" + url + "|, fileURL2=" + fileURL2 + "|, iFileExist=" + iFileExist + "|", 9000);
                iFileSize = iGjkCheckFileSize77(fs_, fileURL2); // aaa
                if (iFileSize < 1) {
					vMyConsoleLog("cdvDownloadFile129(), radka 845, ERROR, download complete BUT fileURL2=|" 
					+ fileURL2 + "|, iFileSize=" + iFileSize + "|, iGlobalFileSize=|"+iGlobalFileSize+"|", 2000);
				} else {
					vMyConsoleLog("cdvDownloadFile129(), radka 847, OK, download complete AND fileURL2=|" 
					+ fileURL2 + "|, iFileSize=" + iFileSize + "|,iGlobalFileSize=|"+iGlobalFileSize+"|", 2000); 
					// put iSize into DB a1 or a2
				}
			
				/* 
				/* 
				zjistit velikost lokalniho souboru se mi zatim nijak nedari GJK 2014.09.19);
				
			//window.resolveLocalFileSystemURL("file:///example.txt", onSuccess, onError);
			if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) { callback(); }; //CORDOVA error https://supportforums.blackberry.com/t5/Web-and-WebWorks-Development/Cordova-3-4-File-plugin-1-0-1-resolveLocalFileSystemURL-for/td-p/2818304
}

window.resolveLocalFileSystemURL(entry.toURL(), gotFile779, function(e) {
                // 'e' is an object, {code: 'Class not found'}
                vMyConsoleLog('cdvDownloadFile129(), OK, radka 743, byl to ALERT!!!, download complete OK?, entry.toURL()=|'+entry.toURL()+"|");  //errorHandler(e);
        });
			*/

                //alert("cdvDownloadFile129(), fileTransfer.download(), radka 624, download complete: |" + entry.toURL() + "|, url=" + url + "|, fileURL2=" + fileURL2 + "|, iFileExist=" + iFileExist + "|");
                //cdvPrehraj(fileURL2, url, 0); // 0 == uz nestahuj dalsi stejny soubor dvakrat (infinite cycle!!)
                //update SQL
            },
            function(error) {
                //•1 =  FileTransferError.FILE_NOT_FOUND_ERR  
                //•2 =  FileTransferError.INVALID_URL_ERR  
                //•3 =  FileTransferError.CONNECTION_ERR  
                //•4 =  FileTransferError.ABORT_ERR  
                //•5 =  FileTransferError.NOT_MODIFIED_ERR 

                vMyConsoleLog("cdvDownloadFile129(" + url + ", " + fileURL2 + ")," + "download error source " + error.source);
                vMyConsoleLog("cdvDownloadFile129(" + url + ", " + fileURL2 + ")," + "download error target " + error.target);
                vMyConsoleLog("cdvDownloadFile129(" + url + ", " + fileURL2 + ")," + "download error code " + error.code);
            },
            false, {
                headers: {
                    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                }
            }
        );
    } else {
        vMyConsoleLog("cdvDownloadFile129(), fileTransfer.download(), radka 635, download skiped: |" + entry.toURL() + "|, url=" + url + "|, fileURL1=" + fileURL1 + "|, iFileExist=" + iFileExist + "|, iFileSize=" + iFileSize + "|");
    }
	} // of if(true) ...else
};

function cdvDownloadFile(url, fileURL) {
    // !! Assumes variable fileURL contains a valid URL to a path on the device,
    //    for example, cdvfile://localhost/persistent/path/to/downloads/
    //                            = adresar v interni pameti:  //path/to/dovnloads/

	if (true) {
		 setTimeout(vGJKfileTransfer(url16, myFilename16), 002); // pouzijeme Oldovo vylepsenou verzi
	}
	else {
    var fileTransfer = new FileTransfer();
    var uri = encodeURI(url);
    // fileURL = 'cdvfile://localhost/persistent/path/to/downloads/Hlas.mp3';

    fileTransfer.download(
        uri,
        fileURL,
        function(entry) {
            //vMyConsoleLog("cdvDownloadFile(), fileTransfer.download(), 451, download complete: |" + entry.toURL() + "|, url=" + url + "|, fileURL="+fileURL+"|");
            iFileExist = iCheckIfFileExists(fileURL)
            vMyConsoleLog("cdvDownloadFile(), fileTransfer.download(), 453, download complete: |" + entry.toURL() + "|, url=" + url + "|, fileURL=" + fileURL + "|, iFileExist=" + iFileExist + "|");

            cdvPrehraj(fileURL, url, 0); // 0 == uz nestahuj dalsi stejny soubor dvakrat (infinite cycle!!)
        },
        function(error) {
            //•1 =  FileTransferError.FILE_NOT_FOUND_ERR  
            //•2 =  FileTransferError.INVALID_URL_ERR  
            //•3 =  FileTransferError.CONNECTION_ERR  
            //•4 =  FileTransferError.ABORT_ERR  
            //•5 =  FileTransferError.NOT_MODIFIED_ERR 

            vMyConsoleLog("download error source " + error.source);
            vMyConsoleLog("download error target " + error.target);
            vMyConsoleLog("download error code " + error.code);
        },
        false, {
            headers: {
                "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
            }
        }
    );
	}
};

function vMluv2(lang, w2) {
    var snd;

    if (DBAPI.dbRow.iUrciteUzMluvilo > iMaxUrciteUzMluvilo || DBAPI.dbRow.iSkoroUzMluvilo++ > iMaxUzSkoroMluvilo) return;

    if (w2) { // not undefined
        if (DBAPI.dbRow.iKolikMluvi == 0) {
            string = "http://translate.google.com/translate_tts?tl=" + lang + "&q=Welcome%20to%20Flash%20cards.%20%20%20version%20 0.2.3 %20%20%20you%20have%20%20" + w2 + "%20%20words%20into%20your%20local%20database"; // buffers automatically when created
            vMyConsoleLog("vMluv2(), DBAPI.dbRow.toLang=|" + lang + '|, string=|' + string + "|");
            //snd = new Audio(string); // buffers automatically when created
            //snd.play();
            DBAPI.dbRow.iKolikMluvi++;
        }
    };
};

function selectOneValueFromTable9(t1, q1, vGJKclause3, columnName, fvypln9) { // vysledek je vracen do funkce fvypln
    var s2, txt;
    var iMax = -1;
    //  vysledek volani pro funkci fvypln9(GlobalResult2)

    gjk001OpenDB();
    s2 = q1 + vGJKclause3;
    txt = "selectOneValueFromTable9(), radka 986,  s2=|" + s2 + "|, columnName=|"
	+columnName+"|, vGJKclause3=|"+vGJKclause3+"|";
    GjkDebugPrintf(9, txt);
	vMyConsoleLog(txt, 8000);
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
                    vMyConsoleLog('GJK.2014.07.03..14:06 s2=|' + s2 + '|, columnName=|' + columnName + '|');
                    vMyConsoleLog('GJK.2014.07.03..14:06 value2=|' + value2 + '|, columnName=|' + columnName + '|');
                    //vMluv2(DBAPI.dbRow.fromLang, value2);
                    vMluv2('en', value2);
                    if (value2 < 1) {
                        alert("DB ingest finished OK (radka 1013). s2="+s2+"|, Ingested " + value2 + ' words. For an empty database please go to "SETUP" and select source of your Lesson data (eg. "from http://www.opesol.org".');
                    } else {
                        alert("DB download finished OK (radka 1015) with " + value2 + " words");
                    }
                    fvypln9(GlobalResult2);
                    DBAPI.nacitam = false;
                    DBAPI.nazev = 'OK ' + value2 + ' words';
                },
                function(tx, error) {
                    txt = "GJK0306.160107z ERROR  after |" + s2 + "|, iMax=" + iMax + "|, error=" + error.message;
                    GjkDebugPrintf(3, txt);
                    alert('GJK0306.160107 Failed sql=|' + s2 + "|, error=" + error.message);
                    DBAPI.nacitam = false;
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

function vypln1392(val, variableName) { // vratil GJK 2014.07.08.
    iGlobal1392 = val;
    //alert(window["variableName"]); // to mi nefunguje 
    //DBAPI.dbRow.toLang = val;
    //alert(DBAPI.dbRow.toLang); // to mi nefunguje 
	alert("vypln1392(), radka 2633, variableName=|"+variableName+"|, val=|"+val+"|");
    return (val);
}

function selectOneValueFromTable10(t1, q1, vGJKclause4, columnName, setValName, fvypln10) { // vysledek je vracen do funkce fvypln
    var s2, txt;
    var iMax = -1,
        returnValue = '';
    //  vysledek volani pro funkci fvypln10(GlobalResult2)

    gjk001OpenDB();
    s2 = q1 + vGJKclause4;
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

                    vMyConsoleLog("DBapi.js, radka 761, selectOneValueFromTable10, returnValue=|" + returnValue + '|, columnName=|' + columnName + '|');
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
    //vMyConsoleLog("2 selectOneValueFromTable10, radka 790, returnValue=|" + returnValue + '|, columnName=|' + columnName + '|, s2='+s2+"|");
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
    nacitam: false, // probiha nacitani nove lekce
    nazev: "NIC Book 001 lesson 002",

    index: 0,


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
        iSkoroUzMluvilo: 0,
        iUrciteUzMluvilo: 0,

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
            vGJKclause5 = '';
        gjk001OpenDB();

        // openFS(this); // open local sandbox File System on client 
        // openFS2();  -- vyhodil OH 2014-09-09 file system neni treba otvirat - cordova asi vse zajisti
        //                a cteni i zapis funguji bez explicitního volani requestfilesystem ???
        // open local sandbox File System on client 
        // var fs2; 
        // onInitFs2(aGlobalFsRoot); //Uncaught TypeError: undefined is not a function 
        //openFS('<button onclick="openFS(this)">Open filesystem</button>');

        app.log("DBAPI.otevriDB ");
        vMyConsoleLog("DBAPI.otevriDB ");
        createTable(tableName);
        //t1 = "INSERT INTO GJK0006TABs1(w1,w2,p1, p2, a1, a2) VALUES('kocka', 'cat', 'kocska', 'ket', 'brr1', 'brrrr2')";
        //executeSql(t1);

        //sql1 = ' rowId, w1, w2, p1, p2, a1, a2, MIN(c1), MIN(t1), st1 ';
        //sql1 = ' rowId, w1, w2, p1, p2, a1, a2, MIN(c1), st1 ';

        sql1 = 'SELECT COUNT(*) AS CurrentCount FROM ' + tableName + ' WHERE st1 < 998'; // 0..1000 is a word in the row 
        selectOneValueFromTable9(tableName, sql1, '', 'CurrentCount', t_h_i_s_setStatus);

        sql1 = 'SELECT w1 AS w1 FROM ' + tableName + ' WHERE st1 = 4002'; // najdi zJazyka
        DBAPI.dbRow.fromLang = selectOneValueFromTable10(tableName, sql1, '', 'w1', 'DBAPI.dbRow.fromLang', vypln10); // t_h_i_s_setStatus
        vMyConsoleLog(sql1);

        sql1 = 'SELECT w2 AS w2 FROM ' + tableName + ' WHERE st1 = 4002'; // najdi doJazyka
        DBAPI.dbRow.toLang = selectOneValueFromTable10(tableName, sql1, '', 'w2', 'DBAPI.dbRow.toLang', vypln11);
        vMyConsoleLog(sql1);

        DBAPI.dbRow.nowLang = DBAPI.dbRow.fromLang;

        sql1 = "4 DBAPI.dbRow.fromLang =|" + DBAPI.dbRow.fromLang + "|, DBAPI.dbRow.toLang=|" + DBAPI.dbRow.toLang + "|, DBAPI.dbRow.nowLang=|" + DBAPI.dbRow.nowLang + "|";
        vMyConsoleLog(sql1);
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
        var vGJKclause6 = '',
            sql1;

        vMyConsoleLog("DBAPI.znam");

        // novy global vMyConsoleLog(DBAPI.result7);

        /* this.index++;
		result.slovo = result.slovo + this.index;
		result.word[0] = result.word[0] + " index: " + this.index; */

        // GJK 2014.06.25 11:11
        //t1, q1, vGJKclause6, arrayAllResults, myDiv, GlobalResult2) {
        vMyConsoleLog("660: GlobalResult2");
        vMyConsoleLog(GlobalResult2);
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
        //this.updateTable8(tableName, sql1, vGJKclause6, null);
        DBAPI.updateTable8(tableName, sql1, vGJKclause6, vypln3);
        //************************************************************
        //vMyConsoleLog('011:' + sql1);
        app.log("DBAPI.znam konec");
    },

    neznam: function()
        // neznam posledni slovo
        {
            var vGJKclause7 = '',
                sql1;

            vMyConsoleLog("DBAPI.neznam");

            /* this.index++;
		result.slovo = result.slovo + this.index;
		result.word[0] = result.word[0] + " index: " + this.index; */

            // GJK 2014.06.25 11:11
            //t1, q1, vGJKclause7, arrayAllResults, myDiv, GlobalResult2) {
            vMyConsoleLog("662: GlobalResult2");
            vMyConsoleLog(GlobalResult2);
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
            sql1 = "UPDATE " + tableName + " SET t2=(DATETIME('now')), c2=1+(SELECT c2 AS c2 FROM " + tableName + " WHERE rowId=" 
			+ iGlobalRowId + ") WHERE rowId=" + iGlobalRowId;
            //sql1 = "UPDATE " + tableName + " SET c1=0, t1=(DATETIME('now')) WHERE w1='kocka'";
            //sql1 = ' * ';
            txt = "GJK008.00013 after  updateTable8(|" + sql1 + "|)";
            GjkDebugPrintf(0, txt);
            //this.updateTable8(tableName, sql1, vGJKclause7, null);
            DBAPI.updateTable8(tableName, sql1, vGJKclause7, vypln3);
            //************************************************************
            //vMyConsoleLog('011:' + sql1);
            app.log("DBAPI.neznam ");
        },


    nactiWave: function(path, dirName, fileName) {
        // nacte nova Wave data ze serveru "path" 
        var url = path;

        vMyConsoleLog("nactiWave(), 665,  data start., dirName=|" + dirName + "|, fn=|" + fileName + "|");
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
                vMyConsoleLog(jqxhr);
                vMyConsoleLog("Je to CHYBA???, Ajax 2 error = |" + jqxhr.responseText + '|' + url);
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
        vMyConsoleLog("nactiWave ajaxOnLoad2 data done.");
        vMyConsoleLog("nactiWave ajaxOnLoad2 data end.");
        return (WaveData);
        //return;
    }, // nacti Wave

    synchronizeAudioBad: function(clicked_id) //clicked_id
        {
            var sql1 = '';
            vMyConsoleLog("synchronizeAudio(), radka 1042, clicked_id=|" + clicked_id + "|");
            vChangeTextOnButtonSynchronous(clicked_id); // zobrazeni % pokroku synhronizace audia 
            checkConnection();
            if (typeof navigator === 'undefined') {
                if (typeof navigator.connection === 'undefined') {
                    if (typeof navigator.connection.type === 'undefined') {
                        return null;
                    } else {
                        if (navigator.network.connection.type == Connection.NONE) {
                            alert("No Internet Connection!?");
                            return null;
                        } else {
                            if (navigator.network.connection.type == Connection.WIFI || navigator.network.connection.type == Connection.ETHERNET || navigator.network.connection.type == Connection.CELL_2G || navigator.network.connection.type == Connection.CELL_3G || navigator.network.connection.type == Connection.CELL_4G) {} else {
                                alert("No Internet WiFi Connection!?");
                                return null;
                            }; //alert("yescon");
                            if (clicked_id) {
                                //setTimeout(vChangeTextOnButton(clicked_id), 1123); // zobrazeni % pokroku synhronizace audia 
                            };
                            iRandom = Math.round(Math.random() + 1); // 1..iPocetSlovCelkem // abychom zamezili cyklum, budeme vybirat nahodnou radku
                            if (iRandom == 1) {
                                // we don't have audio1 
                                sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' LIMIT 1';
                            } else {
                                // we don't have audio2
                                sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' LIMIT 1';
                            }
                            iRandom = Math.round(Math.random() * DBAPI.dbRow.iPocetSlovCelkem) + 1; // 1..iPocetSlovCelkem
                            /* sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' 
			+ tableName + ' WHERE rowId = ' + iRandom + ' AND rowId <> ' + iGlobalRowId;
		*/
                            /*
		sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' 
			+ tableName + ' WHERE rowId = ' + iRandom;
			*/
                            vMyConsoleLog("synchronizeAudio(_, radka 1297, sql1=|" + sql1 + "|");
                            vGJKclause7 = '';
                            this.selectFromTable129(tableName, sql1, vGJKclause7, vypln129);
                        } // else 
                    }
                }
            } // if(typeof navigator === 'undefined'){ 
            else {
                // just to test in CHROME
                vGJKclause7 = '';
                sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE a2 <> 1 LIMIT 1';
                this.selectFromTable129(tableName, sql1, vGJKclause7, vypln129);
            };
            DBAPI.dbRow.iAudiosSyncedSoFar = DBAPI.dbRow.iPocetSlovCelkem;
            // zzz vypln129() vola async synchronizeAudio(),  setTimeout(DBAPI.synchronizeAudio(DBAPI.dbRow.button_id), 123);
        },

    synchronizeAudio: function(clicked_id) //clicked_id
        {
            var sql1 = '';
            vMyConsoleLog("synchronizeAudio(), radka 1042, clicked_id=|" + clicked_id + "|");
            vChangeTextOnButtonSynchronous(clicked_id); // zobrazeni % pokroku synhronizace audia 
            checkConnection();
            if (typeof navigator === 'undefined') {
                if (typeof navigator.connection === 'undefined') {
                    if (typeof navigator.connection.type === 'undefined') {
                        return null;
                    } else {
                        if (navigator.network.connection.type == Connection.NONE) {
                            alert("No Internet Connection!?");
                            return null;
                        } else {
                            if (navigator.network.connection.type == Connection.WIFI || navigator.network.connection.type == Connection.ETHERNET || navigator.network.connection.type == Connection.CELL_2G || navigator.network.connection.type == Connection.CELL_3G || navigator.network.connection.type == Connection.CELL_4G) {} else {
                                alert("No Internet WiFi Connection!?");
                                return null;
                            }; //alert("yescon");
                            if (clicked_id) {
                                //setTimeout(vChangeTextOnButton(clicked_id), 1123); // zobrazeni % pokroku synhronizace audia 
                            };
                            iRandom = Math.round(Math.random() + 1); // 1..iPocetSlovCelkem // abychom zamezili cyklum, budeme vybirat nahodnou radku
                            if (iRandom == 1) {
                                // we don't have audio1 
                                sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE st1 < 998 LIMIT 1';
                            } else {
                                // we don't have audio2
                                sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE st1 < 998 LIMIT 1';
                            }
                            var z;
                            for (z = 1; z < (DBAPI.dbRow.iPocetSlovCelkem + 1); z++) {
                                sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE rowId = '+z+' AND st1 < 998';
                                vGJKclause7 = '';
                                this.selectFromTable7129(tableName, sql1, vGJKclause7, vypln7129);
                            };

                        } // else 
                    }
                }

            } // if(typeof navigator === 'undefined'){ 
            else {
                // just to test in CHROME
                vGJKclause7 = '';
                //sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE rowId = 7';

				var z;
                            for (z = 1; z < (DBAPI.dbRow.iPocetSlovCelkem + 1); z++) {
                                sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE rowId = ' + z + " AND st1 < 998";
                                vGJKclause7 = '';
                                this.selectFromTable7129(tableName, sql1, vGJKclause7, vypln7129); //alert("radka 1395");
                            };

                //this.selectFromTable7129(tableName, sql1, vGJKclause7, vypln129);
            };
            DBAPI.dbRow.iAudiosSyncedSoFar = DBAPI.dbRow.iPocetSlovCelkem;
            // zzz vypln129() vola async synchronizeAudio(),  setTimeout(DBAPI.synchronizeAudio(DBAPI.dbRow.button_id), 123);
        },

	nactiDataReset: function(path, filename) {
		setTimeout(DBAPI.nactiDataReset752(path, filename), 0123); // setri Main thread, moc chudak pracuje
	}, 
	
    nactiDataReset752: function(path, filename)
        // nacte nova data ze serveru "path" a resetuje zobrazeni
        {
            var url = path;
            if (filename) url = url + filename;
            // alert("nactiDataReset -" + url + "-");  

            t1 = 'DROP TABLE IF EXISTS ' + tableName; // znic starou tabulku semafor netreba
            executeSql(t1);

            createTable(tableName); // vytvor novou tabulku

            $.ajax({
                type: "GET",
                url: url,
                success: this.ajaxOnLoad,
                error: function(data) {
                    DBAPI.nacitam = false;
                    DBAPI.nazev = "Ajax 1 error = ";
                    alert("Ajax 1 error = " + data)
                }
            });
        },

    // Response handlers.    
    ajaxOnLoad: function(text) {
        // alert("ajaxOnLoad : " + DBAPI.nacitam);         
        var title = 'GJKgetTitle(text)';

        strGloblalText = text;
        vMyConsoleLog('GJK001: Response from CORS request to : ' + title);

        //document.write("<BR>|GJK.011:inde2.html, Oldo, toto nasaje stranku |" + url + '|<HR>|'+ strGloblalText + '|');
        //vMyConsoleLog('|' + strGloblalText + '|');

        resultArray1 = strGloblalText.split(/\r?\n/); // rozhazej na jednotlive radky

        notNow3 = 1;
        if (notNow3 == 0) {
            var iKolikCelkem = 0;

            vMyConsoleLog("ajaxOnLoad(), radka 1504, resultArray1.length=|" + resultArray1.length + '|', 8000);

            if (iKolikCelkem === 0) {
                preloz3('aaaaaaa'); // prvni kick?!
            }
            for (var p in resultArray1) {
                var rowId, w1, w2, p1, p2, a1, a2, c1, c2, st1, t1, t2;

                vMyConsoleLog("ajaxOnLoad(), radka 1512, p=|"+p+'|', 8000); // for every line do 
                resultArray2 = resultArray1[p].split('|');
                rowId = mysql_real_escape_string(resultArray2[1]);
                w1 = mysql_real_escape_string(resultArray2[2]);
                w2 = mysql_real_escape_string(resultArray2[3]);
                p1 = mysql_real_escape_string(resultArray2[4]);
                p2 = mysql_real_escape_string(resultArray2[5]);
                a1 = mysql_real_escape_string(resultArray2[6]);
                a2 = mysql_real_escape_string(resultArray2[7]);
                c1 = 0;
                c2 = 0;
                st1 = 0;
                t1 = 0;
                t2 = 0;

                if (rowId) { // jen 'define' values
                    t1 = 'INSERT INTO GJK0006TABs1(w1,w2,p1,p2,a1,a2,c1,c2,st1) VALUES("' + w1 + '","' + w2 + '","' + p1 + '","' + p2 + '","' + a1 + '","' + a2 + '",' + c1 + ',' + c2 + ',' + st1 + ")";
                    //executeSql(t1);
                    //vMyConsoleLog("GJK 2014.06.27. 16:42, nactiDataReset sql=|" + t1 + '|');
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
					vMyConsoleLog("0p=|" + p + "|, iKolikCelkem=|" + iKolikCelkem + '|, iZ=|' + iZ + '|, w1=|' 
					+ indexesAskedFor[iZ]
					+ '|, indexesAskedForTotal=|' + indexesAskedForTotal + '|, w2=|' + w2 + '|');
					*/
                            indexesAskedForTotal++;
                        }
                    }
                    iKolikCelkem++;
                    vMyConsoleLog("1p=|" + p + "|, iKolikCelkem=|" + iKolikCelkem + '|, w1=|' + w1 + '|, w2=|' + w2 + '|');
                }

                vMyConsoleLog("2p=|" + p + "|, iKolikCelkem=|" + iKolikCelkem + '|, w1=|' + w1 + '|, w2=|' + w2 + '|');
            }
        } else { // if (notNow3 == 0) {
            var strLongString = '',
                sql1 = '';
            strLongString = strGloblalText;
            //preloz3(indexesAskedForZ[0]);
            vMyConsoleLog("3p=|" + p + "|, iKolikCelkem=|" + iKolikCelkem + '|, w1=|' + w1 + '|, w2=|' + w2 + '|');
            //vMyConsoleLog(text);
            SplitAndSqlInsert(strLongString);

            sql1 = 'SELECT COUNT(*) AS CurrentCount FROM ' + tableName + ' WHERE st1 < 997'; // 0..1000 is a word in the row 
            selectOneValueFromTable9(tableName, sql1, '', 'CurrentCount', t_h_i_s_setStatus); // ted spocitej vsechny radky a zobraz to	


            sql1 = 'SELECT w1 AS w1 FROM ' + tableName + ' WHERE st1 = 4002'; // najdi zJazyka
            vMyConsoleLog(sql1);
            DBAPI.dbRow.fromLang = selectOneValueFromTable10(tableName, sql1, '', 'w1', 'DBAPI.dbRow.fromLang', vypln10);

            sql1 = 'SELECT w2 AS w2 FROM ' + tableName + ' WHERE st1 = 4002'; // najdi doJazyka
            DBAPI.dbRow.toLang = selectOneValueFromTable10(tableName, sql1, '', 'w2', 'DBAPI.dbRow.toLang', vypln11);
            vMyConsoleLog(sql1);

            DBAPI.dbRow.nowLang = DBAPI.dbRow.fromLang;
            sql1 = "3 DBAPI.dbRow.fromLang =|" + DBAPI.dbRow.fromLang + "|, DBAPI.dbRow.toLang=|" + DBAPI.dbRow.toLang + "|, DBAPI.dbRow.nowLang=|" + DBAPI.dbRow.nowLang + "|";
            vMyConsoleLog(sql1);
            sql1 = 'Reading in DB OK';
            //alert(sql1); 

            return (strLongString);
        }
        vMyConsoleLog("4p=|" + p + "|, iKolikCelkem=|" + iKolikCelkem + '|, w1=|' + w1 + '|, w2=|' + w2 + '|');
        return (strOut);
    },

    dejNextSlovo: function(fvypln) {
        //app.log("DBAPI.dejNextSlovo ");
        //vMyConsoleLog("DBAPI.dejNextSlovo ");
        //  
        var vGJKclause8 = '',
            iRandom = 1,
            sql1;

        DBAPI.dbRow.iOtoc = 0; // jeste jsme neotaceli sedive okenko

        iRandom = Math.round(Math.random() * DBAPI.dbRow.iPocetSlovCelkem) + 1; // 1..iPocetSlovCelkem
        while (iGlobalRowId == iRandom) {
            iRandom = Math.round(Math.random() * DBAPI.dbRow.iPocetSlovCelkem) + 1; // 1..iPocetSlovCelkem,  nove_random <> prechozi_random
        }
        // abychom zamezili cyklum, budeme vybirat nahodnou radku

        if (DBAPI.dbRow.iUrciteUzMluvilo > iMaxUrciteUzMluvilo || DBAPI.dbRow.iSkoroUzMluvilo++ > iMaxUzSkoroMluvilo) return;

        if (DBAPI.dbRow.iDirection == 0) {

            sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE rowId <> ' + iGlobalRowId + ' AND w1 IN ( SELECT DISTINCT w1 FROM ' + tableName + ' WHERE st1 < 101 ORDER BY c2 DESC, c1 ASC LIMIT 10 )  order by c1 ASC limit 9';

            sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE rowId <> ' + iGlobalRowId + ' AND w1 IN ( SELECT DISTINCT w1 FROM ' + tableName + ' WHERE st1 < 101 ORDER BY c1 ASC LIMIT 5 )  order by t2 ASC, t1 ASC limit 2';

            sql1 = ' DISTINCT rowId AS rowId, w1 AS w1, w2 AS w2, p1 AS p1, p2 AS p2, a1 AS a1, a2 AS a2, c1 AS c1, c2 AS c2, t1 AS T1, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE rowId = ' + iRandom + ' AND rowId <> ' + iGlobalRowId + ' AND st1 < 998';

        } else {

            sql1 = ' DISTINCT rowId AS rowId, w1 AS w2, w2 AS w1, p1 AS p2, p2 AS p1, a1 AS a2, a2 AS a1, c1 AS c2, c2 AS c1, t1 AS t2, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE rowId <> ' + iGlobalRowId + ' AND w1 IN ( SELECT DISTINCT w1 FROM ' + tableName + ' WHERE st1 < 101 ORDER BY c2 DESC, c1 ASC LIMIT 10 )  order by c1 ASC LIMIT 9';

            sql1 = ' DISTINCT rowId AS rowId, w1 AS w2, w2 AS w1, p1 AS p2, p2 AS p1, a1 AS a2, a2 AS a1, c1 AS c2, c2 AS c1, t1 AS t2, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE rowId <> ' + iGlobalRowId + ' AND w1 IN ( SELECT DISTINCT w1 FROM ' + tableName + ' WHERE st1 < 101 ORDER BY c1 ASC LIMIT 5 )  order by t2 ASC, t1 ASC LIMIT 2';

            sql1 = ' DISTINCT rowId AS rowId, w1 AS w2, w2 AS w1, p1 AS p2, p2 AS p1, a1 AS a2, a2 AS a1, c1 AS c2, c2 AS c1, t1 AS t2, st1 AS st1, l1 as l1, v1 as v1 FROM ' + tableName + ' WHERE rowId = ' + iRandom + ' AND rowId <> ' + iGlobalRowId + ' AND st1 < 998';

        }

        vMyConsoleLog(sql1);

        iRandom = Math.round(Math.random() * (DBAPI.dbRow.iPocetSlovCelkem + iGlobalRowId)) + 1; // 1..iPocetSlovCelkem, zamichej random
        //sql1 = ' * ';
        txt = "GJK008.00013 after  selectFromTable13(|" + sql1 + "|)";
        GjkDebugPrintf(0, txt);
        this.selectFromTable13(tableName, sql1, vGJKclause8, fvypln);

        //************************************************************
        //vMyConsoleLog(sql1);
        return;
    },

    selectFromTable129: function(t1, q1, vGJKclause9, fvypln) {
        // vysledek je vracen do funkce fvypln
        var s2, txt;
        var iMax = -1;

        DBAPI.dbRow.selectFromTable129_iRowId = (-129);
        gjk001OpenDB();
        s2 = "SELECT " + q1 + vGJKclause9;
        txt = "GJK006.10166, 2014.07.27, 1114,  before |" + s2 + "|";
        GjkDebugPrintf(9, txt);
        vMyConsoleLog("selectFromTable129(), radka 1591, selectFromTable129(), s2=|" + s2 + "|");

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
                            vMyConsoleLog("selectFromTable129(), radka 1290,  selectFromTable129_iRowId=|" + DBAPI.dbRow.selectFromTable129_iRowId + "|");

                            vMyConsoleLog("selectFromTable129(), vypln129(), radka 1293, pred vMluv129(" + DBAPI.dbRow.fromLang + "," + DBAPI.dbRow.selectFromTable129_w1 + ");");
                            vMluv129(DBAPI.dbRow.fromLang, DBAPI.dbRow.selectFromTable129_w1); // zzz copy audio file from server to client disk
                            // now update SQL 
                            //sql1 = "UPDATE " + tableName + " SET a1=1 WHERE rowId=" + DBAPI.dbRow.selectFromTable129_iRowId;
                            //DBAPI.updateTable8(tableName, sql1, vGJKclause9, vypln3);

                            vMyConsoleLog("selectFromTable129(), vypln129(), radka 1299, pred vMluv129(" + DBAPI.dbRow.toLang + "," + DBAPI.dbRow.selectFromTable129_w2[0] + ");");
                            vMluv129(DBAPI.dbRow.toLang, DBAPI.dbRow.selectFromTable129_w2[0]); // zzz copy audio file from server to client disk
                            // now update SQL 
                            sql1 = "UPDATE " + tableName + " SET a1=1, a2=1 WHERE rowId=" + DBAPI.dbRow.selectFromTable129_iRowId;
                            DBAPI.updateTable8(tableName, sql1, vGJKclause9, vypln129);

                            if (fvypln) fvypln(DBAPI.dbRow);
                        } else {
                            vMyConsoleLog("GJK 2014.07.27, 1200, selectFromTable129(), finish, selectFromTable129_iRowId=|" + DBAPI.dbRow.selectFromTable129_iRowId + "|");
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

    selectFromTable7129: function(t1, q1, vGJKclause10, fvypln) {
        // vysledek je vracen do funkce fvypln
        var s2, txt;
        var iMax = -1;

        DBAPI.dbRow.selectFromTable129_iRowId = (-129);
        gjk001OpenDB();
        s2 = "SELECT " + q1 + vGJKclause10;
        txt = "GJK006.10166, 2014.07.27, 1114,  before |" + s2 + "|";
        GjkDebugPrintf(9, txt);
        vMyConsoleLog("selectFromTable129(), radka 1677, selectFromTable129(), s2=|" + s2 + "|");

        try {  vMyConsoleLog("selectFromTable7129(), radka 1738, s2=|" + s2 + "|", 8000);
            Gjkdb.transaction(function(tx) {
                // http://stackoverflow.com/questions/6780911/web-sql-transaction-returns-empty
                tx.executeSql(s2, [],
                    function(tx, rs) {
                        var result = []; vMyConsoleLog("selectFromTable7129(), radka 1743, selectFromTable129(), s2=|" + s2 + "|, =|"+rs.rows.length+"|", 000);
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

                        DBAPI.selectFromTable129_result7 = result;  vMyConsoleLog("selectFromTable7129(), radka 1769, selectFromTable7129(), s2=|" + s2 + "|");
                        //DBAPI.dbRow.result7.pushd("w1=" + DBAPI.dbRow.w1);
                        if (DBAPI.dbRow.selectFromTable129_iRowId > 0) {
                            vMyConsoleLog("selectFromTable7129(), radka 1772,  selectFromTable129_iRowId=|" + DBAPI.dbRow.selectFromTable129_iRowId 
							+ "|, s2=|" + s2 + "|, a1="+DBAPI.dbRow.selectFromTable129_a1+"|, a2=|"+DBAPI.dbRow.selectFromTable129_a2+"|", 8000);

                            vMyConsoleLog("selectFromTable7129(), radka 1774, pred vMluv7129(" + DBAPI.dbRow.fromLang + "," + DBAPI.dbRow.selectFromTable129_w1 + ");");
                            if (DBAPI.dbRow.selectFromTable129_a1 < 1) 
							{	vMyConsoleLog("selectFromTable7129(), radka 1777, pred vMluv7129(" + DBAPI.dbRow.fromLang + ", w1=|" 
								+ DBAPI.dbRow.selectFromTable129_w1 + "|);, a1=|"+DBAPI.dbRow.selectFromTable129_a1+"|", 8000);
								vMluv7129(DBAPI.dbRow.fromLang, DBAPI.dbRow.selectFromTable129_w1); // zzz copy audio file from server to client disk
                            }
							// now update SQL 
                            //sql1 = "UPDATE " + tableName + " SET a1=1 WHERE rowId=" + DBAPI.dbRow.selectFromTable129_iRowId;
                            //DBAPI.updateTable8(tableName, sql1, vGJKclause10, vypln3);

                            vMyConsoleLog("selectFromTable7129(), radka 1780, pred vMluv7129(" + DBAPI.dbRow.toLang + "," + DBAPI.dbRow.selectFromTable129_w2[0] + ");");
                            if (DBAPI.dbRow.selectFromTable129_a2 < 1) 
							{	vMyConsoleLog("selectFromTable7129(), radka 1787, pred vMluv7129(" + DBAPI.dbRow.toLang + ", w2=|" 
								+ DBAPI.dbRow.selectFromTable129_w2[0] + "|);, a2=|"+DBAPI.dbRow.selectFromTable129_a2+"|", 8000);
								vMluv7129(DBAPI.dbRow.toLang, DBAPI.dbRow.selectFromTable129_w2[0]); // zzz copy audio file from server to client disk
                            }// now update SQL 
                            //sql1 = "UPDATE " + tableName + " SET a1=1, a2=1 WHERE rowId=" + DBAPI.dbRow.selectFromTable129_iRowId;
                            //DBAPI.updateTable8(tableName, sql1, vGJKclause10, vypln129);

                            if (fvypln) fvypln(DBAPI.dbRow);
                        } else {  vMyConsoleLog("selectFromTable7129(), radka 1728, selectFromTable7129(), s2=|" + s2 + "|");
                            vMyConsoleLog("selectFromTable7129(), radka 1729, finish, selectFromTable129_iRowId=|" + DBAPI.dbRow.selectFromTable129_iRowId + "|");
                        };
                    },
                    function(tx, error) { vMyConsoleLog("selectFromTable7129(), radka 1732, selectFromTable7129(), s2=|" + s2 + "|");
                        txt = "GJK006.160107z ERROR  after |" + s2 + "|, iMax=" + iMax + "|, error=" + error.message;
                        GjkDebugPrintf(3, txt);
                        alert('GJK006.160107 Failed sql=|' + s2 + "|, error=" + error.message);
                        //return;
                    });

                txt = "GJK008.90002, sql=|" + s2 + "|";
                GjkDebugPrintf(77, txt);
            })
            txt = "GJK008.90003, sql=|" + s2 + "|";  vMyConsoleLog("selectFromTable7129(), radka 1742, selectFromTable7129(), s2=|" + s2 + "|");
            GjkDebugPrintf(9, txt);
        } catch (err) {  vMyConsoleLog("selectFromTable7129(), radka 1744, selectFromTable7129(), s2=|" + s2 + "|");
            alert(" catch(err), table=|" + TableName + "|, sql=|" + s2 + "|, err=" + err + "|");
        }

        txt = "GJK026.33337 selectFromTable7129() OK? after |" + s2 + "|, iMax=" + iMax + "|" + ", GlobalResult2.slovo=|" + GlobalResult2.slovo + '|';
        GjkDebugPrintf(9, txt);  vMyConsoleLog("selectFromTable7129(), radka 1808, selectFromTable7129(), s2=|" + s2 + "|", 8000);
        return;
    },

    selectFromTable13: function(t1, q1, vGJKclause11, fvypln) {
        // vysledek je vracen do funkce fvypln
        var s2, txt;
        var iMax = -1;
        if (DBAPI.dbRow.iKolikMluvi > 2) return;

        gjk001OpenDB();
        s2 = "SELECT " + q1 + vGJKclause11;
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

                        //vMyConsoleLog("001:" + s2);
                        //vMyConsoleLog(result); // tohle pise OK na consoli 2014.06.25.  22:44
                        //vMyConsoleLog(DBAPI.result7); // tohle pise OK na consoli 2014.07.08.  14:04
                        //vMyConsoleLog(DBAPI.dbRow); // tohle pise OK na consoli 2014.07.08.  14:04
                        vMyConsoleLog("selectFromTable13(), radek 1390, auto=|" + DBAPI.dbRow.automaticaudio2 + "|, kolik=|" + DBAPI.dbRow.iKolikMluvi + "|");
                        if (DBAPI.dbRow.automaticaudio2 == 1) { // zadne vstupy mluvime 
                            if (DBAPI.dbRow.iKolikMluvi == 0) {
                                if (DBAPI.dbRow.w2[0] && DBAPI.dbRow.w1) { // w2 is defined 
                                    vMyConsoleLog("1 vMluv|" + DBAPI.dbRow.fromLang + "|" + DBAPI.dbRow.w1 + "|");
                                    //vMluv(DBAPI.dbRow.fromLang, DBAPI.dbRow.w1);

                                    vMluv(DBAPI.dbRow.fromLang, DBAPI.dbRow.w1); // schedule vMluv w1 za 0.001seconds									
                                    //VeryBadSleep(3454);

                                    //setTimeout(vMluv(DBAPI.dbRow.toLang, DBAPI.dbRow.w2[0]), 3454); // 1.23 seconds
                                    //VeryBadSleep(3454);

                                    vMyConsoleLog("2 vMluv|" + DBAPI.dbRow.toLang + "|" + DBAPI.dbRow.w2[0] + "|, DBAPI.dbRow.iKolikMluvi=|" + DBAPI.dbRow.iKolikMluvi + '|, uzMluvilo=|' + DBAPI.dbRow.iSkoroUzMluvilo + '|');
                                    setTimeout(vMluv3, 1567); // schedule vMluv w2 za 2.345 seconds
                                    //setTimeout(vMluv(DBAPI.dbRow.fromLang, DBAPI.dbRow.w1), 2345); 

                                    //vMluv(DBAPI.dbRow.toLang, DBAPI.dbRow.w2[0]);
                                    //vMluv(DBAPI.dbRow.toLang, DBAPI.dbRow.w2[0]);	
                                    //alert("from=|" + DBAPI.dbRow.fromLang + '|, w1=' + DBAPI.dbRow.w1 + '|');
                                    vDvaMluv131(DBAPI.dbRow.fromLang, DBAPI.dbRow.selectFromTable129_w1, DBAPI.dbRow.toLang, DBAPI.dbRow.selectFromTable129_w2[0]); // mluv par slov najednou
                                } else {
                                    vMyConsoleLog("gjk.2014.97.12, is NOT defined!, w1=|" + DBAPI.dbRow.w1 + "|, w2=|" + DBAPI.dbRow.w2[0] + '|');
                                };
                                vMyConsoleLog("selectFromTable13(), radka 1828, WARNING!!! DBAPI.dbRow.w1=" + DBAPI.dbRow.w1 + "|, DBAPI.dbRow.w2[0]=" + DBAPI.dbRow.w2[0] + "|");
                                iRandom = Math.round(Math.random() * DBAPI.dbRow.iPocetSlovCelkem) + 1; // zamichejme random
                                setTimeout(nextAutomaticSlovo, 3456);
                            } else {
                                DBAPI.dbRow.iKolikMluvi++;
                            };
                        };

                        iRandom = Math.round(Math.random() * DBAPI.dbRow.iPocetSlovCelkem) + 1; // zamichejme random

                        vMyConsoleLog(GlobalResult2); // tohle pise OK na consoli 2014.06.25.  22:44

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

    updateTable8: function(t1, q1, vGJKclause12, fvypln) {
        // vysledek je vracen do funkce fvypln pokud je definovana
        var s2, txt;
        var iMax = -1;
        gjk001OpenDB();
        s2 = q1;
        txt = "GJK009.10166 before |" + s2 + "|";
        GjkDebugPrintf(9, txt);
        vMyConsoleLog(txt);

        try {
            Gjkdb.transaction(function(tx) {
                // http://stackoverflow.com/questions/6780911/web-sql-transaction-returns-empty
                tx.executeSql(s2, [],
                    function(tx, rs) {
                        if (fvypln) {
                            fvypln(DBAPI.dbRow);
                            txt = "updateTable8(), radka 1927, after |" + s2 + "|, iMax=" + iMax + "|";
                            vMyConsoleLog(txt);
                        } else {
                            txt = "updateTable8(), radka 1927, GJK0033.2014.07.08..160118z after |" + s2 + "|, iMax=" + iMax + "|";
                            vMyConsoleLog(txt);
                        };
                    },
                    function(tx, error) {
                        txt = "updateTable8(), radka 1937, ERROR  after |" + s2 + "|, iMax=" + iMax + "|, error=" + error.message;
                        GjkDebugPrintf(3, txt);
						vMyConsoleLog(txt, 9000);
                        alert('updateTable8(), radka 1937, Failed sql=|' + s2 + "|, error=" + error.message);
                        //return;
                    });
                txt = "GJK009.90002, sql=|" + s2 + "|";
                GjkDebugPrintf(77, txt);
                vMyConsoleLog(txt);
            })
            txt = "GJK008.90003, sql=|" + s2 + "|";
            GjkDebugPrintf(9, txt);
            vMyConsoleLog(txt);
        } catch (err) {
            alert(" catch(err), table=|" + TableName + "|, sql=|" + s2 + "|, err=" + err + "|");
            vMyConsoleLog(txt);
        }

        txt = "updateTable8(), radka 1692, GJK009.33333a selectFromTable13() OK? after |" + s2 + "|, iMax=" + iMax + "|" + ", GlobalResult2.slovo=|" + GlobalResult2.slovo + '|';
        GjkDebugPrintf(9, txt);
        vMyConsoleLog(txt);
        return;
    },

    kill: function() {
        var sql1 = '';

        sql1 = "UPDATE " + tableName + " SET st1 = 3000, t1=(DATETIME('now')), c1=1+(SELECT c1 AS c1 FROM " + tableName 
		+ " WHERE rowId=" + DBAPI.dbRow.iRowId + ") WHERE rowId=" + DBAPI.dbRow.iRowId;
        // 0..1000 normal word, 3000 killed words
        //sql1 = "UPDATE " + tableName + " SET c1=0, t1=(DATETIME('now')) WHERE w1='kocka'";
        //sql1 = ' * ';
        txt = "GJK011.00013.2014.07.09.  after  updateTable8(|" + sql1 + "|)";
        GjkDebugPrintf(0, txt);
        //this.updateTable8(tableName, sql1, '', null);
        DBAPI.updateTable8(tableName, sql1, '', vypln3);

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
            //vMyConsoleLog(pole2);
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
        vMyConsoleLog(pole1);
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
		// vGJKfileTransfer(url16, myFilename16); // pouzijeme Oldovo vylepsenou verzi vGJKfileTransfer();
        // vynuluj buffery pro zvuky
        iGlobalCurrentZvuk = 0;
        iGlobalMaxZvuk = -1;
        bGlobalTedPraveHraji = false;

        var sql1 = '';
        if (DBAPI.dbRow.fromLang.length < 2) {
            DBAPI.dbRow.fromLang = 'en';
        }

        if (DBAPI.dbRow.toLang.length < 2) { // fake GJK 2014.09.19.
            DBAPI.dbRow.toLang = 'de';
        }

        DBAPI.dbRow.iSkoroUzMluvilo = 0;
        DBAPI.dbRow.iUrciteUzMluvilo = 0;
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
                vMyConsoleLog("----s5=|" + s5 + '|');
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
                //vMyConsoleLog("----s5=|" + s5 + '|');
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

        vMyConsoleLog(DBAPI.dbRow); // DBAPI.dbRow == 'people', fromLang==nowLang=='En', toLang == 'Fr',  

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

        // vMyConsoleLog(DBAPI.result7); global na zobrazeni

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
    vMyConsoleLog("GJK 267 openFS()");
    //filer.init(false, 4*1024*1024,
    filer.init(true, 1024 * 1024,
        function(fs) {
            // GJK filer.init(true, 1024*1024, function(fs) {

            filer.readDir(function(entries) {
                var html = [];
                toArray(entries).forEach(function(entry, i) {
                    addEntryToList(entry);
                });

                vMyConsoleLog('<p>Opened file system: ' + fs.name, +'</p>');
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

        vMyConsoleLog("GJK002, requestFS, size=|" + size + '|');

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
    vMyConsoleLog("GJK001 errorHandler(), radka 1172, , e=|" + e + '|');
    vMyConsoleLog("GJK001 errorHandler(), radka 1773, e.code=|" + e.code + '|');
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
    vMyConsoleLog('GJK001 errorHandler(), radka 1773, msg=|' + msg + '|');
};

function aFilerInitOK(fs) {
    var type = window.TEMPORARY;
    //var type = persistent ? window.PERSISTENT : window.TEMPORARY;

    size = 1024 * 1024;
    vMyConsoleLog("GJK002, requestFS, size=|" + size + '|');
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
    vMyConsoleLog(fs);
    //vMyConsoleLog(fs.name);
    vMyConsoleLog('GJK onInitFs2(), line 1337, 2014.07.14.');

    //filer.init(true, 1024*1024, aFilerInitOK(fs), errorHandler);

    var Filer = window.Filer; // Option 3: Filer on global
    vMyConsoleLog(Filer);
    //Filer.init({persistent: false, size: 1024 * 1024}, aFilerInitOK(fs), errorHandler);
    //filer.init();

    /*filer.init(true, 1024*1024,
	function(fs) {// GJK filer.init(true, 1024*1024, function(fs) {
		filer.readDir(function(entries) {
			var html = [];
			toArray(entries).forEach(function(entry, i) {
			addEntryToList(entry);}	);
		vMyConsoleLog('<p>Opened file system: ' + fs.name, + '</p>');
		button.disabled = true;
		}, errorHandler);
	}, errorHandler);
    aGlobalFsRoot = fs.root; 
	fs_ = fs; // GJK
    vMyConsoleLog('04Position');
    alert("Welcome to Filesystem! It's showtime :)"+fs); // Just to check if everything is OK :)
*/
};


function openFS2() {
    //navigator.webkitPersistentStorage.requestQuota (1*1024*1024, function(grantedBytes) {
    navigator.webkitTemporaryStorage.requestQuota(1 * 1024 * 1024,
        function(grantedBytes) {
            vMyConsoleLog('GJK openFS2(), line 1368, 2014.07.14.');
            reqFS2(grantedBytes);
        }, errorHandler);
    vMyConsoleLog('GJK openFS2(), line 1371, 2014.07.14.');
}

function reqFS2(grantedBytes) {
    //window.webkitRequestFileSystem(window.PERSISTENT, grantedBytes, function(fs) {
    /*
    window.webkitRequestFileSystem(window.TEMPORARY, grantedBytes, function(fs) {
      
     vMyConsoleLog ('GJK reqFS2(), line 1316, 2014.07.14.');
        alert("Welcome to Filesystem! It's showtime :)"+fs); // Just to check if everything is OK :)
      }, errorHandler);
      */
    // http://stackoverflow.com/questions/7508770/how-to-use-filesystem-api-to-debug-javascript-the-execution-order-issue
    vMyConsoleLog('GJK reqFS2(), line 1384, 2014.07.15.');
    window.requestFileSystem(window.TEMPORARY, 1 * 1024 * 1024, function(fs) {
        fs_ = fs;
        onInitFs2(fs);
    }, errorHandler);

};

function onInitFs12(fs) { // http://www.html5rocks.com/en/tutorials/file/filesystem/?redirect_from_locale=fr
    vMyConsoleLog(fs);
    vMyConsoleLog('GJK onInitFs2(), line 1392, 2014.07.15.');
    vGJkWriteFile(fs);
};



function vGJkWriteFile(fs) {

    fs.root.getFile('log.txt', {
        create: true
    }, function(fileEntry) {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function(fileWriter) {

            fileWriter.onwriteend = function(e) {
                vMyConsoleLog('GJK onInitFs2(), 2014.07.15. line= 1468, OK! Write into the client local sandbox FS completed OK.');
                vGJkReadDir(fs);
            };

            fileWriter.onerror = function(e) {
                vMyConsoleLog('Write failed: ' + e.toString());
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

    vMyConsoleLog('GJK vGJkWriteFile2(fs), 2014.07.15. line= 1504, OK! Write into the client local sandbox FS completed OK.');
    vMyConsoleLog('GJK vGJkWriteFile2(|' + strFileName + '|, lze otevrit na http://opesol.org/HTML5/terminal/terminal.html  "cd DATA/AUIDO/em" "ls"');
    vMyConsoleLog(fs);
    fs.root.getFile(strFileName, {
        create: true
    }, function(fileEntry) {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function(fileWriter) {

            fileWriter.onwriteend = function(e) {
                vMyConsoleLog('GJK vGJkWriteFile2(), 2014.07.15. line= 1514, OK! fn=|' + strFileName + ' Write into the client local sandbox FS completed OK.');
                // get file size
                iFileSize = iGjkCheckFileSize(fs, strFileName);
                //vGJkReadDir(fs);
            };

            fileWriter.onerror = function(e) {
                vMyConsoleLog('Write failed: vGJkWriteFile2, 1522, :' + e.toString());
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

            vMyConsoleLog('GJK vGJkWriteFile2(), 2014.07.15. line= 1543, OK! fn=|' + strFileName + ' Write after fileWriter.write(blob); OK.');

        }, errorHandler);

    }, errorHandler);
};

function vGJkReadDir(fs) {
    var dirReader = fs.root.createReader();
    var entries = [];

    vMyConsoleLog('vGJkReadDir(fs), radka= 2043');

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
    vMyConsoleLog('GJK listResults(entries), 2014.07.15. line= 1444');
    // Document fragments can improve performance since they're only appended
    // to the DOM once. Only one browser reflow occurs.
    var fragment = document.createDocumentFragment();

    entries.forEach(function(entry, i) {
        var img = entry.isDirectory ? '<img src="folder-icon.gif">' :
            '<img src="file-icon.gif">';
        var li = document.createElement('li');
        //li.innerHTML = [img, '<span>', entry.name, '</span>'].join('');
        //fragment.appendChild(li);
        vMyConsoleLog("listResults(), radka 2076, GJK directory ----> entry=|" + entry.name + '|  <-----');
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
    vMyConsoleLog("onDeviceReady778(), radka 2109, strFileName=|" + GJKstrFileName + "|");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
        gotFS778(fileSystem, GJKstrFileName),
        function(e) {
            // 'e' is an object, {code: 'Class not found'}
            alert('Fail radka 2114');
            errorHandler(e);
        }
    );
};

function gotFS778(fileSystem, GJKstrFileName) {
    var fn = '/DATA/AUDIO/en/retrieved.wav';
    fn = GJKstrFileName;
    vMyConsoleLog("gotFS778(), radka 2122, fn=|" + fn + "|, fn=|" + fn + "|, GJKstrFileName=|" + GJKstrFileName + "|");
    vGJkReadDir(fileSystem);
    fs_ = fileSystem;
    // proc nasledujici radka nefunguje ??
    fileSystem.root.getFile(fn, {
            create: false,
            exclusive: false
        },
        gotFileEntry778,
        function(e) {
            // 'e' is an object, {code: 'Class not found'}
            alert('Fail radka 2130, fn=|' + fn + "|");
            errorHandler(e);
        }
    );
};

function gotFileEntry778(fileEntry, GJKstrFileName) {
    vMyConsoleLog("gotFileEntry778(), radka 2136,  GJKstrFileName=|" + GJKstrFileName + "|");
    fileEntry.file(gotFile778(file, GJKstrFileName),
        function(e) {
            // 'e' is an object, {code: 'Class not found'}
            alert('Fail radka 2141');
            errorHandler(e);
        }
    );
};

function gotFile778(file, GJKstrFileName) {
    //readDataUrl(file);
    //readAsText(file);
    vMyConsoleLog("gotFile778(), radka 2148,  GJKstrFileName=|" + GJKstrFileName + "|");
    file.getMetadata(function(metadata) {
        //alert("Metadata size=|" + metadata.size + "|, fn=|" + strFileName + "|");
        if (metadata.size > 0) {
            // snad mame dobry local WAV file
            vMyConsoleLog("gotFile778(), radka 2123, fn=|" + strFileName + "|, size=" + metadata.size + "|");
            alert("gotFile778(), radka 2124, fn=|" + strFileName + "|, size=" + metadata.size + "|");
        }
        return metadata.size;
    }, function(e) {
        // 'e' is an object, {code: 'Class not found'}
        alert('Fail radka 2159');
        errorHandler(e);
    })
};

function gotFile779(file, GJKstrFileName) {
    //readDataUrl(file);
    //readAsText(file);
    GJKstrFileName = "file:///storage/sdcard/path/to/downloads/DATA/AUDIO/en/en.wav";
    vMyConsoleLog("gotFile779(), radka 2179,  GJKstrFileName=|" + GJKstrFileName + "|");
    file.getMetadata(function(metadata) {
        //alert("Metadata size=|" + metadata.size + "|, fn=|" + GJKstrFileName + "|");
        if (metadata.size > 0) {
            // snad mame dobry local WAV file
            vMyConsoleLog("gotFile779(), radka 2184, fn=|" + GJKstrFileName + "|, size=|" + metadata.size + "|");
            //alert("gotFile779(), radka 2185, fn=|" + GJKstrFileName + "|, size=|" + metadata.size + "|");
        }
        return metadata.size;
    }, function(e) {
        // 'e' is an object, {code: 'Class not found'}
        alert('Fail radka 2291 !!!, gotFile779(), fn=|' + GJKstrFileName + "|, file=|" + file + "|");
        vMyConsoleLog('Fail radka 2291 !!!, gotFile779(), fn=|' + GJKstrFileName + "|, file=|" + file + "|");
        errorHandler(e);
        return -1;
    })
    return -1;
};

function iGjkCheckFileSize77(fs, strFileName) {
	var iLocalFileSize=0, sql1=0, pole1 = [], pole2 = [], mylang1='', myword1='', junkAAA=''
	iLocalFileSize = (+12345);
	// to je stare s pmoci Media hrani iGjkCheckFileSize78(fs, strFileName);
	vMyConsoleLog("iGjkCheckFileSize77(), radka 2597, fn=|" + strFileName + "|, iLocalFileSize=|" + iLocalFileSize + "|", 000); // 09-24 06:07:00.780: D/CordovaLog(1354): file:///android_asset/www/DBapi.js: Line 2948 : iGjkCheckFileSize77(), radka 2598, fn=|cdvfile://localhost/persistent/path/to/downloads/DATA/AUDIO/en/date.wav|, iFoo=|684|
	iGlobalFileSize = iLocalFileSize;
	
	pole1 = strFileName.split(".wav"); // zapamatuj si delku souboru "zvuk"
	pole2 = pole1[0].split("/");
	mylang1 = mysql_real_escape_string(pole2[pole2.length - 2]);
	myword1 = mysql_real_escape_string(pole2[pole2.length - 1]);
	if (mylang1 == DBAPI.dbRow.toLang) 
		sql1 = 'SELECT MAX(a2) AS aaa FROM ' + tableName + ' WHERE w2 = "'+myword1+'"';
	if (mylang1 == DBAPI.dbRow.fromLang) 
		sql1 = 'SELECT MAX(a1) AS aaa FROM ' + tableName + ' WHERE w1 = "'+myword1+'"';
	
    queryDB8164(sql1);
	if (iGlobal1392 < 0)
		vMyConsoleLog("iGjkCheckFileSize77(), ALERT!, radka 2656a, strFileName=|"+strFileName+"|, sql1=|"+sql1+"|, iGlobal1392 =|"+iGlobal1392+"|", 9000); else vMyConsoleLog("iGjkCheckFileSize77(), radka 2656b, OK, strFileName=|"+strFileName+"|, sql1=|"+sql1+"|, iGlobal1392 =|"+iGlobal1392+"|", 8000);
	iLocalFileSize = iGlobal1392;
	return iLocalFileSize;
}
// WEB local storage 2014.07.23.
// http://diveintohtml5.info/storage.html
// http://www.w3schools.com/html/html5_webstorage.asp
function iGjkCheckFileSize78(fs, strFileName) {
    var iJunk3 = 0,
        iReturn = (-9);

    // zkousim najit velikost souboru strFileName
    // http://cordova.apache.org/docs/en/2.5.0/cordova_media_media.md.html
    // var media = new Media(src, mediaSuccess, [mediaError], [mediaStatus]);

	//strFileName = strFileName.replace("cdvfile://localhost/persistent", "file:///storage/sdcard/path"); // blbe !!! harcoded stuff
	//strFileName = strFileName.replace("/storage/sdcard/path/", "");
    vMyConsoleLog("iGjkCheckFileSize78(), radka 2613, fn=|" + strFileName + "|", 1000);

    var my_media = new Media(strFileName, function() { // succes being called AFTER main body of Media, AFTER plaing stops
        var iFoo = 0; //  my_media.getDuration()
        iFoo = 1000.00 * my_media.getDuration();
        vMyConsoleLog("iGjkCheckFileSize78(), radka 2618, fn=|" + strFileName + "|, iFoo=|" + iFoo + "|", 8000); // 09-24 06:07:00.780: D/CordovaLog(1354): file:///android_asset/www/DBapi.js: Line 2948 : iGjkCheckFileSize78(), radka 2598, fn=|cdvfile://localhost/persistent/path/to/downloads/DATA/AUDIO/en/date.wav|, iFoo=|684|
        iReturn = (-3); // 09-24 08:02:01.700: D/CordovaLog(936): file:///android_asset/www/DBapi.js: Line 2961 : iGjkCheckFileSize78(), radka 2598, fn=|cdvfile://localhost/persistent/path/to/downloads/DATA/AUDIO/en/model.wav|, iFoo=|684|
        if (iFoo > 0) iReturn = iFoo;
        my_media.release();
		this.release();
		iGlobalFileSize = iReturn;
        return iReturn;
    });
    iJunk3 = 1000.00 * my_media.getDuration();
    if(iJunk3>0) vMyConsoleLog("iGjkCheckFileSize78(), radka 2627, fn=|" + strFileName + "|, iJunk3=|" + iJunk3 + "|", 8000);
    // main body my_media = new Media
   //* mam nejake media, neumim najit velikost, bud reknu velikost je (+0.01) nebo (-1)?, Mozna to vleze na OnSuccess()?,  */
	//my_media.play(); 
	iJunk3 = 1000.00*my_media.getDuration(); 
	if(iJunk3>0) vMyConsoleLog("iGjkCheckFileSize78(), radka 2632, fn=|" + strFileName + "|, iJunk3=|"+iJunk3+"|", 8000); // musim hrat jinak  my_media.getDuration() == (-1), bez my_media.play();
	my_media.stop(); 
	iJunk3 = 1000.00*my_media.getDuration(); //iJunk3 = my_media.getDuration(); // koukni na WEB
	if(iJunk3>0) vMyConsoleLog("iGjkCheckFileSize78(), radka 2635, fn=|" + strFileName + "|, iJunk3=|"+iJunk3+"|", 8000); 
    iReturn = (-2);
    if (iJunk3 > 0) iReturn = iJunk3;
	vMyConsoleLog("iGjkCheckFileSize78(), radka 2638, fn=|" + strFileName + "|, iJunk3=|" + iJunk3 + "|, iReturn="+iReturn+"|", 8000);
	//alert("iGjkCheckFileSize78(), radka 2638, fn=|" + strFileName + "|, iJunk3=|" + iJunk3 + "|, iReturn="+iReturn+"|");
    // this.release in OnSuccess?my_media.release();

    // Play audio
    //onDeviceReady788(strFileName);
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
                    vMyConsoleLog(snd);
                    snd.play();
                    DBAPI.dbRow.iKolikMluvi++;
                    vMyConsoleLog("in iGjkCheckFileSize, 1640, after snd.play fn=|" + strFileName + "|, size=" + metadata.size + "|");
                    //alert("in iGjkCheckFileSize, 1641, after snd.play fn=|" + strFileName + "|, size=" + metadata.size + "|");
                }
                return metadata.size;
            }),
            function(fileEntry) {
                vMyConsoleLog("GJK 2014.07.20, fs.root.getFile(), fileEntry.getMetaData() ERROR, 1588, iGjkCheckFileSize(), fn=|" + strFileName + "|");
                alert("Metadata ERROR size=|" + metadata.size + "|, fn=|" + strFileName + "|");
                return 0;
            }
    });
	
	if (!window.requestAnimationFrame) {
    //window.requestAnimationFrame = function (callback) { callback(); }; //CORDOVA error https://supportforums.blackberry.com/t5/Web-and-WebWorks-Development/Cordova-3-4-File-plugin-1-0-1-resolveLocalFileSystemURL-for/td-p/2818304
	} // http://www.raymondcamden.com/2014/2/17/Cordova-File-System--Important-Update
                  
	window.resolveLocalFileSystemURL(strFileName
		,
		function(file){
		    vMyConsoleLog("iGjkCheckFileSize78(), radka 2228, fn=|" + strFileName + "|");
			file.getMetadata(
				function(metadata) {
                //alert("Metadata size=|" + metadata.size + "|, fn=|" + strFileName + "|");
					if (metadata.size > 0) {
                    // snad mame dobry local WAV file
                    vMyConsoleLog("iGjkCheckFileSize78(), radka 2234, fn=|" + strFileName + "|, size=|" + metadata.size + "|");
                    alert("iGjkCheckFileSize78(), radka 2234, fn=|" + strFileName + "|, size=|" + metadata.size + "|");
					}
					return metadata.size;
				}, function(e) {
                // 'e' is an object, {code: 'Class not found'}
                alert('Fail radka 2239'); errorHandler(e);
				return -1;
            }
			)	
			vMyConsoleLog("iGjkCheckFileSize78(), radka 2244, fn=|" + strFileName + "|");			
			return -1;
		}		
		,
		function(e) {
                // 'e' is an object, {code: 'Class not found'}
			vMyConsoleLog("iGjkCheckFileSize78(), radka 2250, fn=|" + strFileName + "|, size=|" + metadata.size + "|");
            alert('cdvDownloadFile129(), OK, radka 2251, entry.toURL()=|'+entry.toURL()+"|"); errorHandler(e);
        }		
	);
	*/

    vMyConsoleLog("iGjkCheckFileSize78(), radka 2703, fn=|" + strFileName + "|, iJunk3=|" + iJunk3 + "|, iReturn=|" + iReturn + "|", 8000);

    return iReturn;
};

function iGjkCheckFileSize(fs, strFileName) {
	
    return iGjkCheckFileSize77(fs, strFileName);

    function success2(file) {
        var iSize = 0;
        iSize = file.size
        vMyConsoleLog("iGjkCheckFileSize(), 1763, File size: " + iSize);
        return iSize;
    }

    function fail2(error) {
        alert("1768, Unable to retrieve file properties: " + error.code);
        return (-1);
    }

    function success(entry) {
        vMyConsoleLog("GJK 2014.07.25, iGjkCheckFileSize(),  1772, iGjkCheckFileSize(), success(), fn=|" + entry + "|");
        // obtain properties of a file
        entry.file(success2, fail2);

        return (-1);
    }

    function fail(error) {
        //alert("Unable to retrieve file properties: " + error.code);
        return (-1);
    }

    vMyConsoleLog("iGjkCheckFileSize(), radka 2497, fn=|" + strFileName + "|");

    if (1 == 2) {
        fs.root.getFile(strFileName, {
                cretate: false
            },
            //fs.root.getFile(strFileName, {cretate: true, exclusive: true}, 
            //fs.root.getFile(strFileName, {},

            success(fileEntry),

            function(fileEntry) {
                vMyConsoleLog("GJK 2014.07.20, fs.root.getFile(), fileEntry.getMetaData() ERROR, 1779, iGjkCheckFileSize(), fn=|" + strFileName + "|");
                return (-1);
            }
        );
    } else {
        success(strFileName);
    }
    vMyConsoleLog("GJK 2014.07.20, 1590, iGjkCheckFileSize(), fn=|" + strFileName + "|");
    return (-1);
};

function vGJkGetMetadata1(fileEntry) {
    // Get a File object representing the file,
    // fileEntry.isFile === true
    // fileEntry.neme == strFileName
    // fileEntry.duleePath == "?StrFileName"	
    vMyConsoleLog("GJK 2014.07.20, 1581, iGjkCheckFileSize() before fileEntry.getMetaData() , fn=|" + strFileName + "|");
    fileEntry.getMetaData(

        vGJkGetMetadata2(md),

        function(fileEntry) {
            vMyConsoleLog("GJK 2014.07.20, ERROR, 1586, iGjkCheckFileSize(), fn=|" + strFileName + "|");
        });

};

function vGJkGetMetadata2(md) {
    vMyConsoleLog(md);
    vMyConsoleLog("GJK 2014.07.20, 1595, vGJkGetMetadata(" + strFileName + ") OK, time=|" +
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

    vMyConsoleLog('GJK vGJkCreateDirTree(fs), 2014.07.15. line= 1566, OK!');

    // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
    if (folders[0] == '.' || folders[0] == '') {
        folders = folders.slice(1);
    }
    rootDirEntry.getDirectory(folders[0], {
        create: true
    }, function(dirEntry) {
        vMyConsoleLog('GJK vGJkCreateDirTree(|' + folders[0] + '|, 2014.07.15. line= 1818, directory created OK!');

        // Recursively add the new subfolder (if we still have another to create).
        if (folders.length) {
            vMyConsoleLog('GJK vGJkCreateDirTree(|' + folders.slice(1) + '|, 2014.07.15. line= 1822, OK!');

            vGJkCreateDirTree(dirEntry, folders.slice(1));
        }
    }, errorHandler);
};

function vDvaMluv131(fromLang, w1, toLang, w2) { // mluv par slov najednou
    var path = 'DATA/AUDIO/',
        pathDir = '',
        CDVstrFileName = '',
        word = '',
        iFileSize = 0,
        urlPath = '';

	if (poleDvaUzMluvilo1[fromLang] == w1 && poleDvaUzMluvilo2[toLang] == w2) {
		vMyConsoleLog("vDvaMluv131(), radka 002856, vMluv129(lang, word), uz jsme tenet0 par zvuku mluvili!!,  lang=|" + lang + "|, word=|" + word + "|, path=|" + pathDir + "|", 8000);
		return;
	}
	poleDvaUzMluvilo1[fromLang] = w1;
	poleDvaUzMluvilo2[toLang] = w2; 
    lang = fromLang;
    word = w1;
    pathDir = path + lang + '/';
    vMyConsoleLog("vDvaMluv131(), radka 579, vMluv129(lang, word), lang=|" + lang + "|, word=|" + word + "|, path=|" + pathDir + "|");
    strFileName = pathDir + word + '.wav'; //filename 
    CDVstrFileName = 'cdvfile://localhost/persistent/path/to/downloads/' + strFileName;
    //CDVstrFileName = CDVstrFileName.replace("cdvfile://localhost/persistent", "file:///storage/sdcard/path"); // blbe !!! harcoded stuff

    iFileSize = iGjkCheckFileSize(fs_, CDVstrFileName);
    if (iFileSize < 1) {
        vMluv129(lang, word); // pokud mame rozumne? Language a Word, zkus zda je treba dowload Zvuk ze serveru			
        return; // 2014.09.20.
    }

    lang = toLang;
    word = w2;
    pathDir = path + lang + '/';
    vMyConsoleLog("vDvaMluv131, radka 589, vMluv129(lang, word), lang=|" + lang + "|, word=|" + word + "|, path=|" + pathDir + "|");
    strFileName = pathDir + word + '.wav'; //filename 
    CDVstrFileName = 'cdvfile://localhost/persistent/path/to/downloads/' + strFileName;
    CDVstrFileName = CDVstrFileName.replace("cdvfile://localhost/persistent", "file:///storage/sdcard/path"); // blbe !!! harcoded stuff

    iFileSize = iGjkCheckFileSize(fs_, CDVstrFileName);
    if (iFileSize < 1) {
        vMluv129(lang, word); // pokud mame rozumne? Language a Word, zkus zda je treba dowload Zvuk ze serveru			
        return; // 2014.09.20.
    }

    // now we have both local audio files greater than 0
    //vMluv129(fromLang, w1);
    //vMluv129(toLang, w2);
    urlPath = CDVstrFileName; // pokud uz dvojici nemame!
    vPridejZvuk2(urlPath, fromLang, w1);
    vPridejZvuk2(urlPath, toLang, w2);
    alert("9, vDvaMluv131(), radka 002895, vDvaMluv131(" + fromLang + ", " + w1 + ", " + toLang + ", " + w2 + ")");
};

/**
 * FiledownloadResult
 */
FiledownloadResult = function() {
    this.bytesSent = 0;
    this.responseCode = null;
    this.response = null;
}

/**
 * FileTransferError
 */
FileTransferError = function(errorCode) {
    this.code = errorCode || null;
}

FileTransferError.FILE_NOT_FOUND_ERR = 1;
FileTransferError.INVALID_URL_ERR = 2;
FileTransferError.CONNECTION_ERR = 3;

var vGJKfileTransferWin3 = function (rEntry) { // rEntry je open? file object?
		console.log(console); 
		console.dir(rEntry); // to je hezke !!!
		/*
		http://docs.phonegap.com/en/1.4.1/phonegap_file_file.md.html
		File Object 
		name: The name of the FileEntry, excluding the path leading to it. (DOMString)
		fullPath: The full absolute path from the root to the FileEntry. (DOMString)
		NOTE: The following attributes are defined by the W3C specification, but are not supported by PhoneGap:

		filesystem: The file system on which the FileEntry resides. (FileSystem)

		Methods:

getMetadata: Look up metadata about a file.
moveTo: Move a file to a different location on the file system.
copyTo: Copy a file to a different location on the file system.
toURI: Return a URI that can be used to locate a file.
remove: Delete a file.
getParent: Look up the parent directory.
createWriter: Creates a FileWriter object that can be used to write to a file.
file: Creates a File object containing file properties.
*/
		var path = rEntry.toInternalURL(); vMyConsoleLog("win3(), radka 2979, iGlobalFileSize=|" +iGlobalFileSize+"|, path="+path+"|", 8000);//**THIS IS WHAT I NEED**
		rEntry.getMetadata(
			  function(Success_getMetadata) {
				var iLocalFileSize=0, sql927='', pole1 = [], pole2 = [], mylang1='', myword1='';
				iLocalFileSize = Success_getMetadata.size; 
				console.log(Success_getMetadata);
				
				pole1 = path.split(".wav"); // zapamatij si delku souboru zvuk
				pole2 = pole1[0].split("/");
				mylang1 = mysql_real_escape_string(pole2[pole2.length - 2]);
				myword1 = mysql_real_escape_string(pole2[pole2.length - 1]);
				if (mylang1 == DBAPI.dbRow.toLang) 
					sql927 = "UPDATE " + tableName + " SET a2= "+iLocalFileSize+' WHERE w2= "' + myword1+'"';
				if (mylang1 == DBAPI.dbRow.fromLang) 
					sql927 = "UPDATE " + tableName + " SET a1= "+iLocalFileSize+' WHERE w1= "' + myword1+'"'; 					
				DBAPI.updateTable8(tableName, sql927, '', vypln3);
	
				vMyConsoleLog("vGJKfileTransferWin3(), radka 2915, iLocalFileSize=|" + iLocalFileSize+"|, path=|"+path+
				+"|, rEntry.name=|"+rEntry.name+"|, rEntry.fullPath=|"+rEntry.fullPath+"|, rEntry.filesystem=|"+rEntry.filesystem+"|", 0000);
				/*
				alert("vGJKfileTransferWin3(), radka 2915, iLocalFileSize=|" + iLocalFileSize
				+"|, rEntry.name=|"+rEntry.name+"|, rEntry.fullPath=|"+rEntry.fullPath+"|, rEntry.filesystem=|"+rEntry.filesystem+"|");
				*/
				iGlobalFileSize = iLocalFileSize;
				},
			  function(Error_getMetadata){
				console.dir(); 
				iGlobalFileSize=(-9);
				vMyConsoleLog("vGJKfileTransferWin3(), radka 002950, ERROR! failed rEntry.getMetadata(), path="+path+"|, rEntry.name=|"
				+rEntry.name+"|, rEntry.fullPath=|"+rEntry.fullPath+"|, rEntry.filesystem=|"+rEntry.filesystem+"|", 9000);
				/* alert("vGJKfileTransferWin3(), radka 002950, ERROR! failed rEntry.getMetadata(), path="+path++"|, rEntry.name=|"
				+rEntry.name+"|, rEntry.fullPath=|"+rEntry.fullPath+"|, rEntry.filesystem=|"+rEntry.filesystem+"|"); */
			  }
		);
 	
		vMyConsoleLog("vGJKfileTransferWin3(), radka 3014, iGlobalFileSize=|" +iGlobalFileSize+"|, path="+path+"|", 8000);
		//alert("path, radka 2880, size " + path + ", iGlobalFileSize=" +iGlobalFileSize+"|"); 
}

var vGJKfileTransferFail3 = function (error) {
    /*
	alert("GKJ FileTransfer(), ERROR., An error has occurred: Code = " + error.code+", source=|"
	+error.source+"|, target=|"+error.target+"|");
    */
	console.log("vGJKfileTransferFail3(), radka 2959, ERROR!, GKJ download error source " + error.source);
    console.log("vGJKfileTransferFail3(), radka 2960, ERROR!, GKJ download error target " + error.target);
	vMyConsoleLog("vGJKfileTransferFail3(), radka 2961, GKJ FileTransfer(), ERROR!, An error has occurred: Code = " + error.code+", source=|"
	+error.source+"|, target=|"+error.target+"|", 9000);
	vMyConsoleLog("vGJKfileTransferFail3(), radka 2963, ERROR!, 2 GKJ  FileTransfer(), ERROR!",9000);
}

/*
var options3 = new FiledownloadOptions();
options.fileKey = "file";
//options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
//options.mimeType = "text/plain";
*/

function vGJKfileTransfer(url16, myFilename16) {
 
 /* var options = new FileDownloadOptions();
            options.fileKey="file";
            //options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
            //options.mimeType="image/jpeg";

            var params = {};
            params.value1 = "test";
            params.value2 = "param";

            options.params = params;
	*/
	
	vMyConsoleLog("vGJKfileTransfer(), radka 3051, url16=|"+url16+"|, myFilename16=|"+myFilename16+"|" , 9000);
	file1 = "http://www.rangde.org/static/bell-ring-01.mp3";
	file2 = "file:///storage/sdcard/path";
	file2 = "hobl.test1.file.transfer.mp3";
	file2 = "cdvfile:///localhost/persistent/path/to/downloads/hobl.test1.file.transfer.mp3"; //  "///" nefunguje: URI not supported by CordovaResourceApi: cdvfile:///localhost/persistent/path/to/downloads/hobl.test1.file.transfer.mp3
	file2 = "cdvfile:///localhost/persistent/path/to/downloads/hobl.test1.file.transfer.mp3";
	file2 = "file:///storage/sdcard/path/to/downloads/hobl.test1.file.transfer.mp3";
	file2 = "cdvfile://localhost/persistent/path/to/downloads/hobl.test1.file.transfer.mp3";

/*

file:///storage/sdcard/path/to/downloads/hobl.test1.file.transfer.mp3
==
path=|cdvfile://localhost/persistent/path/to/downloads/hobl.test1.file.transfer.mp3|

*/
	var uri = encodeURI(url16), 
	fileURL = uri;
    var fileTransfer = new FileTransfer();
    var myFilename = "hobl.test1.file.transfer.mp3"; // 09-22 05:11:20.990: D/CordovaLog(1579): file:///android_asset/www/cordova.js: Line 1046 : processMessage failed: Message: F06 FileTransfer315394261 {"target":"hobl.test1.file.transfer.mp3","http_status":200,"code":1,"source":"http:\/\/www.rangde.org\/static\/bell-ring-01.mp3","exception":"\/hobl.test1.file.transfer.mp3: open failed: EROFS (Read-only file system)"}

	myFilename = "cdvfile://hobl.test1.file.transfer.mp3"; // 09-22 05:26:47.510: D/CordovaLog(911): file:///android_asset/www/cordova.js: Line 1046 : processMessage failed: Message: F06 FileTransfer1974272970 {"target":"cdvfile:\/\/hobl.test1.file.transfer.mp3","http_status":200,"code":1,"source":"http:\/\/www.rangde.org\/static\/bell-ring-01.mp3","exception":"URI not supported by CordovaResourceApi: cdvfile:\/\/hobl.test1.file.transfer.mp3"}
	myFilename = "cdvfile://localhost/persistent/path/to/downloads/hobl.test1.file.transfer.mp3"; // 09-22 06:01:46.850: D/CordovaLog(1617): file:///android_asset/www/cordova.js: Line 1046 : processMessage failed: Message: S01 FileTransfer846206641 {"fullPath":"\/path\/to\/downloads\/hobl.test1.file.transfer.mp3","filesystemName":"persistent","isDirectory":false,"nativeURL":"file:\/\/\/storage\/sdcard\/path\/to\/downloads\/hobl.test1.file.transfer.mp3","filesystem":1,"isFile":true,"name":"hobl.test1.file.transfer.mp3"}
	myFilename = file2;

    //fileTransfer.download(uri, myFilename,  vGJKfileTransferWin3, vGJKfileTransferFail3, options3);
	//fileTransfer.download(uri, myFilename,  vGJKfileTransferWin3, vGJKfileTransferFail3, options, true);
    fileTransfer.download(uri, myFilename16,  vGJKfileTransferWin3, vGJKfileTransferFail3, false, true);
	
	vMyConsoleLog("3 vGJKfileTransfer end");
	//alert("3 vGJKfileTransfer end");
};

  
    // Query the database
    //
    function queryDB8164(sql2) {
	try {
		vMyConsoleLog("queryDB8164(), radka 3079, sql2=|"+sql2+"|"); // http://stackoverflow.com/questions/6780911/web-sql-transaction-returns-empty
        Gjkdb.transaction(function(tx) {
			tx.executeSql(sql2, [], querySuccess8164, errorCB8164);
		}
		);
	} catch (err) { vMyConsoleLog("queryDB8164(), radka 3085, catch(err), table=|" + TableName + "|, sql2=|" + sql2 + "|, err=" + err + "|", 9000);
        alert("queryDB8164(), radka 3085, catch(err), table=|" + TableName + "|, sql2=|" + sql2 + "|, err=" + err + "|");
    }
    }

    // Query the success callback
    //
    function querySuccess8164(tx, results) {
        var len = results.rows.length, iZ=0; console.dir(results); console.dir(results.rows); console.dir(results.rows.item);console.dir(results.rows.item(0).aaa);
        console.log("querySuccess8164(), radka 3093, DEMO table: " + len + " rows found.");
        for (var i=0; i<len; i++){ iZ=results.rows.item(i).aaa; if (isNaN(iZ)) iZ = (-14);
            vMyConsoleLog("querySuccess8164(), radka 3095, Row = " + i + " ID = " + iZ + " Data =  " + iZ);
			iGlobal1392 = iZ
			if (isNaN(iZ)) iGlobal1392 = (-15);
			return(iGlobal1392);
        }
    }

    // Transaction error callback
    //
    function errorCB8164(err) {
        vMyConsoleLog("querySuccess8164(), radka 3093, Error processing SQL: "+err.code, 9000);
    }
	
function mysql_real_escape_string(str) { 
	str = str || ''; 
	if (str.len < 1) return (str);
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}

var CUBRID_RDBMS_escapeString = function (val) { return val; // nedelej nic !!!
  val.replace(/[\0\n\r\b\t\\\'\"\x1a]/g, function (s) {
    switch (s) {
      case "\0":
        return "\\0";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\b":
        return "\\b";
      case "\t":
        return "\\t";
      case "\x1a":
        return "\\Z";
      default:
        return "\\" + s;
    }
  });

  return val;
};

function vMyConsoleLog(str, severity){
	severity = severity || 0; // kdyz neni definovanova, prodpokladejme, ze severity (vaznost chyby) == 0
	if (severity > 1000) {	
		console.log(str);
	}
}
/*
09-24 06:07:00.780: D/CordovaLog(1354): file:///android_asset/www/DBapi.js: Line 2948 : iGjkCheckFileSize77(), radka 2598, fn=|cdvfile://localhost/persistent/path/to/downloads/DATA/AUDIO/en/date.wav|, iFoo=|684|

09-24 08:00:21.910: D/dalvikvm(465): GC_FOR_ALLOC freed 514K, 16% free 3203K/3792K, paused 22ms, total 30ms
09-24 08:00:22.730: D/dalvikvm(465): GC_FOR_ALLOC freed 512K, 16% free 3202K/3792K, paused 23ms, total 28ms
09-24 08:00:23.520: D/dalvikvm(465): GC_FOR_ALLOC freed 521K, 16% free 3193K/3792K, paused 24ms, total 31ms
09-24 08:00:24.690: D/dalvikvm(465): GC_FOR_ALLOC freed 519K, 16% free 3186K/3792K, paused 21ms, total 25ms
09-24 08:00:25.010: E/MediaScannerJNI(465): An error occurred while scanning file '/storage/sdcard/path/to/downloads/DATA/AUDIO/fr/à moins de.wav'.
09-24 08:00:25.260: E/MediaScannerJNI(465): An error occurred while scanning file '/storage/sdcard/path/to/downloads/DATA/AUDIO/fr/tout à fait.wav'.
09-24 08:00:26.260: E/MediaScannerJNI(465): An error occurred while scanning file '/storage/sdcard/path/to/downloads/DATA/AUDIO/fr/à eux.wav'.
09-24 08:00:26.300: E/MediaScannerJNI(465): An error occurred while scanning file '/storage/sdcard/path/to/downloads/DATA/AUDIO/fr/groupe de travail.wav'.
09-24 08:00:26.920: D/dalvikvm(465): GC_FOR_ALLOC freed 484K, 16% free 3213K/3792K, paused 32ms, total 38ms
09-24 08:00:27.260: E/MediaScannerJNI(465): An error occurred while scanning file '/storage/sdcard/path/to/downloads/DATA/AUDIO/fr/au dehors.wav'.
09-24 08:00:28.000: D/dalvikvm(465): GC_FOR_ALLOC freed 503K, 16% free 3222K/3800K, paused 23ms, total 25ms
09-24 08:00:28.230: E/MediaScannerJNI(465): An error occurred while scanning file '/storage/sdcard/path/to/downloads/DATA/AUDIO/fr/système économique.wav'.
09-24 08:00:28.740: D/dalvikvm(465): GC_FOR_ALLOC freed 492K, 15% free 3241K/3808K, paused 23ms, total 26ms
09-24 08:00:28.940: E/MediaScannerJNI(465): An error occurred while scanning file '/storage/sdcard/path/to/downloads/DATA/AUDIO/fr/mot de passe.wav'.
09-24 08:00:29.730: D/dalvikvm(465): GC_FOR_ALLOC freed 527K, 16% free 3226K/3828K, paused 27ms, total 30ms
09-24 08:00:29.810: I/MediaFocusControl(377):  AudioFocus  abandonAudioFocus() from android.media.AudioManager@b2d13630com.android.music.MediaPlaybackService$3@b2d124b0
*/
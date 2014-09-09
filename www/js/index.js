/*


 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        ProgramReady();
    },
    // Bind Event Listeners
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('messagestxt');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var ele = document.getElementById(id);
        $("#messagestxt").html('Received Event 1 ');
        console.log('Received Event: ' + id + " device.cordova : " + device.cordova);
        var s = 'Device Name: '     + device.name     + '<br />' +
                            'Device Cordova: '  + device.cordova  + '<br />' +
                            'Device Platform: ' + device.platform + '<br />' +
                            'Device UUID: '     + device.uuid     + '<br />' +
                            'Device Model: '    + device.model    + '<br />' +
                            'Device Version: '  + device.version  + '<br />';
         $("#vercor").html(s);
         
         //*** inicializace fileSystemu
         initFileSystem();        
    },
    log: function(textik){  
      $("#logtxt").append("<div>"+textik+"</div>");  
    }
};


function showFile(fname){
    app.log("Show file:: " + fname);
    window.resolveLocalFileSystemURL(fname, cbSuccess, cbFail);

var fileXML = loadXMLDoc(fname);
app.log("loadXMLDoc " + fileXML);


    
};

function cbSuccess(dirEntry){
    alert("Succes - " + dirEntry);
    alert("Succes 2 - " + dirEntry.toURL());
    alert("Succes 3 - " + dirEntry.toNativeURL());
   
    
};

function cbFail(fileError){
    alert("cbFail - " + fileError);
};

function showFileExternal(){
    alert("File external - " +  cordova.file.applicationStorageDirectory );
};

/*
  filesystem
    pro Chrome a Android 
    v aplikaci KATVOZ a KATVOZSYNC
  
*/
 var fileSystem = null;   //  preddefinovany v onDeviceReady()    
 var parentDir;
 

//****************************************
//***************  file system  ******************************************
//
function initFileSystem(){
    // ***** otevreni file systemu do globalku fileSystem
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fs) {
              fileSystem = fs;
               app.log("File System : " + fileSystem.name);  // obvykle persistent
              // Get the data directory, creating it if it doesn't exist.
              var dataDir = fs.root.getDirectory(parentDirName, {create: true}, 
                            function(parent) {
                               app.log("Uspech parentDir " + parent);
                               parentDir = parent; // sup do globalku
                               // allReady(); // po inicializaci vseho
                            }, 
                            
                            function(error) {app.log("Failed directory  " + parentDirName +
                                             " code: " + error.code)
                                             }
                            );
                // alert("Data dir : " + dataDir);  // 
              },                                        
              errorFileHandler
            );     
    // alert("window.webkitRequestFileSystem");
    //window.webkitRequestFileSystem(PERSISTENT, 0,
    //      function(fs) {fileSystem = fs;
    //      alert("Zapis fileSystem: " + fileSystem);},                                        
    //      errorFileHandler
    //       );    

    
}
function errorFileHandler(e) {
    var msg = '';
    switch (e.code) {
      case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
        break;
      case FileError.NOT_FOUND_ERR:
        msg = 'NOT_FOUND_ERR';
        break;
      case FileError.SECURITY_ERR:
        msg = 'SECURITY_ERR';
        break;
      case FileError.INVALID_MODIFICATION_ERR:
        msg = 'INVALID_MODIFICATION_ERR';
        break;
      case FileError.INVALID_STATE_ERR:
        msg = 'INVALID_STATE_ERR';
        break;
      default:
        msg = 'Unknown Error';
        break;
    };

    alert('Err file: ' + fileSystem + " msg=" + msg + "  code=" + e.code);
    }



 function zapisDoSouboru(filename) 
  {
     // alert("fileSystem = " + fileSystem);
     fileSystem.root.getFile(filename, {create: true}, gotFileEntry, fail);
  }
  function gotFileEntry(fileEntry)
  {
     fileEntry.createWriter(gotFileWriter, fail);    
  }    
  function gotFileWriter(writer)
  {      
      writer.onwrite = function(evt)
                  {            
                          console.log("write success");     
                  };
                 writer.write(outData);
                 // writer.write("NICCCC");
  // contents of file now 'some sample text'
  }    

  function fail(error)
  {
    alert("fail-write-file " + error.code);
      console.log("fail-write-file " + error.code);
  }


//****************************************

function checkConnection() {
    
    alert("check:" + navigator.connection.type);
    alert("check1:" + Connection.UNKNOWN);
    alert("check2:" + Connection.ETHERNET);
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    alert('Connection type: ' + states[networkState]);
}


function showPath()
{
    // alert("parentDir = " + parentDir );
    document.getElementById('seznamB3').innerHTML = 
           'AdresĂˇĹ™ s daty: ' + parentDir.name + "<br/>"
        + 'fullpath: ' + parentDir.fullPath + "<br/>"
          
          ;
    
    
}

function zapisSoubor()
{
    alert(":zapisSoubor")
    parentDir.getFile("test.txt", {create:true}, appendFile, onError);
    
}


function appendFile(f) {

    f.createWriter(function(writerOb) {
        writerOb.onwrite=function() {
           // log("Done writing to file.<p/>");
        }
        //go to the end of the file...
        writerOb.seek(writerOb.length);
        writerOb.write("Test at "+new Date().toString() + "\n");
    })

}

function doAppendFile(e) {
    fileSystem.root.getFile("test.txt", {create:true}, appendFile, onError);
} 

//generic error handler
function onError(e) {
  alert("Error : "+e.toString());
}


//
//
function zobrazAdresar(idkam)
{
    
}


/**
 * ovladani AUDIO v PhoneGap
 * 
 */

// *******************************
var myPLAY = 1;
var mySTOP = 2;
var myREPEAT = 3;
var myNONE = 0;

var audistav = 0;
var audioFile = "XXXXXX";
var audioPopis = "YYYYYY";
var audioPosition = 0;
var audioDur = 0;
// posouvaci krouzek
var pslength = 320;
var pscount  = 0;

//***
// Audio player
//
var my_media   = null;  // media pro android
var mediaTimer = null;
// 
// api-media
var myCh_media = null;   // media pro Chrome
var zvukEnd    = true;   // zvuk byl ukoncen
//  ------------------


// Play audio
//
function playFile(filename,filepopis,odkud)
{
	    if(audistav == myPLAY){
	      stopAudio();
	      audistav = mySTOP;
	      my_media = null;
	      }	    
	    audioFile = filename;
	    audioPopis = filepopis;
	    //document.getElementById('filname').innerHTML = audioFile;
	    // document.getElementById('filpopis').innerHTML = filepopis;
	    // alert("playAudio prefix:"+prefixFile+" root:"+rootAdr+" file:"+filename);
	    // playAudio(prefixFile + rootAdr + filename,odkud);            	    
	    playAudio(filename,odkud);         
}

function playAudio(src,odkud) {
    // Create Media object from audioFile
    // alert("PlayAudio: " + src);
    audistav = myPLAY;
    audioDur = -1;
    // document.getElementById('PSKey').innerHTML = 'Stop';
    // varianta pro Chrome prohlizec
    if(isChrome)
    {
     if (myCh_media === null) { 	    
      if(debug) alert("media.js isChrome PlayAudio " + src);
      myCh_media = new Audio(src);      // create new audio
      myCh_media.play();                // start playing
      zvukEnd = false;                  // zvuk zatim neukoncen  
      };
    };
    
    if(!isChrome)
    {
      my_media = new Media(src, onSuccess, onError);
      if (odkud)
       my_media.seekTo(odkud);
       // Play audio
       my_media.play();
    }

    // nastavSoupatko(1);
    // startCitac();
}


function onPlayStopKey(but)
{
	    // stisk tlacitka play/stop
	    if(my_media){  // funkcni pouze pokud jiz bylo vytvoreno MEDIA
		      if(audistav == myPLAY) // kdyz se hraje vypnout
	    	  {
	    	    pauseAudio();
	            audistav = mySTOP;
	            but.innerHTML = 'Play';
	            return;
              }
		      if(audistav == mySTOP) // kdyz se stoji zapnout
	    	  {
		    	my_media.play();
	            audistav = myPLAY;
	            but.innerHTML = 'Stop';
	            startCitac();
	            return;
              }
	      }	             	    
	    if(myCh_media){  // funkcni pouze pokud jiz bylo vytvoreno MEDIA
	    	    alert( myCh_media.currentTime );
	    	    
	    }
}


function startCitac(){
    // Update my_media position every second
    // alert("Start citac");
    if (mediaTimer == null) {
        mediaTimer = setInterval(function() {
            // get my_media position
            if(my_media)
            {	    
            my_media.getCurrentPosition(
                // success callback
                function(position) {
                    if (position > -1) {
                    	pscount++;
                        setAudioPosition((position));
                    }
                },
                // error callback
                function(e) {
                    console.log("Error getting pos=" + e);
                    setAudioPosition("Error: " + e);
                }
            );
            };
            if(myCh_media)
            {	   
            	    setAudioPosition(myCh_media.currentTime);
            }            
        }, 1000.);
    }

}


// Pause audio
// 
function pauseAudio() {
    if (my_media) {
        my_media.pause();
        clearInterval(mediaTimer);
        mediaTimer = null;
    }
}
// seek audio
// 
function seekAudio(pos) {
  my_media.seekTo(pos);
}  

// skip audio
// 
function skipAudio(plus) {
    if (my_media) {
     // get my_media position
     my_media.getCurrentPosition(
     // success callback                 
            function(position) {    
                 if (position > -1) { 
                 // posunutí
                 var pos = position*1000 + plus;
                 my_media.seekTo(pos);
                 
                 setAudioPosition((position));  
                      }     },   
                       // error callback                       
                        function(e) {                        
                            console.log("Error getting pos=" + e);  
                             setAudioPosition("Error: " + e);        
                               }
                               );
     // document.getElementById('filelength').innerHTML = my_media.getDuration();
    }
}

function skip1()
//posun soupatka vytvoreneho pomoci HTML5 input range
{
var ele = document.getElementById('slider1');
//alert("Value ele  = " + ele.value);  
var pos = (ele.value / 100) *  audioDur;
skipAudio(1000*(pos - audioPosition));
}        

function nastavSoupatko(pos)
//posun soupatka vytvoreneho pomoci HTML5 input range
{
var ele = document.getElementById('slider1');
// alert("Value soupatka  = " + ele.value + "  pos="+pos + "  AudioDur="+audioDur);  
ele.value = pos;

}        

function skip2(e)
// posun soupatka vytvoreneho pomoci svg
{
	// alert("EVENT:" + this.event.clientX);
	circ = document.getElementById('regCircle');
	// 
	circ.setAttributeNS(null , "cx" , this.event.clientX) ;
    var pos = (this.event.clientX / 320) *  audioDur;
    skipAudio(1000*(pos - audioPosition));
}

// Stop audio
// 
function stopAudio() {
    if (my_media) {
        my_media.stop();
    }
    clearInterval(mediaTimer);
    mediaTimer = null;
}

// onSuccess Callback
//
function onSuccess() {
    console.log("playAudio():Audio Success");
    document.getElementById('filname').innerHTML = filename;
    audioDur = my_media.getDuration();
}

// onError Callback 
//
function onError(error) {
    if(error.code == 0) return;	
    alert('Audio Error code: '    + error.code    + '\n' + 
          'message: ' + error.message + '\n');
}

// Set audio position
// 
function setAudioPosition(position) {
	audioPosition = position;
	var cas = position.toFixed();
	var min = Math.floor(cas / 60);
	var sec = cas - min*60;
	var hod = Math.floor(cas / 3600);
	min = min - hod*60;

	// delku je treba nacist az pri prehravani
	if (audioDur < 0) {
		if(my_media)  audioDur = my_media._duration;
	        if(myCh_media)  audioDur =  myCh_media.currentTime;
	}
	// zobrazeni cisla 
        document.getElementById('audio_position').innerHTML = 
             " " + (hod<10 ? "0"+hod:hod) +":"+(min<10 ? "0"+min:min)+":"+(sec<10 ? "0"+sec:sec);
       // posunuti krouzku
       if(pscount >= 100)
    	{
    	  var pos = (audioPosition / audioDur) * 100 ;
    	  nastavSoupatko(pos);
    	  
    	/* pokus se svg soupatkem
    	  var circ = document.getElementById('regCircle');
          alert("regCircle=" + circ.cx);
          var pos = Math.round((audioPosition / my_media._duration) * 320);
     	  circ.setAttributeNS(null , "cx" , pos) ;
     	*/
     	pscount = 0;
    	}

}



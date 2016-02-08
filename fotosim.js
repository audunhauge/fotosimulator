/* global infolist */
/* global imagesets */
"use strict";

/**
 * Setup function for application
 * Creates a closure for all vars and functions
 */
function setup() {

  /* controls */
  var divInterface = document.getElementById("interface");  // menu
  var divIntro = document.getElementById("intro");          // intro
  var divSimula = document.getElementById("simula");        // simulation container
  var divView = document.getElementById("view");            // camera preview
  var divBack = document.getElementById("back");            // background
  var divFire = document.getElementById("ctrl_fire");       // snap a picture
  var divButtons = document.getElementById("buttons");      // buttons for aperture ..
  
  // displays for aperture, shutter and iso settings
  var dispAperture = document.getElementById("display_aperture");
  var dispShutter = document.getElementById("display_shutter");
  var dispIso = document.getElementById("display_iso");
  
  var snapping = false;  // true while animating a snapshot
  // The shutter sound is playing and a short animation 
  // causes the viewfinder image to blink
  
  
  // These vars are pulled from StillCamera.as
  // They are used to display setting for shutter,aperture and iso
  // No other class has override for these
  var apertureList = [1,1.4,2,2.8,4,5.6,8,11,16,22],
			shutterList = ['30"','15"','8"','4"','2"','1"',"1/2","1/4","1/8",
                      "1/15","1/30","1/60","1/125","1/250","1/500",
                      "1/1000","1/2000","1/4000","1/8000"],
			isoList = ["12800","6400","3200","1600","800","400","200","100"];
  
  // These are global vars from Fotosimulator.as
  // They regulate which image to display dependent on
  // settings of aperture, shutter and iso
  /*
  public var totalImg:int;
	private var defaultImg:int;  // Why private ?
	public var ev:int;
	public var defaultEV:int;
	public var apertureIndex:int;
	public var shutterIndex:int;
	public var isoIndex:int;
	public var evAdjust:int;
  */
  var totalImg, defaultImg, ev, defaultEV, apertureIndex,
      shutterIndex, isoIndex, evAdjust;
      
  var currentSetArray, currentImage;
  
  
  var shutterMP3 = new Howl({ urls:[ 'shutter.mp3']});
  
  var idname;       // id of image-set: nightlight, shutter ..,
  var dataSet;      // data for this image set, attributes + imagelist
  var attributes;   // iso, shutter, aperture settings, which controls are active

  divInterface.addEventListener("click", checkClick);
  divIntro.addEventListener("click", startSimulation);
  divView.addEventListener("click", endSimulation);


  /**
   * Check which overlay was clicked
   * Activate intro for selected simulation
   * @param {MouseEvent} e
   */
  function checkClick(e) {
    var target = e.target;
    if (target.id === "interface") {
      return;
      // Do nothing unless an overlay is clicked
    }
    idname = target.id;
    dataSet = imagesets[idname];
    divIntro.style.visibility = "visible";
    divInterface.style.visibility = "hidden";
    var info = infolist[idname];
    if (info === undefined) {
      console.log("Missing info for ", idname);
      return;
    }
    
    // quickref for attributes
    attributes = dataSet.attributes;
    
    var divTitle = document.querySelector("#lightbox h4");
    var divText = document.querySelector("#lightbox div");
    divTitle.innerHTML = info.title;
    divText.innerHTML = info.text + '<p>Klikk for å begynne ...</p>';
    divIntro.style.backgroundImage = 'url(' + attributes.prependURLs + 'index.jpg)';
  }
  
  /**
   * Show camera and image to focus on
   * @param {MouseEvent} e
   */
  function startSimulation(e) {
    var activated;
    var ctrl;
    
    /*
    // This is code for setting up vars copied from Fotosimulator.as
    // 
			currentSetArray = currentSetLoader.content;
			currentImg = currentSetArray[defaultImg];
			totalImg = currentSetLoader.numChildren - 1;
			defaultImg = currentSetLoader.vars.defaultImg;
			defaultEV = currentSetLoader.vars.ev;
			apertureIndex = currentSetLoader.vars.apertureIndex;
			shutterIndex = currentSetLoader.vars.shutterIndex;
			isoIndex = currentSetLoader.vars.isoIndex;
			ev = apertureIndex + shutterIndex - 5 + isoIndex - 7;
			controls = currentSetLoader.vars.controls;
			evAdjust = ev - defaultImg;
    */
    // The code above translated to this:
    defaultImg       = +attributes.defaultImg;
    currentSetArray  = dataSet.ImageLoader;
    totalImg         =  currentSetArray.length;
    defaultEV        = +attributes.ev;
    apertureIndex    = +attributes.apertureIndex;
    shutterIndex     = +attributes.shutterIndex;
    isoIndex         = +attributes.isoIndex;
    ev               = apertureIndex + shutterIndex - 5 + isoIndex - 7;
    evAdjust         = ev - defaultImg;
    
    
   
    // set up backgrounds and visibility
    divIntro.style.visibility = "hidden";
    divIntro.style.backgroundImage = 'url("images/interface.png")';
    divBack.style.backgroundImage = 'url(' + attributes.prependURLs + 'index.jpg)';
    divSimula.style.visibility = "visible";
    document.querySelector("#controls").classList.add("controllme");
    activated = "aperture,shutter,iso".split(",");
    for (ctrl of activated) {
      document.querySelector("#ctrl_" + ctrl).className = "passive";  
    }
    if (attributes.controls !== "") {
      // if attribute.controls is not empty
      // then it contains list of active controls
      // otherwise all are active
      activated = attributes.controls.split(",");
    }
    for (ctrl of activated) {
      document.querySelector("#ctrl_" + ctrl).classList.remove("passive");
      document.querySelector("#ctrl_" + ctrl).classList.add("active");  
    }
    document.querySelector("#ctrl_fire").classList.add("active");
    divBack.classList.add("blur");
    fullScreen();
    update_displays();
  
    // activate all buttons (aperture,shutter,iso)
    divButtons.addEventListener("click", adjustments);
    
    // activate snap picture/ fire button
    divFire.addEventListener("click", snapshot);
    
    // set image to a dark nightlight to indicate no image
    divView.style.backgroundImage = 'url(images/sets/nightlightSet/15.jpg)';
   
  }
  
  function adjustments(e) {
    //console.log(e.target);
    var but = e.target;
    if (but.id.substr(0,4) !== 'ctrl') {
      return;   // not a ctrl_ button
    }
    if (   but.classList.contains("passive")  
        || (but.parentNode && but.parentNode.classList.contains("passive"))) {
       return;   // ignore passive buttons      
    }
    var operator = but.id.substr(5);
    switch(operator) {
      case 'shutter':
        if (shutterIndex > 0) {
          shutterIndex -= 1;
          ev -= 1;
        }
        break;
      case 'shutter_left':
        if (shutterIndex < shutterList.length -1) {
          shutterIndex += 1;
          ev += 1;
        }
        break;
      case 'aperture':
        if (apertureIndex > 0) {
          apertureIndex -= 1;
          ev -= 1;
        }
        break;
      case 'aperture_left':
        if (apertureIndex < apertureList.length - 1) {
          apertureIndex += 1;
          ev += 1;
        }
        break;
      case 'iso':
        if ( isoIndex > 0) {
          isoIndex -= 1;
          ev -= 1;
        }
        break;
      case 'iso_left':
        if (isoIndex < isoList.length - 1) {
          isoIndex += 1;
          ev += 1;
        }
        break;
      default:
        console.log("UNEXPECTED OPERATOR:",operator);
        return;
    }
    update_displays();
  }
  
  function update_displays() {
    dispAperture.innerHTML = "" + apertureList[apertureIndex];
    dispShutter.innerHTML = "" + shutterList[shutterIndex];
    dispIso.innerHTML = "" + isoList[isoIndex];
  }
  
  function snapshot(e) {
    if (snapping) return;
    var currentSetIndex = ev - evAdjust;
    if (currentSetIndex > currentSetArray.length - 1) {
      currentSetIndex = currentSetArray.length - 1;
    } else if (currentSetIndex <= 1) {
      currentSetIndex = 1;
    }
    currentImage = currentSetArray[currentSetIndex];
    snapping = true;
    shutterMP3.play();
    console.log(currentImage);
    divView.style.backgroundImage = 'url(' 
            + attributes.prependURLs 
            + currentImage.url+ ')';
    divView.classList.add('snap');
    setTimeout(function(e) {
      divView.classList.remove('snap');
      snapping = false;
    }, 200);
  }
  
  
  function endSimulation(e) {
    divSimula.style.visibility = "hidden";
    divView.style.backgroundImage = 'none';
    divBack.classList.remove("blur");
    divInterface.style.visibility = "visible";
    document.querySelector("#controls").classList.remove("controllme");
    document.querySelector("#ctrl_aperture").classList.remove("active");
    document.querySelector("#ctrl_shutter").classList.remove("active");
    document.querySelector("#ctrl_iso").classList.remove("active");
    document.querySelector("#ctrl_fire").classList.remove("active");
  }
  
  function fullScreen() {
     /*
    if (divSimula.requestFullscreen) {
      divSimula.requestFullscreen();
    } else if (divSimula.webkitRequestFullscreen) {
      divSimula.webkitRequestFullscreen();
    } else if (divSimula.mozRequestFullScreen) {
      divSimula.mozRequestFullScreen();
    } else if (divSimula.msRequestFullscreen) {
      divSimula.msRequestFullscreen();
    }
    */
  }

}
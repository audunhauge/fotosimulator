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
  
  var snapping = false;  // true while animating a snapshot
  // The shutter sound is playing and a short animation 
  // causes the viewfinder image to blink
  
  
  
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
    console.log(imagesets[idname]);
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
    divFire.addEventListener("click", snapshot);
    divView.style.backgroundImage = 'url(images/sets/nightlightSet/15.jpg)';
   
  }
  
  function snapshot(e) {
    if (snapping) return;
    snapping = true;
    shutterMP3.play();
    divView.style.backgroundImage = 'url(' + attributes.prependURLs + 'index.jpg)';
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
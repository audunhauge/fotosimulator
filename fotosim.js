"use strict";

/**
 * Setup function for application
 * Creates a closure for all vars and functions
 */
function setup() {

  var divInterface = document.getElementById("interface");
  var divIntro = document.getElementById("intro");
  var shutter = new Howl({ urls:[ 'shutter.mp3']});

  divInterface.addEventListener("click", checkClick);
  divIntro.addEventListener("click", startSimulation);


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
    var idname = target.id;
    divIntro.style.visibility = "visible";
    divInterface.style.visibility = "hidden";
    var info = infolist[idname];
    if (info === undefined) {
      console.log("Missing info for ", idname);
      return;
    }
    
    // TODO just testing sound lib
    shutter.play();
    
    var divTitle = document.querySelector("#lightbox h4");
    var divText = document.querySelector("#lightbox div");
    divTitle.innerHTML = info.title;
    divText.innerHTML = info.text + '<p>Klikk for å begynne ...</p>';
    divIntro.style.backgroundImage = 'url("images/sets/' + idname + 'Set/index.jpg")';
  }
  
  /**
   * TODO for now just return to main menu
   * 
   */
  function startSimulation(e) {
    divIntro.style.visibility = "hidden";
    divInterface.style.visibility = "visible";
  }

}
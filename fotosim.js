/* global infolist */
"use strict";

/**
 * Setup function for application
 * Creates a closure for all vars and functions
 */
function setup() {

  var divInterface = document.getElementById("interface");
  var divIntro = document.getElementById("intro");
  var divSimula = document.getElementById("simula");
  var shutter = new Howl({ urls:[ 'shutter.mp3']});
  var idname;

  divInterface.addEventListener("click", checkClick);
  divIntro.addEventListener("click", startSimulation);
  divSimula.addEventListener("click", endSimulation);


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
   * Show camera and image to focus on
   * @param {MouseEvent} e
   */
  function startSimulation(e) {
    divIntro.style.visibility = "hidden";
    divIntro.style.backgroundImage = 'url("images/interface.png")';
    divSimula.style.backgroundImage = 'url("images/sets/' + idname + 'Set/index.jpg")';
    divSimula.style.visibility = "visible";
    document.querySelector("#controls").classList.add("controllme");
    document.querySelector("#bigwheel").classList.add("active");
    document.querySelector("#smallwheel").classList.add("active");
    document.querySelector("#iso").classList.add("active");
    document.querySelector("#fire").classList.add("active");
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
  
  function endSimulation(e) {
    divSimula.style.visibility = "hidden";
    divInterface.style.visibility = "visible";
    document.querySelector("#controls").classList.remove("controllme");
    document.querySelector("#bigwheel").classList.remove("active");
    document.querySelector("#smallwheel").classList.remove("active");
    document.querySelector("#iso").classList.remove("active");
    document.querySelector("#fire").classList.remove("active");
  }

}
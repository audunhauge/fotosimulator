/* global infolist */
/* global imagesets */
"use strict";

/**
 * Setup function for application
 * Creates a closure for all vars and functions
 */
function setup() {
  var iso = document.getElementById("iso");
  var aperture = document.getElementById("aperture");
  var shutter = document.getElementById("shutter");
  var form = document.getElementById("guiform");
  var leksjon = document.getElementById("leksjonListe");
  var picture = document.getElementById("picture");
  var selIso = document.getElementById("seliso");
  var selAperture = document.getElementById("selaperture");
  var selShutter = document.getElementById("selshutter");
  
  
  var apertureList = [ 1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22 ];
  var shutterList = ['30"','15"','8"','4"','2"','1"',"1/2","1/4","1/8",
                      "1/15","1/30","1/60","1/125","1/250","1/500",
                      "1/1000","1/2000","1/4000","1/8000"];
  var isoList = ["12800","6400","3200","1600","800","400","200","100"];
       
  var setLinks = [];  // so we can remove .active from setLinks
  // would use querySelectorAll - but IE ...
  
  var setinfo;  // info about selected set
  // filled in when user chooses image-set
  
  var ready = false;
  // will change to true if we can take a picture
  
  function selectControls(selected) {
    selIso.innerHTML = '<option>Velg iso</option>'
     + (isoList.map(function(e) { 
         var sel = selected.iso === e ? ' selected' : '';
         return '<option' + sel + '>'+e+'</option>'
       })).join('');
    
     
    selAperture.innerHTML = '<option>Velg blendråpning</option>'
      + (apertureList.map(function(e) { 
         var sel = selected.aperture === e ? ' selected' : '';
         return '<option' + sel + '>'+e+'</option>'
        })).join('');
     
          
    selShutter.innerHTML = '<option>Velg lukkertid</option>'
     + (shutterList.map(function(e) { 
         var sel = selected.shutter === e ? ' selected' : '';
         return '<option' + sel + '>'+e+'</option>'
       })).join('');
  }
  
  selectControls({iso:"200",aperture:2,shutter:"1/30"});
   
  lagSetListe(leksjon);  
  
  
  // disable all controls at start
  disableControls();
  
  form.oninput = takePicture;
  // try to take a picture if any input
  // will break out if conditions not met for selected set
 
  function takePicture(e) {
    if (!ready) return;
    console.log(e);
  }
 
  function disableControls() {
   addClass(iso,'lock');
   addClass(aperture,'lock');
   addClass(shutter,'lock');
   selIso.disabled = true;
   selAperture.disabled = true;
   selShutter.disabled = true;
  }
  
  /***
   *  lager en liste av sett med bilder
   *  @param {DOM} pater - dom-element to append children to
   */
  function lagSetListe(pater) {
    var setTitle;
    var lnkSet;
    for (setTitle in infolist) {
      lnkSet = document.createElement('div');
      lnkSet.innerHTML = infolist[setTitle].link;
      pater.appendChild(lnkSet);
      lnkSet.onclick = guiVelgSet;
      lnkSet.id = setTitle;
      setLinks.push(lnkSet);   // array of all setLinks
    }
  }
 
  function guiVelgSet(e) {
    var ctrList, setname;
    
    // first remove .active from all sets
    setLinks.forEach(function(e) { removeClass(e,'active')});
   
    var setId = e.target;
    setname = setId.id;
    setinfo = imagesets[setname].attributes;
    addClass(setId,'active');
    ctrList = setinfo.controls ? setinfo.controls.split(',')
              : "iso,aperture,shutter".split(',');
  
    // show instructions and default image
    picture.innerHTML = '<div>' 
       + '<h4>' +  infolist[setname].title + '</h4>'
       + infolist[setname].text 
       + '<p>' + infolist[setname].instruks 
       + ' for å komme igang.'
       + '</div>';
    
    var prepend = setinfo.prependURLs;
    picture.style.backgroundImage = 'url("' 
      + prepend + '10.jpg'
      +'")';
      
    // recreate selects with correct settings
    selectControls({  iso           :isoList[setinfo.isoIndex]
                    ,aperture       :apertureList[setinfo.apertureIndex]
                    ,shutter        :shutterList[setinfo.shutterIndex]
                    });
   
    // first turn off all controls
    disableControls();  
    // activate controls for this set
    ctrList.forEach( function(e) {    
       var ctrl = document.getElementById('sel'+e);
       ctrl.disabled = false;
       var divctrl = document.getElementById(e);
       removeClass(divctrl,"lock");
    });
    
    
  }
     
}

  
/**
 *  Add trim() to string if missing
 *  removes leading/trailing spaces 
 */
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

// needed as IE is just ...
function hasClass(ele,cls) {
  return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

/**
 *  As old IE versions don't support classlist
 *  @param {DOMelement} ele
 *  @param {string} cls
 */
function addClass(ele,cls) {
  var nuClass;
  if (!hasClass(ele,cls)) {
    nuClass = ele.className.trim() + " " + cls;
    ele.className = nuClass.trim();
  }
}

/**
 *  As old IE versions don't support classlist
 *  @param {DOMelement} ele
 *  @param {string} cls
 */
function removeClass(ele,cls) {
  if (hasClass(ele,cls)) {
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    ele.className = ele.className.replace(reg,' ');
    ele.className = ele.className.trim();
  }
}
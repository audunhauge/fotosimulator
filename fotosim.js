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
  
  // status shown under live view
  var statIso = document.getElementById("statIso");
  var statAperture = document.getElementById("statAperture");
  var statShutter = document.getElementById("statShutter");
  var statFocal = document.getElementById("statFocal");
  var statAvstand = document.getElementById("statAvstand");
  
  
  var apertureList = [ 1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22 ];
  var shutterList = ['30"','15"','8"','4"','2"','1"',"1/2","1/4","1/8",
                      "1/15","1/30","1/60","1/125","1/250","1/500",
                      "1/1000","1/2000","1/4000","1/8000"];
  var isoList = ["12800","6400","3200","1600","800","400","200","100"];
       
  var setLinks = [];  // so we can remove .active from setLinks
  // would use querySelectorAll - but IE ...
  
  var setinfo;  // info about selected set
  // filled in when user chooses image-set
  
  var currentSetArray;  // list of image names
  // for currently selected set
  
  // these are taken from original actionscript
  // no deeper info about them
  // they are used to select correct image given iso,apertue,shutter
  var defaultImg;
  var ev;
  var evAdjust;
  var isoIndex;
  var shutterIndex;
  var apertureIndex;
  var setname;          // name of set, nightlight/daylight ...
  
  var ready = false;
  // will change to true if we can take a picture
  
  function selectControls(selected) {
    selIso.innerHTML = (isoList.map(function(e) { 
         var sel = selected.iso === e ? ' selected' : '';
         return '<option' + sel + '>'+e+'</option>'
       })).join('');
    
     
    selAperture.innerHTML = (apertureList.map(function(e) { 
         var sel = selected.aperture === e ? ' selected' : '';
         return '<option' + sel + '>'+e+'</option>'
        })).join('');
     
          
    selShutter.innerHTML = (shutterList.map(function(e) { 
         var sel = selected.shutter === e ? ' selected' : '';
         return '<option' + sel + '>'+e+'</option>'
       })).join('');
  }
  
  selectControls({iso:"200",aperture:2,shutter:"1/30"});
   
  lagSetListe(leksjon);  
  
  
  // disable all controls at start
  disableControls();
  
  //form.oninput = takePicture;
  form.onchange = takePicture;
  // try to take a picture if any input
  // will break out if conditions not met for selected set
 
  function takePicture(e) {
    // update status for Live View
    statIso.innerHTML = selIso.value;
    statAperture.innerHTML = selAperture.value;
    statShutter.innerHTML = selShutter.value;
    
    if (!ready) return;
    var currentImage;
    var deltaIso = (+selIso.selectedIndex - isoIndex);
    var deltaAperture = (+selAperture.selectedIndex - apertureIndex);
    var deltaShutter = (+selShutter.selectedIndex - shutterIndex);
    isoIndex = +selIso.selectedIndex;
    apertureIndex = +selAperture.selectedIndex;
    shutterIndex = +selShutter.selectedIndex;
    
    // may trigger redraw of aperture
    aperture_auto(setname, -deltaShutter);
    
    // may trigger redraw of shutter
    shutter_auto(setname, -deltaAperture);
    
    ev += deltaIso + deltaShutter + deltaAperture;
    
    var currentSetIndex = ev - evAdjust;
    if (currentSetIndex > currentSetArray.length - 1) {
      currentSetIndex = currentSetArray.length - 1;
    } else if (currentSetIndex <= 1) {
      currentSetIndex = 1;
    }
    currentImage = currentSetArray[currentSetIndex];
    
    var prepend = setinfo.prependURLs;
    picture.innerHTML = '';    
    picture.style.backgroundImage = 'url("' 
      + prepend + currentImage.url
      +'")';       
    
    console.log("ev=",ev,"defaultImg=",defaultImg,"iso=",isoIndex
    ,"currentImage=",currentImage
    ," aper=",apertureIndex," shu=",shutterIndex);
  
  }
  
  function aperture_auto(id, delta) {
    if (id === 'shutter' && delta !== 0) {
      if (apertureIndex + delta > 0
          && apertureIndex + delta < apertureList.length) {
          apertureIndex += delta;
          selAperture.selectedIndex = apertureIndex;
      }
    }
  }
  
  function shutter_auto(id, delta) {
    if (id === "aperture" && delta !== 0) {
      if (shutterIndex + delta > 0
          && shutterIndex + delta < shutterList.length) {
          shutterIndex += delta;
          selShutter.selectedIndex = shutterIndex;
      }
    }
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
   *  make a menu to select picture sets
   *  @param {DOM} pater - dom-element to append children to
   */
  function lagSetListe(pater) {
    var setTitle;
    var lnkSet;
    var i = 0;   // used to help ie break list into two columns
    for (setTitle in infolist) {
      lnkSet = document.createElement('div');
      lnkSet.innerHTML = infolist[setTitle].link + ( (i % 2) ? '<br>' : '');
      // using ieonly.css we need to add br to every other setname
      // to spread them over two columns
      // All other browsers use display flex
      pater.appendChild(lnkSet);
      lnkSet.onclick = guiVelgSet;
      lnkSet.id = "set_" + setTitle;
      setLinks.push(lnkSet);   // array of all setLinks
      i++;
    }
  }
 
  function guiVelgSet(e) {
    var ctrList;
    
    // user must select settings
    ready = true;
    
    // first remove .active from all sets
    setLinks.forEach(function(e) { removeClass(e,'active')});
   
    var setId = e.target;
    setname = setId.id.substr(4);    // first 4 chars are "set_"
    setinfo = imagesets[setname].attributes;
    currentSetArray = imagesets[setname].ImageLoader;
    
    isoIndex = +setinfo.isoIndex;
    apertureIndex = +setinfo.apertureIndex;
    shutterIndex = +setinfo.shutterIndex;
    
    // select correct radio-button for this set
    // prog will be one of {M,A,T,P} manual,av,tv,p
    var prog = infolist[setname].prog;
    document.getElementById("radio"+prog).checked = true;
    
    
    
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
    selectControls({  iso           :isoList[isoIndex]
                    ,aperture       :apertureList[apertureIndex]
                    ,shutter        :shutterList[shutterIndex]
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
    
    // precalculated values
    defaultImg = +setinfo.defaultImg;
    ev = apertureIndex + shutterIndex - 5 + isoIndex - 7;
    evAdjust = ev - defaultImg; 
  }
  
  /**
   * Start preloading image sets
   * Read filenames from imageset and add an img element
   *   for each file in the preload div.
   * Without this there will be a delay while image is fetched
   * from server when user snaps a picture
   * IIFE as we only call this function on setup
   */
  (function() {
    var setname, list, pic, divPic, prepend,  i;
    var divPreload = document.getElementById("preload");
    for (setname in imagesets) {
      list = imagesets[setname].ImageLoader;
      prepend = imagesets[setname].attributes.prependURLs;
      for (i=0; i < list.length; i++) {
        pic = list[i].url
        divPic = document.createElement('img');
        divPic.src = prepend + pic;
        divPreload.appendChild(divPic);
      }
    }
  })();
     
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
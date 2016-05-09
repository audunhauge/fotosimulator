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
  var program = document.getElementById("program");
  
  iso.innerHTML = ' ISO <span class="lock"></span>'
     + ' <p><select id="selIso">'
     + ' <option>3200</option>'
     + ' <option>A</option>'
     + ' <option>B</option>'
     + ' <option>C</option>'
     + '</select>';
     
  aperture.innerHTML = ' Aperture '
     + ' <p><select id="selAperture">'
     + ' <option>Velg blenderåpning</option>'
     + ' <option>A</option>'
     + ' <option>B</option>'
     + ' <option>C</option>'
     + '</select>';
          
  shutter.innerHTML = ' Shutter <span class="lock"></span>'
     + ' <p><select id="selShutter">'
     + ' <option>1/250</option>'
     + ' <option>A</option>'
     + ' <option>B</option>'
     + ' <option>C</option>'
     + '</select>'; 
     
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
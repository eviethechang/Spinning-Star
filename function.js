var uiLock = false;
var reverse = false;

$container = $('#container');


function getPetal(id, angle, radius, color, edgeColor) {
  var outerRad = radius * .6; //flower size
  var edgeRad = radius * 2; //petal shape
  
  var xAngle = Math.cos((angle * 0.5) - Math.PI / 2);
  var yAngle = Math.sin((angle * 0.5) - Math.PI / 2);
  
  // Petal container
  var $g = $(svgNs('g'));
  
  // Petal gradient coloring
  var $gradShape = $(svgNs('path'));;
  var $grad = $(svgNs('linearGradient'));
  var $gradStop1 = $(svgNs('stop'));
  var $gradStop2 = $(svgNs('stop'));
  
  $grad.attr({
    id:id + '-lin-grad', 
    x1:'0',
    x2:'0',
    y1:'1',
    y2:'2'
  });
  $gradStop1.attr({
    offset:'0%', 
    'stop-color':edgeColor, 
    'stop-opacity':.5
  });
  $gradStop2.attr({
    offset:'25%', 
    'stop-color':edgeColor, 
    'stop-opacity':0.5
  });
  $grad.append($gradStop1);
  $grad.append($gradStop2);
  $g.append($grad);
  
  
  var $p = $(svgNs('path'));
  $p.attr({
    d:'M 0 0' +
      'L ' + -(edgeRad * xAngle) + ' ' + (edgeRad * yAngle) + ' ' + 
      'C ' + (-outerRad * xAngle) + ' ' + (outerRad * yAngle) + ', ' + 
        (outerRad * xAngle) + ' ' + (outerRad * yAngle) + ', ' + 
        (edgeRad * xAngle) + ' ' + (edgeRad * yAngle) + ' ' + 
      'z', 
    //filter:'url(#shadow)'
  });
  TweenMax.set($p, {
    fill:color, 
    strokeWidth:5, 
    stroke:'#000000', //petal stroke
    strokeOpacity:1
  });
  
  //I think this is gradient of the entire flower 
  var $gradShape = $(svgNs('path'));
  $gradShape.attr({
    d:'M 0 0' +
      'L ' + -(edgeRad * xAngle) + ' ' + (edgeRad * yAngle) + ' ' + 
      'C ' + (-outerRad * xAngle) + ' ' + (outerRad * yAngle) + ', ' + 
        (outerRad * xAngle) + ' ' + (outerRad * yAngle) + ', ' + 
        (edgeRad * xAngle) + ' ' + (edgeRad * yAngle) + ' ' + 
      'z', 
    fill:'url(#' + id + '-lin-grad)'
  });
  TweenMax.set($gradShape, {
    
  });
  
  $g.append($p);
  $g.append($gradShape);
  return $g;
  
}



var $flower1 = $(svgNs('g'));
var rad1 = 125;
var numSegs1 = 5;
var color1 = '#32b9fc';
TweenMax.set($flower1, { //center flower in the middle of screen
  x:150, 
  y:150
});

var petals1 = [];
var numPetals = 60;

for(var i = 0, 
    noise = 1, 
    noiseInc = 1.0000, 
    maxL = 100, 
    minL = 15;  //radial gradiant color boundaries
    
    i < numPetals; 
    
    i++, 
    noise *= noiseInc, 
    noiseInc += 0.0004) {
  
  var l = minL + (maxL - minL) * ((numPetals - i) / numPetals);
  var col = 'hsl(208, 100%, ' + l + '%)';
  var edgeCol = 'hsl(315, 100%, ' + (l * 0.9) + '%)';
  
  var $petal = getPetal(
    'petal-' + i, 
    Math.PI / (numSegs1 * 0.5) * noise, 
    rad1 * (1 / noise) * rand(0.975, 1.025), 
    col, 
    edgeCol
  );
  TweenMax.set($petal, {
    rotation:360 / numSegs1 * i * noiseInc, 
  });

  $flower1.append($petal);
  petals1.push($petal);
}

// Add center
$center = $(svgNs('circle'));
$center.attr({
  cx:0, 
  cy:0, 
  r:rad1 * 0.28, 
  fill:'hsl(307, 50%, 45%)'
})
$flower1.append($center);

$centerShade = $(svgNs('circle'));
$centerShade.attr({
  cx:0, 
  cy:0, 
  r:rad1 * 0.28, 
  fill:'url(#rad-grad)'
})
$flower1.append($centerShade);

$container.append($flower1);


tl = new TimelineMax({
  //repeat:-1, 
  //yoyo:true
});

TweenMax.set(petals1, {
  scaleY:0.3, 
  scaleX:1.1
});

TweenMax.set([$center, $centerShade], {
  scale:0.6, 
  transformOrigin:'50% 50%'
});

TweenMax.set('#blur', {
  attr:{stdDeviation:0}
});

tl.staggerTo(petals1, 1.6, {
  scaleY:1, 
  scaleX:1, 
  ease:Back.easeInOut.config(8)
}, 0.01, 0)
.to([$center, $centerShade], 1.6, {
  scale:1, 
  ease:Back.easeInOut.config(4)
}, 0)
.to('#blur', 1.6, {
  attr:{stdDeviation:6}
}, 0);

var spinTl = new TimelineMax({
  repeat:-1
});

spinTl.to($flower1, 40, {
  rotation:-360, 
  ease:Linear.easeNone
});


$container.click(function() {
  if(!reverse) tl.reverse();
  else tl.play();
  reverse = !reverse;
});



/*
 * Utility functions
 */

function rand(min, max) {
	return min + (Math.random() * (max - min));
}

function randInt(min, max) {
	return Math.floor(min + (Math.random() * (max - min)));
}

function clickable(elem) {
		$(elem).removeClass('no-select').addClass('hitarea');
	}

function clickables(elems) {
  for(var i in elems) {
    $(elems[i]).removeClass('no-select').addClass('hitarea');
  }
}

function unclickable(elem) {
  $(elem).removeClass('hitarea').addClass('no-select');
}

function unclickables(elems) {
  for(var i in elems) {
    $(elems[i]).removeClass('hitarea').addClass('no-select');
  }
}

/*
 * Borrowed from http://stackoverflow.com/questions/6148859/is-it-possible-to-work-with-jquery-and-svg-directly-no-plugins
 */
function svgNs(tag) {
  return document.createElementNS('http://www.w3.org/2000/svg', tag);
}
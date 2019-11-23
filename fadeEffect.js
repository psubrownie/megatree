var Color = require('color');
var sleep = require('sleep');

// var c1 = Color("red");
// var c2 = Color("green");
// var c = computerColor(c1,c2,0.5);
// console.log(c.rgb());

exports.run = function(ws281x,pixelData,NUM_LEDS){
    console.log("starting");
    var time=5000.0;
    var start = Date.now();
    var c1 = Color("red");
    var c2 = Color("rgb(0,255,0)");
    while(Date.now() < start+time){
        var p = (Date.now()-start)/(time);
        var fade = computerColor(c1,c2,p).rgbNumber();
        for(var x=0;x<NUM_LEDS;x++){
            pixelData[x] = fade;
        }
        ws281x.render(pixelData);
        // sleep.msleep(1000);
    }
}

function computerColor(c1,c2,p){
    var arr1 = c1.rgb().color;
    var arr2 = c2.rgb().color;
    var r = computeFade(arr1[0],arr2[0],p);
    var g = computeFade(arr1[1],arr2[1],p);
    var b = computeFade(arr1[2],arr2[2],p)
    var color = Color({r: r, g: g, b: b});
    return color;
}

function computeFade(x,y,p){
    return x*1.0* (1-p) + y *p;
}

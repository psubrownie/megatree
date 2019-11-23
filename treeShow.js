// var ws281x = require('ws281x-native');
const ws281x = require('rpi-ws281x-native');

var NUM_LEDS = parseInt(process.argv[2], 10) || 10,
    pixelData = new Uint32Array(NUM_LEDS);

ws281x.init(NUM_LEDS);

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
  ws281x.reset();
  process.nextTick(function () { process.exit(0); });
});

console.log('Press <ctrl>+C to exit.');

effect1();
//}

function effect1(){
	rain(rgb2Int(0,255,0),rgb2Int(255,0,0),10,50,30,effect2);
}

function effect2(){
	animate(30,effect1);
}


// ---- animation-loop
function animate(time,cb){
    var offset = 0;
    var start = Date.now();
    var inter = setInterval(function () {
        for (var i = 0; i < NUM_LEDS; i++) {
            pixelData[i] = colorwheel((offset + i) % 256);
        }

        offset = (offset + 1) % 256;
        ws281x.render(pixelData);
        if(Date.now() - start > time*1000){
            clearInterval(inter);
	    if(cb)cb();
	}
    }, 1000 / 30);
}

function rain(pColor,rColor,bandsize,speed,time,cb){
    var offset =0;
    var color = pColor;
    var start = Date.now();
    var inter = setInterval(function(){
        for(var i=(0-bandsize*2);i<NUM_LEDS;i++){
	    var idx = i + (offset%(bandsize*2));
            if(idx>=0 && idx<pixelData.length)
                pixelData[idx] = color;
	    if(i % bandsize == 0){
		color = color == pColor?rColor:pColor;
	    }
        }
        if(offset == (bandsize*2))
		offset = 0;
	offset++;
        ws281x.render(pixelData);
	if(Date.now() - start > time*1000){
            clearInterval(inter);
	    if(cb)cb();
	}
    },1000/speed);
    
}


// rainbow-colors, taken from http://goo.gl/Cs3H0v
function colorwheel(pos) {
  pos = 255 - pos;
  if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
  else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
  else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
}

function rgb2Int(r, g, b) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

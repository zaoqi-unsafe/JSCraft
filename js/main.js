var canvas;
var gl;
var keyState = new Array(127);
var isShiftDown = false;

var key_Left = 65;
var key_Right = 68;
var key_Up = 87;
var key_Down = 83;
var key_Flashlight = 70;
var key_Interact = 69;
var key_Restart = 82;

var scroll = 0;

var lastTime = Date.now();

function initGL() {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
    
    GLHelper.loadExtensions();
}

window.onkeydown = function (e) {
	var code = e.keyCode ? e.keyCode : e.which;
	keyState[code] = true;
    
    if(e.shiftKey) isShiftDown = true;
    
    ScreenHandler.handleKeyPressed(e);
    
    if(code == 32) e.preventDefault();
}

window.onkeyup = function(e) {
	var code = e.keyCode ? e.keyCode : e.which;
	keyState[code] = false;
    
    if(e.shiftKey) isShiftDown = false;
}

window.onwheel = function(e) {
    scroll = e.deltaY>0?1:-1;
}

function tick() {
    Time.tick();
    
	if(ResourceManager.drawLoadingScreen()){
		update();
		drawScene();
	}
    
    requestAnimationFrame(tick);
}

function update() {
    //updateCurrentScreen(deltaTime);
    ScreenHandler.update(Time.delta);
}

function drawScene() {
    ScreenHandler.draw();
    
    GLHelper.handleStateErrors();
}

function webGLStart() {
    canvas = document.getElementById("gameCanvas");
    initGL();
    initShaders();
    PointerLock.init(canvas);
    VirtualCursor.init();
    VirtualCursor.setLocation(canvas.width/2, canvas.height/2);
    
	for(var i = 0; i < keyState.length; i++){
		keyState[i] = false;
	}
	
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
    gl.bindTexture(gl.TEXTURE_2D, null);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    
	ResourceManager.preloadBaseResources();
    
    tick();
}

function onFinishedLoading(){
    console.log("Finished loading resources!");
    
    gameStart();
}

function gameStart() {
    //openGameScreen();
    ScreenHandler.open(new ScreenGame());
}
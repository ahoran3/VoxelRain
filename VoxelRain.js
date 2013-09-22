// Jonathan Cools-Lartigue, Brandon Forster
// Matt Hansen, Alex Horan
// CAP 4720- Project 1
// 24 September 2013

// ... global variables ...
var modelId = 0;
var canvas = null;
var gl = null;
var messageField = null;
var rand = null;
var generationTime = 0; //first object should fall instantly

var GRID_SIZE_X = 2; // global constants used for quick debugging
var GRID_SIZE_Y = 9; // note: this will be used in an array
var GRID_SIZE_Z = 2; // so a grid size of 9 is actually 10x10

function setupMessageArea() {
    messageField = document.getElementById("messageArea");
    document.getElementById("messageClear").setAttribute("onclick", "messageField.value='';");
}

function setupMenu() {
    var menuItemList = ["cubes", "teapots", "skulls"]; // Some list. May be list of objects to render.
    var m = document.getElementById("menu");
    var option;
    for (var i = 0; i < menuItemList.length; i++) {
        option = document.createElement("option");
        option.text = menuItemList[i];
        m.add(option);
    }
}

function addMessage(message) {
    var st = "->" + message + "\n";
    messageField.value += st;
}

function menuHandler() {
    var m = document.getElementById("menu");
    modelId = m.selectedIndex;
    addMessage("Selected index " + m.selectedIndex + " :" + m.options[modelId].text);
}

function getObject() {
    if (modelId == 0)
        modelObject = cubeObject;
    else if (modelId == 1)
        modelObject = teapotObject;
    else
        modelObject = skullObject;
}

function mainFunction() {
    setupMessageArea();
    setupMenu();

    canvas = document.getElementById('myCanvas');
    addMessage(((canvas) ? "Canvas acquired" : "Error: Can not acquire canvas"));
    gl = getWebGLContext(canvas);
    console.log("done");

    //generates a random number between i and j 
    //up to any number of deciaml spots.
    //can be used for random colors and random positions
    function randomNumber(i, j, decimalspots) {
        var high = j;
        var low = i;
        rand = Math.random();
        rand = (rand * (high - (low)) + low).toFixed(decimalspots);
    }

    // How many objects along x, y and z
    var fallingObjects = new Array();
    var staticObjects = new Array();
    var staticXcoords = new Array();
    var staticYcoords = new Array();
    var staticZcoords = new Array();
    var cubeGrid = [GRID_SIZE_X, GRID_SIZE_Y, GRID_SIZE_Z]; //number of objects in each direction x,y,z
    var angle = 0;
    var startHeight = 100;
    var camera = null;
    var projMatrix = null;
    var center = null;
    var delta = null;
    var modelbounds = null;
    var fallSpeed = 0.1;
    var height = 900;
	
    var model = new RenderableModel(gl, cubeObject, 0);
    modelbounds = model.getBounds();

    //max diameter of the model object
    delta = Math.max(
	    modelbounds.max[0] - modelbounds.min[0],
	    modelbounds.max[1] - modelbounds.min[1],
		modelbounds.max[2] - modelbounds.min[2]
		);

    center = [
	    0.5 * (modelbounds.max[0] + modelbounds.min[0]),
	    0.5 * (modelbounds.max[1] + modelbounds.min[1]),
		0.5 * (modelbounds.max[2] + modelbounds.min[2])
    ];

    //determines the zoom
    var sceneBounds = {};
    sceneBounds.min = [modelbounds.min[0], modelbounds.min[1], modelbounds.min[2]]; // clone
    sceneBounds.max = [
		modelbounds.min[0] + cubeGrid[0] * delta,
	  	modelbounds.min[1] + cubeGrid[1] * delta,
	  	modelbounds.min[2] + cubeGrid[2] * delta
    ];

    camera = new Camera(gl, sceneBounds, [0, 1, 0]);
    projMatrix = camera.getProjMatrix();

    function draw() {

        //get ready to make new cube or decrement CubeCounter
        if (generationTime == 0) {
            makeCube = true;
            generationTime = 100;
        }
        else {
            generationTime--;
            makeCube = false;
        }

        //if time to make a new cube, make a new one
        if (makeCube) {
            //code to make a new cube at a random position goes here
            randomNumber(0, GRID_SIZE_X, 0);
            var newXval = rand;
            randomNumber(0, GRID_SIZE_Z, 0);
            var newZval = rand;
            //randomNumber(0, startHeight, 0);
            //var newYval = rand;
			model.setHeight(startHeight);
			
            staticXcoords[staticObjects.length] = newXval;
            staticZcoords[staticObjects.length] = newZval;

            //default to delta
            staticYcoords[staticObjects.length] = delta;

            //collision detection for stacking; doesn't work on first object
            if (staticObjects.length > 0) {
                for (var i = 0; i < staticObjects.length; i++) {
                    //if a cube exists at this point already
                    if ((staticXcoords[staticObjects.length] == staticXcoords[i]) &&
						(staticZcoords[staticObjects.length] == staticZcoords[i])) {
                        staticYcoords[staticObjects.length] = (staticYcoords[i] + delta);
                    }
                }
            }

            //use push on the array to add newly generated cubes 
            fallingObjects.push(model);
            addMessage("New model added to canvas with coordinates (" + newXval + "," + startHeight + "," + 
				newZval + "). \nCurrent height = " + staticYcoords[staticObjects.length]/2 + // dividing by two gives the number of objects
				"\nNumber of models in fallingObjects = " + fallingObjects.length + 
				". \nNumber of staticObjects = " + staticObjects.length + "\n");
		}

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        var viewMatrix = camera.getRotatedViewMatrix(angle);
        var fallingModelMatrix = new Matrix4();
        var staticModelMatrix = new Matrix4();

        //draw all the falling objects
        for (var f = 0; f < fallingObjects.length; f++) {
		
            //set translation for falling objects
            fallingModelMatrix.setTranslate(staticXcoords[staticObjects.length+f] * delta, staticYcoords[staticObjects.length+f]/2 * delta, staticZcoords[staticObjects.length+f] * delta)
                   .translate(center[0], ((staticYcoords[staticObjects.length+f]) >= sceneBounds.min[1]) ? fallingObjects[f].getHeight() * fallSpeed : 0, center[2])
                   .rotate(1, 0, 1, 1)
                   .translate(-center[0], ((staticYcoords[staticObjects.length+f]) >= sceneBounds.min[1]) ? fallingObjects[f].getHeight() * fallSpeed : 0, -center[2]);
			// fallingModelMatrix.setTranslate(staticXcoords[staticObjects.length+f] * delta, 2 * delta, staticZcoords[staticObjects.length+f] * delta)
                   // .translate(center[0], ((2 * delta) >= sceneBounds.min[1]) ? fallingObjects[f].getHeight() * fallSpeed : 0, center[2])
                   // .rotate(1, 0, 1, 1)
                   // .translate(-center[0], ((2 * delta) >= sceneBounds.min[1]) ? fallingObjects[f].getHeight() * fallSpeed : 0, -center[2]);
				   
            //draw all objects in the falling objects array
            fallingObjects[f].draw(projMatrix, viewMatrix, fallingModelMatrix);

            //move the object from the falling array to the static array
            //remove cubes that should no longer be falling 
            //from the falling array into the static cube array.
            if (fallingObjects[f].getHeight() == 0) {
                staticObjects.push(fallingObjects.shift());
            }
            else {
                fallingObjects[f].decrHeight();
                //addMessage("object #"+f+" has current height :" +fallingObjects[f].getHeight());
            }
        }

        //draw all the static objects
        for (s = 0; s < staticObjects.length; s++) {
            //set translation for static cubes
            staticModelMatrix.setTranslate(staticXcoords[s] * delta, staticYcoords[s], staticZcoords[s] * delta)
               .translate(center[0], 0, center[2])
               .rotate(1, 0, 1, 1)
               .translate(-center[0], 0, -center[2]);

            //draw all objects in the static objects array
            staticObjects[s].draw(projMatrix, viewMatrix, staticModelMatrix);
        }

        angle++;
        if (angle > 360) angle -= 360;
        //if (height > 0) height--;
        window.requestAnimationFrame(draw);

    }//end draw

    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);

    draw();
    return 1;
}

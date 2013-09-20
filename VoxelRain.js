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


function setupMessageArea() {
		messageField = document.getElementById("messageArea");
		document.getElementById("messageClear").setAttribute("onclick","messageField.value='';");
}

function setupMenu(){
	var menuItemList = ["cubes","teapots","skulls"]; // Some list. May be list of objects to render.
	var m = document.getElementById("menu");
	var option;
	for (var i=0; i<menuItemList.length;i++){
		option=document.createElement("option");
		option.text = menuItemList[i];
		m.add(option);
	}
}

function addMessage(message){
		var st = "->"+message + "\n";
		messageField.value += st;
}	

function menuHandler(){
	var m = document.getElementById("menu");
	modelId = m.selectedIndex;
	addMessage(m.options[modelId].text);
}

function getObject(){
	if(modelId == 0)
		modelObject = cubeObject;
	else if(modelId == 1)
		modelObject = teapotObject;
	else 
		modelObject = skullObject;
}

function mainFunction(){
	setupMessageArea();
	setupMenu();

	canvas = document.getElementById('myCanvas'); 	
	addMessage(((canvas)?"Canvas acquired":"Error: Can not acquire canvas"));
	gl = getWebGLContext(canvas);
	console.log("done");

	//generates a random number between i and j 
	//up to any number of deciaml spots.
	//can be used for random colors and random positions
	function randomNumber(i,j,decimalspots){
		var high = j;
		var low = i;
		rand = Math.random();
		rand = (rand*(high-(low)) + low).toFixed(decimalspots);
	}

// How many objects along x, y and z
var fallingObjects = new Array();
var staticObjects = new Array();
var cubeGrid = [6,2,6]; //number of objects in each direction
var angle = 0;
var startHeight = 500;
var camera = null;
var projMatrix = null;
var center = null;
var delta = null;
var modelbounds = null;
var fallSpeed = 0.01;


function draw(){
	getObject();
	
		//get ready to make new cube or decrement CubeCounter
	if(generationTime == 0){
		makeCube = true;
		generationTime = 100;
	}
	else {
		generationTime--;
		makeCube = false;
	}

	//if time to make a new cube, make a new one
	if(makeCube){
		//code to make a new cube at a random position goes here
		//generateNewCube();

		var model = new RenderableModel(gl,modelObject);

		modelbounds = model.getBounds();

		randomNumber(0,9,0);
		var newXval = rand;
		//assign number to new cube's x coordinate
		randomNumber(0,9,0);
		var newYval = rand;
		//assign rand to new cubes' z coordinate
		//use push and shift on the arrays to add new cubes 
		//and remove cubes that should no longer be falling 
		//into the static cube array.
		fallingObjects.push(model);
		addMessage("New model added to canvas with coordinates (" + newXval+ ","+startHeight+"," + newYval +"). \nNumber of models in fallingObjects = " + fallingObjects.length + ". \nNumber of staticObjects = " + staticObjects.length+"\n");
		//if(falling object's position lowest it can go) 
		//move the object from the falling array to the static array
		//staticObjects.push(fallingObjects.shift());
	}


	//max diameter of the model object
	delta = Math.max(
	    modelbounds.max[0]-modelbounds.min[0],
	    modelbounds.max[1]-modelbounds.min[1],
		modelbounds.max[2]-modelbounds.min[2]
		);

	center = [
	    0.5*(modelbounds.max[0]+modelbounds.min[0]),
	    0.5*(modelbounds.max[1]+modelbounds.min[1]),
		0.5*(modelbounds.max[2]+modelbounds.min[2])
	];

	//determines the zoom
	var sceneBounds={};
	sceneBounds.min = [modelbounds.min[0],modelbounds.min[1],modelbounds.min[2]]; // clone
	sceneBounds.max = [
		modelbounds.min[0]+cubeGrid[0]*delta,
	    modelbounds.min[1]+cubeGrid[1]*5,
		modelbounds.min[2]+cubeGrid[2]*delta
	];
	camera = new Camera(gl,sceneBounds,[0,1,0]);
	projMatrix = camera.getProjMatrix();

	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	var viewMatrix = camera.getRotatedViewMatrix(angle);
	var fallingModelMatrix = new Matrix4();
	var staticModelMatrix = new Matrix4();

		fallingModelMatrix.setTranslate(1*delta, 2*delta, 2*delta) // todo - scenebounds vs height array
				           .translate(center[0], ((2*delta) > sceneBounds.min[1]) ? startHeight*fallSpeed:0, center[2])
						   .rotate(1,0,1,1)
						   .translate(-center[0], ((2*delta) > sceneBounds.min[1]) ? startHeight*fallSpeed:0, -center[2]);
		staticModelMatrix.setTranslate(1*delta, 2*delta, 2*delta) // todo - scenebounds vs height array
				           .translate(center[0], ((2*delta) > sceneBounds.min[1]) ? startHeight*fallSpeed:0, center[2])
						   .rotate(1,0,1,1)
						   .translate(-center[0], ((2*delta) > sceneBounds.min[1]) ? startHeight*fallSpeed:0, -center[2]);
	
	//draw all the falling objects
	for(var f = 0; f < fallingObjects.length; f++){
				fallingObjects[f].draw(projMatrix, viewMatrix, fallingModelMatrix);
	}

	//draw all the static objects
	for(var s = 0; s < staticObjects.length; s++){
				staticObjects[s].draw(projMatrix, viewMatrix, staticModelMatrix);
	}

	// for (var z=0; z<cubeGrid[2]; z++)
	// 	for (var y=0; y<cubeGrid[1]; y++)
	// 		for (var x=0; x<cubeGrid[0]; x++){
	// 			fallingModelMatrix.setTranslate(x*delta, y*delta, z*delta)
	// 			           .translate(center[0],center[1],center[2])
	// 					   .rotate(1,0,1,1)
	// 					   .translate(-center[0],height*-center[1],-center[2]);
	// 			model.draw(projMatrix, viewMatrix, fallingModelMatrix);
	// 		}
	angle++;
	if (angle > 360) angle -= 360;
	if (startHeight > 0) startHeight--; // todo - this should be an array?
	window.requestAnimationFrame(draw);
		
}//end draw

gl.clearColor(0,0,0,1);
gl.enable(gl.DEPTH_TEST);

draw();
return 1;
}
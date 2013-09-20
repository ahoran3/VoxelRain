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
		rand = rand*(high-(low)) + low;
		//addMessage("new random # " + rand.toFixed(decimalspots));
	}

// How many objects along x, y and z
var fallingObjects = new Array();
var staticObjects = new Array();
var N = [2, 2, 2]; 
var angle = 0;
var height = 100;

function draw(){
	getObject();
	
	var model = new RenderableModel(gl,modelObject);

	var modelbounds = model.getBounds();

	//max diameter of the model object
	var delta = Math.max(
	    modelbounds.max[0]-modelbounds.min[0],
	    modelbounds.max[1]-modelbounds.min[1],
		modelbounds.max[2]-modelbounds.min[2]
		);

	var center = [
	    0.5*(modelbounds.max[0]+modelbounds.min[0]),
	    0.5*(modelbounds.max[1]+modelbounds.min[1]),
		0.5*(modelbounds.max[2]+modelbounds.min[2])
	];

	//determines the zoom
	var sceneBounds={};
	sceneBounds.min = [modelbounds.min[0],modelbounds.min[1],modelbounds.min[2]]; // clone
	sceneBounds.max = [
		modelbounds.min[0]+N[0]*delta,
	    modelbounds.min[1]+N[1]*delta,
		modelbounds.min[2]+N[2]*delta
	];
	var camera = new Camera(gl,sceneBounds,[0,1,0]);
	var projMatrix = camera.getProjMatrix();
	
	//get ready to make new cube or decrement CubeCounter
	if(generationTime == 0){
		makeCube = true;
		generationTime = 50;
	}
	else {
		generationTime--;
		makeCube = false;
	}

	//if time to make a new cube, make a new one
	if(makeCube){
		//code to make a new cube at a random position goes here
		//generateNewCube();

		var randX = Math.random();
		var randZ = Math.random();
		addMessage("Simulated Cube Generated with random location " + "\n(" + randX.toFixed(1) + ", <y>, " + randZ.toFixed(1) + ")");//rand.toFixed(1));
		//use push and shift on the arrays to add new cubes 
		//and remove cubes that should no longer be falling 
		//into the static cube array.
		fallingObjects.push();

		//if(falling object's position lowest it can go) 
		//move the object from the falling array to the static array
		staticObjects.push(fallingObjects.shift());
	}

	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	var viewMatrix = camera.getRotatedViewMatrix(angle);
	var modelMatrix=new Matrix4();
	var fallSpeed = 0.01;

	for (var z=0; z<N[2]; z++)
		for (var y=0; y<N[1]; y++)
			for (var x=0; x<N[0]; x++){
				modelMatrix.setTranslate(x*delta, y*delta, z*delta) // todo - scenebounds vs height array
				           .translate(center[0], ((y*delta) > sceneBounds.min[1]) ? height*fallSpeed:0, center[2])
						   .rotate(1,0,1,1)
						   .translate(-center[0], ((y*delta) > sceneBounds.min[1]) ? height*fallSpeed:0, -center[2]);
				model.draw(projMatrix, viewMatrix, modelMatrix);
			}
	angle++;
	if (angle > 360) angle -= 360;
	if (height > 0) height--; // todo - this should be an array?
	window.requestAnimationFrame(draw);
		
}//end draw

gl.clearColor(0,0,0,1);
gl.enable(gl.DEPTH_TEST);

draw();
return 1;
}

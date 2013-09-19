
	// ... global variables ...
	var modelId = 0;
	var canvas = null;
	var gl = null;
	var messageField = null;

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
		var rand = Math.random();
		rand = rand*(high-(low)) + low;
		addMessage("new random # " + rand.toFixed(decimalspots));
	}

	// How many objects along x, y and z
	var N=[2, 4, 2]; 
	var angle=0;
	var newCubeCounter = 200;

function draw(){
	getObject();

	//get ready to make new cube or decrement CubeCounter
	if(newCubeCounter == 0){
		makeCube = true;
		newCubeCounter = 200;
	}
	else {
		newCubeCounter--;
		makeCube = false;
	}

	//if time to make a new cube, make a new one
	if(makeCube){
		//code to make a new cube at a random position goes here
		//generateNewCube();
	}
	
	var model = new RenderableModel(gl,modelObject);

	var modelbounds = model.getBounds();

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

	var sceneBounds={};
	sceneBounds.min = [modelbounds.min[0],modelbounds.min[1],modelbounds.min[2]]; // clone
	sceneBounds.max = [
		modelbounds.min[0]+N[0]*delta,
	    modelbounds.min[1]+N[1]*delta,
		modelbounds.min[2]+N[2]*delta
	];
	var camera = new Camera(gl,sceneBounds,[0,1,0]);
	var projMatrix = camera.getProjMatrix();
	
	

		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
		var viewMatrix = camera.getRotatedViewMatrix(angle);
		var modelMatrix=new Matrix4();
		for (var z=0; z<N[2]; z++)
			for (var y=0; y<N[1]; y++)
				for (var x=0; x<N[0]; x++){
					modelMatrix.setTranslate(x*delta, y*delta, z*delta)
					           .translate(center[0],center[1],center[2])
							   .rotate(angle*(x+y+z),0,1,1)
							   .translate(-center[0],-center[1],-center[2]);
					model.draw(projMatrix, viewMatrix, modelMatrix);
				}
		angle++; if (angle > 360) angle -= 360;
		window.requestAnimationFrame(draw);
		randomNumber(0,10,1);
	}

	gl.clearColor(0,0,0,1);
	gl.enable(gl.DEPTH_TEST);

	draw();
	return 1;
}

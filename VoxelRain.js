// Jonathan Cools-Lartigue, Brandon Forster
// Matt Hansen, Alex Horan
// CAP 4720- Project 1
// 24 September 2013

// ... global variables ...
var modelId = 0;
var canvas = null;
var gl = null;
var messageField = null;
var heightMap = null;

var GRID_SIZE_X = 9; // global constants used for quick debugging
var GRID_SIZE_Y = 16; // note: this will be used in an array
var GRID_SIZE_Z = 9; // so a grid size of 9 is actually 10x10

var scene = null;
var cubeScene = null;
var teapotScene = null ;
var skullScene = null;

function setupMessageArea() {
    messageField = document.getElementById("messageArea");
    heightMap = document.getElementById("HeightMap");
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
    var index = m.selectedIndex;
    
    if  (index == 0)
        {
        
        scene = cubeScene;
        
        }
    
    else if (index == 1)
        {
        
        scene = teapotScene;
        
        }
    else
        {
        
        scene = skullScene;
        
        }
    
    addMessage("Selected index " + index + " :" + m.options[index].text);
    
}

function randomNumber(i, j, decimalspots) {
    var high = j;
    var low = i;
    var rand = Math.random();
    return (rand * (high - (low)) + low).toFixed(decimalspots);
}

function writeHeightMap(gridHeight) 
{
    
    var numberOfObjects = 0;
    
    var string = "";
    
    for(var z = 0; z < gridHeight.length; z++)
        {
        
        for(x=0; x < gridHeight[z].length; x++)
            {
            
            var value = "" + gridHeight[z][x].length;
            
            string += value + (value.length < 2? "__" : "_");
            
            numberOfObjects += gridHeight[z][x].length;
            
            }
        
        string += "\n";
        
        }      
    
    heightMap.value = "Number of Objects: " + numberOfObjects + "\n" + string;
    
}

function mainFunction() 
{
    
    setupMessageArea();
    setupMenu();
    
    canvas = document.getElementById('myCanvas');
    addMessage(((canvas) ? "Canvas acquired" : "Error: Can not acquire canvas"));
    gl = getWebGLContext(canvas);
    console.log("done");
    
    var N = [GRID_SIZE_X, GRID_SIZE_Y, GRID_SIZE_Z]; 
    
    var gridHeight = new Array();
    
    for (var z = 0; z < GRID_SIZE_Z; z++)
        {
        
        gridHeight[z] = new Array();
        
        for (var x = 0; x < GRID_SIZE_X; x++){
            
            gridHeight[z][x] = new Array();
            
        }
        
        }
    
    var angle=0;
    
    var timer = 0;
    
    cubeScene = new renderableScene(gl, cubeObject, N);
    
    teapotScene = new renderableScene(gl, teapotObject, N);
    
    skullScene = new renderableScene(gl, skullObject, N);
    
    scene = cubeScene;
    
    function draw()
        {
        
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        
        var viewMatrix = scene.camera.getRotatedViewMatrix(angle);
        var modelMatrix=new Matrix4();
        
        for (var z=0; z<gridHeight.length; z++)
            
            for (var x=0; x<gridHeight[z].length; x++)
                
                for (var y=0; y<gridHeight[z][x].length; y++)
                    {
                    
                    var offset = gridHeight[z][x][y]; 
                    
                    modelMatrix.setTranslate(x*scene.delta, (offset + y)*scene.delta, z*scene.delta)
                        scene.model.draw(scene.projMatrix, viewMatrix, modelMatrix);
                    
                    if (offset >= 0)
                        {
                        
                        gridHeight[z][x][y] = offset - 0.1; // rate of fall
                        
                        }
                    
                    }
                    
                    angle++; if (angle > 360) angle -= 360;
                    window.requestAnimationFrame(draw);
                    
                    timer++;
                    
                    if (timer % 15 == 0) //cube production rate
                        {
                        
                        var newZ = randomNumber(0, GRID_SIZE_Z - 1, 0);
                        
                        var newX = randomNumber(0, GRID_SIZE_X - 1, 0);
                        
                        var height = gridHeight[newZ][newX].length;
                        
                        gridHeight[newZ][newX].push(GRID_SIZE_Y + 8 - height);
                        
                        timer = 0;
                        
                        writeHeightMap(gridHeight); 
                        
                        } 
                    
        }
    
    gl.clearColor(1, 1, 1, 1);
    gl.enable(gl.DEPTH_TEST);
    
    draw();
    
    return 1;
    
}

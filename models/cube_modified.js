// Jonathan Cools-Lartigue, Brandon Forster
// Matt Hansen, Alex Horan
// CAP 4720- Project 1
// 24 September 2013


var randR = null;
var randB = null;
var randG = null;
function randomColor(i,j,decimalspots){
        //written with var assignments in between Math.random calls on purpose.
        //Since random is based on time, putting time wasters in between random calls
        //gives RGB values more variance. Will explain in person.
        randR = Math.random();
        var high = j;
        randG = (Math.random());
        var low = i;
        randB = (Math.random());
        randR = randR*(high-(low)) + low;
        randG = randG*(high-(low)) + low;
        randB = randB*(high-(low)) + low;
    }

randomColor(0,1,0);

var cubemesh = {
  vertexPositions : [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    
    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,
    
    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,
    
    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
    
    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    
    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
  ],
  vertexColors :[
    randR, randG, randB+.05,
    randR, randG, randB+.05,
    randR, randG, randB+.05,
    randR, randG, randB+.05,
    randR, randG, randB,
    randR, randG, randB,
    randR, randG, randB,
    randR, randG, randB,
    randR, randG+.05, randB,
    randR, randG+.05, randB,
    randR, randG+.05, randB,
    randR, randG+.05, randB,
    randR+.05, randG, randB,
    randR+.05, randG, randB,
    randR+.05, randG, randB,
    randR+.05, randG, randB,
    randR, randG+.05, randB+.05,
    randR, randG+.05, randB+.05,
    randR, randG+.05, randB+.05,
    randR, randG+.05, randB+.05,
    randR, randG+.05, randB,
    randR, randG+.05, randB,
    randR, randG+.05, randB,
    randR, randG+.05, randB,
    randR, randG, randB
    /*
    1.0,  1.0,  1.0,    // Front face: white
	1.0,  1.0,  1.0,
	1.0,  1.0,  1.0,
	1.0,  1.0,  1.0,
    1.0,  0.0,  0.0,    // Back face: red
	1.0,  0.0,  0.0,
	1.0,  0.0,  0.0,
	1.0,  0.0,  0.0,
    0.0,  1.0,  0.0,    // Top face: green
	0.0,  1.0,  0.0,
	0.0,  1.0,  0.0,
	0.0,  1.0,  0.0,
    0.0,  0.0,  1.0,    // Bottom face: blue
	0.0,  0.0,  1.0,
	0.0,  0.0,  1.0,
	0.0,  0.0,  1.0,
    1.0,  1.0,  0.0,    // Right face: yellow
	1.0,  1.0,  0.0,
	1.0,  1.0,  0.0,
	1.0,  1.0,  0.0,
    1.0,  0.0,  1.0,     // Left face: purple
	1.0,  0.0,  1.0,
	1.0,  0.0,  1.0,
	1.0,  0.0,  1.0
    */
  ],
  indices : [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left
  ]};
  var cubeObject = {
   meshes:[cubemesh]
  };
  //console.log(cube);
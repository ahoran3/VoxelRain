// Jonathan Cools-Lartigue, Brandon Forster
// Matt Hansen, Alex Horan
// CAP 4720- Project 1
// 24 September 2013

function renderableScene(gl, modelObject, N)
{

    this.model = new RenderableModel(gl,modelObject);

	this.modelbounds = this.model.getBounds();

	this.delta = Math.max(
	    this.modelbounds.max[0]-this.modelbounds.min[0],
	    this.modelbounds.max[1]-this.modelbounds.min[1],
		this.modelbounds.max[2]-this.modelbounds.min[2]
		);
	this.center = [
	    0.5*(this.modelbounds.max[0]+this.modelbounds.min[0]),
	    0.5*(this.modelbounds.max[1]+this.modelbounds.min[1]),
		0.5*(this.modelbounds.max[2]+this.modelbounds.min[2])
	];

	this.sceneBounds={};
	this.sceneBounds.min = [this.modelbounds.min[0],this.modelbounds.min[1],this.modelbounds.min[2]]; // clone
	this.sceneBounds.max = [
		this.modelbounds.min[0]+N[0]*this.delta,
	    this.modelbounds.min[1]+N[1]*this.delta,
		this.modelbounds.min[2]+N[2]*this.delta
	];

	this.camera = new Camera(gl,this.sceneBounds,[0,1,0]);

	this.projMatrix = this.camera.getProjMatrix();

}
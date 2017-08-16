function HBar(p_tSize, p_width, p_height, p_tPos, p_fill) {
    this.tSize = p_tSize || 512;
    this.width = p_width || 1;
    this.height = p_height || 1;
    this.tPos = p_tPos|| [[0,0],[1,0],[0,1],[1,1]];
    this.fill = p_fill || 1;
    this.mesh = new Mesh();
    this.init = function(){
        this.updateFillState();
    }
    this.draw = function(){
        this.mesh.draw();
    }
    this.updateFillState = function(p_fill){
        this.fill = Math.max(0, Math.min(p_fill || this.fill, 1));
        var fill = Math.floor(this.fill*(this.width));
        console.log(fill);
        drawTexturedRect(this.mesh, 0, 0, fill, this.height, [1,1,1,1],
                         [[this.tPos[0]/this.tSize,this.tPos[1]/this.tSize],
                          [(this.tPos[0]+fill)/this.tSize,this.tPos[1]/this.tSize],
                          [(this.tPos[0]+fill)/this.tSize,(this.tPos[1]-this.height)/this.tSize],
                          [this.tPos[0]/this.tSize,(this.tPos[1]-this.height)/this.tSize]]);
    }
    this.init();
}
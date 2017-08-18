function GuiCrafting(){
    this.elements = [];
    this.init = function(){
        //----background----
        this.background = new Plane(512, 190, 181, [0, 181], true);
        //------------------
        
        //----renderlist----
        this.elements.push(
            this.background
        );
        //------------------
    },
    this.display = function(){
        this.scale = ScreenHandler.guiScale;
        
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        GLHelper.ortho(0,gl.viewportWidth,0,gl.viewportHeight,-100,100);
        TextureManager.enableTextures();
        useShader("default");
        GLHelper.resetToGuiMatrix();
        
        TextureManager.bindTexture(TextureManager.database["res/textures/gui/craftingInventory.png"].textureId);
        
        GLHelper.saveState();
            GLHelper.translate([gl.viewportWidth/2,gl.viewportHeight/2,0]);
            GLHelper.scale([this.scale,this.scale,this.scale]);
            for (var i=0;i<this.elements.length;i++) this.elements[i].draw();
        GLHelper.loadState();
        
        Player.inventory.display(gl.viewportWidth/2-72.5*this.scale,gl.viewportHeight/2+0*this.scale);
        Player.toolbar.display(gl.viewportWidth/2-72.5*this.scale,gl.viewportHeight/2-74*this.scale);
                
        Font.drawGuiText("Crafting", "normal", [0,0,0]);
    }
    this.handleInventory = function(p_button){
        var drop = false;
        drop|=Player.inventory.handleInventory(gl.viewportWidth/2-72.5*this.scale,gl.viewportHeight/2+0*this.scale,p_button);
        drop|=Player.toolbar.handleInventory(gl.viewportWidth/2-72.5*this.scale,gl.viewportHeight/2-74*this.scale,p_button);
        if (!drop && p_button==0 && Player.itemInHand != undefined){
            Player.dropItems(Player.itemInHand);
            Player.itemInHand = undefined;
        }else
        if (!drop && p_button==2 && Player.itemInHand != undefined){
            Player.dropItems(new ItemStack(Player.itemInHand.itemID,Player.itemInHand.sub(1)));
            if (Player.itemInHand.count==0) Player.itemInHand = undefined;
        }
    }
    this.init();
}
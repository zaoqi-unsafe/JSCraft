function GuiHUD(){
    this.elements = [];
    this.init = function(){
        //----crosshair----
        this.crosshairMesh = new Mesh();
        drawTexturedRect(this.crosshairMesh, -8, -8, 16, 16,[1,1,1,1],[[152/512,16/512],[167/512,16/512],[167/512,0],[152/512,0]]);
        //-----------------
        
        //----bars----
        this.healthBarFill = new HBar(512, 73, 5, [1,40], this.health);
        this.healthBar = new Plane(512, 75, 7, [0,34]);
        this.hungerBarFill = new HBar(512, 37, 5, [76,40], this.hunger);
        this.hungerBar = new Plane(512, 38, 7, [76,34]);
        this.thirstBarFill = new HBar(512, 37, 5, [115,40], this.thirst);
        this.thirstBar = new Plane(512, 37, 7, [115,34]);
        this.manaBarFill = new HBar(512, 150, 3, [1,26], this.mana);
        this.manaBar = new Plane(512, 152, 5, [0,22]);
        //------------

        //----toolbar----
        this.toolBar = new Plane(512, 152, 16, [0,16]);
        this.toolSelector = new Plane(512, 16, 16, [167,16]);
        //---------------

        this.elements.push(
            [[-76,24,0], this.healthBar, [-75,25,0], this.healthBarFill],
            [[0,24,0], this.hungerBar, [0,25,0], this.hungerBarFill],
            [[39,24,0], this.thirstBar, [39,25,0], this.thirstBarFill],
            [[-76,18,0], this.manaBar, [-75,19,0], this.manaBarFill]
        );
        
        /*
        drawTexturedRect(this.toolBarMesh, 0, 0, 152, 16,[1,1,1,1],[[0,16/512],[152/512,16/512],[152/512,0],[0,0]]);
        drawTexturedRect(this.healthBarMesh, 0, 0, 75, 7,[1,1,1,1],[[0,34/512],[75/512,34/512],[75/512,27/512],[0,27/512]]);
        drawTexturedRect(this.hungerBarMesh, 0, 0, 38, 7,[1,1,1,1],[[76/512,34/512],[114/512,34/512],[114/512,27/512],[76/512,27/512]]);
        drawTexturedRect(this.thirstBarMesh, 0, 0, 37, 7,[1,1,1,1],[[115/512,34/512],[152/512,34/512],[152/512,27/512],[115/512,27/512]]);
        drawTexturedRect(this.manaBarMesh, 0, 0, 152,6,[1,1,1,1],[[0,22/512],[152/512,22/512],[152/512,16/512],[0,16/512]]);       
        drawTexturedRect(this.itemSelectorMesh, 0, 0, 16, 16,[1,1,1,1],[[167/512,16/512],[183/512,16/512],[183/512,0],[167/512,0]]);
        */
    };
    this.display = function(){
        let scale = ScreenHandler.guiScale;
        
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        GLHelper.ortho(0,gl.viewportWidth,0,gl.viewportHeight,-100,100);
        TextureManager.enableTextures();
        useShader("default");
        TextureManager.bindTexture(TextureManager.database["res/textures/gui/playerHUD.png"].textureId);
        
        GLHelper.saveState();
            GLHelper.resetToGuiMatrix();
            GLHelper.translate([gl.viewportWidth/2,gl.viewportHeight/2,0]);
            GLHelper.scale([scale, scale, scale]);
            this.crosshairMesh.draw();
        GLHelper.loadState();
        
        GLHelper.saveState();
            GLHelper.resetToGuiMatrix();
            GLHelper.translate([gl.viewportWidth/2,0,0]);
            GLHelper.scale([scale, scale, scale]);
            
            for (var i=0;i<this.elements.length;i++){
                GLHelper.saveState();
                    GLHelper.translate(this.elements[i][0]);
                    this.elements[i][1].draw();
                GLHelper.loadState();
                
                GLHelper.saveState();
                    GLHelper.translate(this.elements[i][2]);
                    this.elements[i][3].draw();
                GLHelper.loadState();
            }
        
            GLHelper.saveState();
                GLHelper.translate([-76,1,0]);
                this.toolBar.draw();
            GLHelper.loadState();
        
            GLHelper.saveState();
                gl.depthFunc(gl.LEQUAL);
                TextureManager.enableTextures();
                useShader("default");
                TextureManager.bindTexture(TextureManager.database["res/textures/gui/playerHUD.png"].textureId);
                gl.depthFunc(gl.ALWAYS);
                GLHelper.resetToGuiMatrix();
                GLHelper.translate([gl.viewportWidth/2-76*scale+17*Player.selected*scale, scale, 0]);
                GLHelper.scale([scale, scale, scale]);
                this.toolSelector.draw();
            GLHelper.loadState();
        
            Player.toolbar.display(gl.viewportWidth/2-72.5*scale, 13*scale, true);
        GLHelper.loadState();
    }
    this.update = function(){
        if (this.health != Player.health || this.hunger != Player.hunger || this.thirst != Player.thirst || this.mana != Player.mana){
            this.health = Player.health;
            this.hunger = Player.hunger;
            this.thirst = Player.thirst;
            this.mana = Player.mana;
            this.updateFillState();
        }
        if (this.scale != ScreenHandler.currentScreen.guiScale) this.scale = ScreenHandler.currentScreen.guiScale;
    }
    this.updateFillState = function(){
        this.healthBarFill.updateFillState(Player.health);
        this.hungerBarFill.updateFillState(Player.hunger);
        this.thirstBarFill.updateFillState(Player.thirst);
        this.manaBarFill.updateFillState(Player.mana);
    }
    this.init();
}
function createGameScreen() {
    return {
        titleRO: undefined,
        floatingCubeRO: undefined,
        introFadeIn: 1,
        screenOverlayRO: undefined,
        closetObstructionRO: undefined,
        rotation: 0,
        animationProgress: 0,
        
        framebuffer: new Framebuffer(gl.viewportWidth, gl.viewportWidth),
        
        init: function(){
            console.log("Opened Game Screen!");
            
            this.titleRO = new Mesh();
            drawTexturedRect(this.titleRO, -10, -10, 20, 20, [1, 1, 1, 1], [[0, 1], [1, 1], [1, 0], [0, 0]]);
            
            this.floatingCubeRO = new Mesh();
            drawTexturedCube(this.floatingCubeRO, -2, -2, -2, 4, 4, 4, [1, 0.7, 0.5, 1]);
            
            initPlayer();
            Player.worldObj = World.world;
            Player.loc.y = 35;
            Camera.rotation.y = 180.0;
            
            this.currentGui = new GuiInventory();
            this.currentGui.init();
            
            setInterval(World.updateChunks, 1000);
        },
        
        update: function(deltaTime) {
            if(this.introFadeIn > 0){
                this.introFadeIn = Math.max(0, this.introFadeIn-0.01*deltaTime);
            }
            
            this.rotation+=0.05*deltaTime;
            
            this.animationProgress+=0.0005*deltaTime;
            while(this.animationProgress >= 1) {
                this.animationProgress-=1;
            }
            
            if(PointerLock.isLocked()) {
                var mouseSensitivity = 0.7;
                Camera.rotation.y += Mouse.movementX*mouseSensitivity;
                Camera.rotation.x += Mouse.movementY*mouseSensitivity;
            }
            
            Player.update(deltaTime);
            Camera.update(deltaTime);
        },
        
        display: function() {
            gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
            gl.clearColor(0.2, 0.7, 1, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            GLHelper.perspective(75, gl.viewportWidth/gl.viewportHeight, 0.1, 1000.0);
            GLHelper.identityModel();

            GLHelper.resetToWorldMatrix();
            useShader("default");
            TextureManager.bindTexture(TextureManager.database["res/img/world/doggy.png"].textureId);
            
            GLHelper.translate([0, 0, -45]);
            this.floatingCubeRO.draw();
            
            GLHelper.resetToWorldMatrix();
            World.world.display();
            
            gl.depthFunc(gl.ALWAYS);
            GLHelper.resetToWorldMatrix();
            var list = World.world.getCollisionBoxes(Player.getBoundingBox().getAdded(Player.loc));
            if(list != undefined)
            for(var i = 0; i < list.length; i++) {
                GLHelper.saveState();
                GLHelper.translate([list[i].getMinX(), list[i].getMinY(), list[i].getMinZ()]);
                GLHelper.scale([0.01, 0.01, 0.01]);
                this.floatingCubeRO.draw();
                GLHelper.loadState();
            }
            gl.depthFunc(gl.LEQUAL);
            
            if(this.currentGui != undefined) this.currentGui.display();
        },
        
        onKeyPressed: function(event) {
            var keyCode = event.keyCode ? event.keyCode : event.which;
            
            if(keyCode == 76) {
                PointerLock.request();
            }
        },
        
        onKeyReleased: function(keyCode) {
            
        },
        
        clean: function() {
            this.framebuffer.clean();
        }
    };
}

function openGameScreen() {
    var gameScreen = createGameScreen();
    
    openScreen(gameScreen);
}
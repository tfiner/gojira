/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var TAG_TILE_MAP = 1;

var Helloworld = cc.Layer.extend({
    isMouseDown:false,
    map:null,
    cursorSprite:null,

    init:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();

        var lazyLayer = cc.LayerGradient.create(cc.c4b(0,98,0,255), cc.c4b(0,45,0,255));
        this.addChild(lazyLayer);

        this.map = cc.TMXTiledMap.create("res/tims.tmx");
        this.addChild(this.map, 0, TAG_TILE_MAP);

        this.setTouchEnabled(true);
        if ('mouse' in sys.capabilities)
            this.setMouseEnabled(true);

        this.cursorSprite = cc.Sprite.create("res/tile-cursor.png");
        this.placingSprite = cc.Sprite.create("res/building01.png");
        this.addChild(this.cursorSprite);
        this.addChild(this.placingSprite);

        return true;
    },

    // a selector callback
    menuCloseCallback:function (sender) {
        cc.Director.getInstance().end();
    },

    onMouseMoved:function (event) {
        var layer = this.map.getLayer("background"),
            tilePt = this.pixelToTile(event._point),
            pixPt = layer.getPositionAt(tilePt),
            ts = this.map.getTileSize(),
            placingSize;


        this.cursorSprite.setPosition(pixPt);
        if (this.placingSprite) {
            placingSize = this.placingSprite.getContentSize();
            this.placingSprite.setPosition({
                x: pixPt.x,
                y: pixPt.y + placingSize.height/2 - ts.height/2
            });            
        }
    },

    onMouseUp:function (event) {
            var backlayer = this.map.getLayer("background"),
            tilePt0 = this.pixelToTile({
                'x':event._point.x, 
                'y':event._point.y
            }),
            tilePt1 = {'x': tilePt0.x, 'y': tilePt0.y+1},
            buildLayerIdx, buildLayerName, buildLayer, buildingTile;

        if (this.placingSprite) {
            // Layers are drawn from the top of the screen to the bottom.
            // This is forced by the order of the layers and the layers 
            // are numbered 0-n.  The first layers in this prototype actually start
            // at map position 3.
            buildLayerIdx = tilePt1.x + tilePt1.y - 3;
            // this.map.getLayer("buildings-" + tilePt1.y);
            // "buildings-0" width="20" height="20">
            // cc.log("tilePt1: ", tilePt1);
            buildLayerName = "buildings-" + buildLayerIdx;
            buildLayer = this.map.getLayer(buildLayerName);
            if (buildLayer) {
                buildingTile = buildLayer.getTileAt(tilePt1);
                buildingTile.createWithSpriteFrame(this.placingSprite.displayFrame());
                // buildingTile.setColor(new cc.Color4F(1.0, 0, 0, .5));
                buildingTile.setDirty(true);
            }
        }
    },

    pixelToTile:function (pixelPos) {
        var ms = this.map.getMapSize(),
            ts = this.map.getTileSize();
            xratio = pixelPos.x/ts.width,
            xmid = ms.width/2,
            yratio = pixelPos.y/ts.height,
            posY = ms.height - xratio + xmid - yratio,
            posX = ms.height + xratio - xmid - yratio;

        posX = posX < 0 ? 0 : posX;
        posX = posX > ms.width-1 ? ms.width-1 : posX;
        posY = posY < 0 ? 0 : posY;
        posY = posY > ms.height-1 ? ms.height-1 : posY;

        return {
            x: Math.floor(posX), 
            y: Math.floor(posY) - 1
        };

    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Helloworld();
        layer.init();
        this.addChild(layer);
    }
});


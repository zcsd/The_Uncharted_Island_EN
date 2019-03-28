cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: {
            default: null,
            type: cc.Label
        },

        avatarSprite: {
            default: null,
            type: cc.Sprite
        },

        moveSprite: {
            default: null,
            type: cc.Sprite
        },

        leftButton: cc.Button,
        rightButton: cc.Button,
        increaseButton: cc.Button,
        decreaseButton: cc.Button,

        spriteScale: 1.0,
        spritePos: cc.Vec2,
        spriteHalfWidth: 0,
        leftLimit: 0, 
        rightLimit: 0, 
        maxSpriteScale: 1.0,
        minSpriteScale: 0.2,
        stepSize: 60,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        var player = cc.find('player').getComponent('Player');
        this.nameLabel.string = player.nickName;

        var self = this;
        // load image from resource folder
        cc.loader.loadRes(player.avatarImgDir, cc.SpriteFrame, function (err, spriteFrame) {
            self.moveSprite.spriteFrame = spriteFrame;
        });
        cc.loader.loadRes(player.avatarImgDir + '_s', cc.SpriteFrame, function (err, spriteFrame) {
            self.avatarSprite.spriteFrame = spriteFrame;
        });

        this.spritePos = cc.v2(this.moveSprite.node.x, this.moveSprite.node.y);
        this.spriteHalfWidth = this.moveSprite.node.width / 2;
        this.leftLimit = this.moveSprite.node.x - this.spriteHalfWidth;
        this.rightLimit = 300 + this.spriteHalfWidth; // REMEMBER TO CHANGE 30 TO VARIABLE, Tree position
    },

    start () {

    },

    moveToLeft: function () {
        //var spriteNode = cc.find('Canvas/moveSprite');
        //spriteNode.position = this.spritePos;
        let x = this.spritePos.x;
        x -= this.stepSize * this.spriteScale;

        if ( (x - this.spriteHalfWidth * this.spriteScale)  < this.leftLimit) {
            x = this.leftLimit + this.spriteHalfWidth * this.spriteScale;
        }

        this.spritePos = cc.v2(x, this.spritePos.y);
        this.moveSprite.node.position = cc.v2(this.spritePos);
    },

    moveToRight: function () {
        let x = this.spritePos.x;
        x += this.stepSize * this.spriteScale;

        if ( (x + this.spriteHalfWidth * this.spriteScale) > this.rightLimit) {
            x = this.rightLimit - this.spriteHalfWidth * this.spriteScale;
        }

        this.spritePos = cc.v2(x, this.spritePos.y);
        this.moveSprite.node.position = cc.v2(this.spritePos);
    },

    increaseSize: function () {
        let currentScale = this.moveSprite.node.scale;

        currentScale += 0.1;
        if (currentScale > this.maxSpriteScale) {
            currentScale = this.maxSpriteScale;
        }

        if ( (this.spritePos.x + this.spriteHalfWidth * this.spriteScale) >= this.rightLimit) {
            currentScale = this.moveSprite.node.scale;
        }

        if ( (this.spritePos.x - this.spriteHalfWidth * this.spriteScale)  <= this.leftLimit) {
            currentScale = this.moveSprite.node.scale;
        }

        this.spriteScale = currentScale;
        this.moveSprite.node.scale = this.spriteScale;
    },

    decreaseSize: function() {
        let currentScale = this.moveSprite.node.scale;

        currentScale -= 0.1;
        if (currentScale < this.minSpriteScale) {
            currentScale = this.minSpriteScale;
        }

        this.spriteScale = currentScale;
        this.moveSprite.node.scale = this.spriteScale;
    },

    backToMapScene: function () {
        cc.director.loadScene("LevelMap");

    },

    update: function (dt) {
        if (this.spriteScale > this.minSpriteScale) {
            this.decreaseButton.interactable = true;
        }
        else {
            this.decreaseButton.interactable = false;
        }

        if (this.spriteScale < this.maxSpriteScale) {
            this.increaseButton.interactable = true;
        }
        else {
            this.increaseButton.interactable = false;
        }

        if ( (this.spritePos.x - this.spriteHalfWidth * this.spriteScale)  > this.leftLimit) {
            this.leftButton.interactable = true;
        }
        else {
            this.leftButton.interactable = false;
            this.increaseButton.interactable = false;
        }

        if ( (this.spritePos.x + this.spriteHalfWidth * this.spriteScale)  < this.rightLimit) {
            this.rightButton.interactable = true;
        }
        else {
            this.rightButton.interactable = false;
            this.increaseButton.interactable = false;
        }
    },
});

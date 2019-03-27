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

        spriteScale: 1,
        spritePos: cc.v2(-435, -190),
        leftLimit: -435,
        rightLimit: 300,
        maxSpriteScale: 1.0,
        minSpriteScale: 0.2,
        stepSize: 30,

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
    },

    start () {

    },

    moveToLeft: function () {
        //var spriteNode = cc.find('Canvas/moveSprite');
        //spriteNode.position = this.spritePos;
        let x = this.spritePos.x;
        x -= this.stepSize * this.spriteScale;

        if (x <= this.leftLimit) {
            x = this.leftLimit
        }

        this.spritePos = cc.v2(x, this.spritePos.y);
        this.moveSprite.node.position = cc.v2(this.spritePos);
    },

    moveToRight: function () {
        let x = this.spritePos.x;
        x += this.stepSize * this.spriteScale;

        if (x >= this.rightLimit) {
            x = this.rightLimit
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

    update (dt) {},
});

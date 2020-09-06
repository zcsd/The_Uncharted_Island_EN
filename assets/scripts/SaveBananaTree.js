cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel:cc.Label,
        coinLabel: cc.Label,
        hintLabel: cc.Label,
        avatarSprite:cc.Sprite,
        bodySprite: cc.Sprite,

        coinRotate: cc.Node,
        coinShine: cc.Node,
        coinBlink: cc.Node,

        walkAni: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        var player = cc.find('player').getComponent('Player');
        this.nameLabel.string = player.nickName;
        this.coinLabel.string = player.coinsOwned.toString();

        var self = this;
        // load image from resource folder
        cc.loader.loadRes(player.avatarImgDir, cc.SpriteFrame, function (err, spriteFrame) {
            self.bodySprite.spriteFrame = spriteFrame;
        });
        cc.loader.loadRes(player.avatarImgDir + '_s', cc.SpriteFrame, function (err, spriteFrame) {
            self.avatarSprite.spriteFrame = spriteFrame;
        });

        var sunSeq = cc.repeatForever(cc.sequence(cc.moveBy(2, cc.v2(-10, -6)), cc.moveBy(2, cc.v2(10, 6))));
        cc.find("Canvas/CloudsSun").runAction(sunSeq);

        KT.lastScene = 'SaveBananaTree';
    },

    shrinkBody: function () {
        this.hintLabel.string = "Shrinking body size to go into the hole...";
        cc.find('Canvas/shrinkButton').active = false;
        //cc.find('Canvas/shrinkButton').getComponent(cc.Button).interactable = false;
        var seq = cc.sequence(cc.scaleTo(0.7, 0.85), cc.scaleTo(0.5, 0.7), cc.scaleTo(0.5, 0.55), cc.scaleTo(0.4, 0.4),
        cc.callFunc(function(){
            cc.find("Canvas/bodySprite").active = false;
            var walkAniComponent = this.walkAni.getComponent(cc.Animation);
            walkAniComponent.on('finished', function(){
                setTimeout(function(){
                    cc.director.loadScene("SaveBananaTree01");
                }, 800);
                
            }, this);
            walkAniComponent.play("walkAni");
        }, this));
        cc.find("Canvas/bodySprite").runAction(seq);
    },

    goToKtScene: function () {
        cc.director.loadScene("KnowledgeTree");
    },

    backToMapScene: function () {
        //cc.director.loadScene("LevelMap");
        cc.director.loadScene("CardStudy");
    },

    start () {},

    update: function (dt) {},

    /*
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
    }, */
});

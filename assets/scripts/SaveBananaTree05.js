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
    },

    expandBody: function (){
        var walkAniComponent = this.walkAni.getComponent(cc.Animation);
        walkAniComponent.on('finished', function(){          
            cc.find('Canvas/walkMan').active = false;
            cc.find('Canvas/bodySprite').active = true;
            cc.find('Canvas/bodySprite').setScale(0.4);
            var finished = cc.callFunc(function(){
                cc.find('Canvas/hintsLabel').active = false;
                cc.find('Canvas/hints2Label').active = true;
            }, this);
            var seq = cc.sequence(cc.scaleTo(2.2, 1), finished);
            cc.find('Canvas/bodySprite').runAction(seq);
        }, this);
        walkAniComponent.play("s2bwalk");
    },

    backToMapScene: function () {
        cc.director.loadScene("LevelMap");
    },

    start: function() {
        this.expandBody();
    },

    update: function (dt) {},
});

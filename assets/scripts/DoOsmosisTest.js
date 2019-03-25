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

        osmosis: {
            default: null,
            type: cc.Node
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        var player = cc.find('player').getComponent('Player');
        this.nameLabel.string = player.nickName;

        var self = this;
        // load image from resource folder
        cc.loader.loadRes(player.avatarImgDir + '_s', cc.SpriteFrame, function (err, spriteFrame) {
            self.avatarSprite.spriteFrame = spriteFrame;
        });
    },

    start () {

    },

    backToMapScene: function () {
        cc.director.loadScene("LevelMap");

    },

    readyToOsmosis: function () {
        var animationComponent = this.osmosis.getComponent(cc.Animation);
        animationComponent.play("osmosisAni");
    },

    // update (dt) {},
});

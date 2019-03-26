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

    backToMapScene: function () {
        cc.director.loadScene("LevelMap");

    },

    // update (dt) {},
});

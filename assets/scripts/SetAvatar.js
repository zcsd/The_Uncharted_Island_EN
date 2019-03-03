cc.Class({
    extends: cc.Component,

    properties: {
        changeButton: {
            default: null,
            type: cc.Button
        },

        nameEditBox: {
            default: null,
            type: cc.EditBox
        },

        genderToggleContainer: {
            default: null,
            type: cc.ToggleContainer
        },

        frontSprite: {
            default: null,
            type: cc.Sprite
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        // load default boy avatar image
        var self = this;
        cc.loader.loadRes("boy_0", cc.SpriteFrame, function (err, spriteFrame) {
            self.frontSprite.spriteFrame = spriteFrame;
        });
    },

    changeAvatar: function () {
        var self = this;
        cc.loader.loadRes("girl_2", cc.SpriteFrame, function (err, spriteFrame) {
            self.frontSprite.spriteFrame = spriteFrame;
        });
    },

    start () {

    },

    // update (dt) {},
});

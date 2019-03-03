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

    // onLoad () {},

    changeAvatar: function () {
        cc.log('change avatar function');
        //this.frontSprite.spriteFrame.setTexture(cc.loader.load('res/boy.png'));
    },

    start () {

    },

    // update (dt) {},
});

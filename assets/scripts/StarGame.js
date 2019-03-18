cc.Class({
    extends: cc.Component,

    properties: {
        startButton: {
            default: null,
            type: cc.Button
        },

        isAvatarExisted: false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    goToNextScene: function () {
        if (this.isAvatarExisted) {
            console.log("Avatar is already created.");
        }
        else {
            cc.director.loadScene('SetAvatar');
        }
    },

    start () {

    },

    // update (dt) {},
});

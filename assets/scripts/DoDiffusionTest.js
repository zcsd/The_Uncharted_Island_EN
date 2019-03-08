cc.Class({
    extends: cc.Component,

    properties: {
        diffusion: {
            default: null,
            type: cc.Node
        }

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    backToAvatarScene: function () {
        cc.director.loadScene("SetAvatar");

    },

    readyToDiffuse: function () {
        var animationComponent = this.diffusion.getComponent(cc.Animation);
        animationComponent.play("diffusionAni");
    },

    resetScene: function () {
        
    },

    start () {

    },

    // update (dt) {},
});

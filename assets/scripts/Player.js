cc.Class({
    extends: cc.Component,

    properties: {
        nickName: "",
        gender: "boy",
        avatarImgDir: "boy_0",
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.game.addPersistRootNode(this.node);
    },

    start () {

    },
    /*
    update: function (dt) {

    },*/
});

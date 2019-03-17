cc.Class({
    extends: cc.Component,

    properties: {
        nickName: "",
        gender: "boy",
        avatarImgDir: "boy_0",
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    
    update: function (dt) {
        if (this.nickName != "") {
            console.log(this.nickName);
            console.log(this.gender);
            console.log(this.avatarImgDir);
        }
    },
});

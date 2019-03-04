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

        currentGender: "boy",
        currentImgPosition: 0,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        //console.log(boyAvatarsDir[0]);
        // load default boy avatar image
        var self = this;
        cc.loader.loadRes("boy_0", cc.SpriteFrame, function (err, spriteFrame) {
            self.frontSprite.spriteFrame = spriteFrame;
        });

    },

    changeAvatar: function () {
        let boyAvatarsDir = ["boy_0", "boy_1", "boy_2"];
        let girlAvatarsDir = ["girl_0", "girl_1", "girl_2"];

        this.currentImgPosition += 1;
        if (this.currentImgPosition == boyAvatarsDir.length) {
            this.currentImgPosition = 0;
        }

        let currentImgDir = "";
        if (this.currentGender == "boy") {
            currentImgDir = boyAvatarsDir[this.currentImgPosition];
        }
        else if (this.currentGender == "girl") {
            currentImgDir = girlAvatarsDir[this.currentImgPosition];
        }
        else {
            console.log("Select Gender Wrongly.");
        } 
        
        var self = this;
        cc.loader.loadRes(currentImgDir, cc.SpriteFrame, function (err, spriteFrame) {
            self.frontSprite.spriteFrame = spriteFrame;
        });
    },

    start () {

    },

    // update (dt) {},
});

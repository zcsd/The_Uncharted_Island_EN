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
        //current index of avatar image in the list
        currentImgPosition: 0,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        // load default avatar image
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
            // reset to 0 if bigger than max index 
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
        // load image from resource folder
        cc.loader.loadRes(currentImgDir, cc.SpriteFrame, function (err, spriteFrame) {
            self.frontSprite.spriteFrame = spriteFrame;
        });
    },

    changeGenderToBoy: function () {
        console.log("boy-gender was selected.");
        this.currentGender = "boy";
        this.currentImgPosition = -1; // to reset to 0. because +1 in changeAvatar function
        this.changeAvatar();
    },

    changeGenderToGirl: function () {
        console.log("girl-gender was selected.");
        this.currentGender = "girl";
        this.currentImgPosition = -1;
        this.changeAvatar();
    },

    resetScene: function () {
        //this.changeGenderToBoy();
        // clear name EditBox
    },

    start () {

    },

    // update (dt) {},
});

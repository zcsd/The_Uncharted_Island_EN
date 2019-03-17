cc.Class({
    extends: cc.Component,

    properties: {
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

        nextButton: {
            default: null,
            type: cc.Button
        },

        player: cc.Node,

        currentGender: "boy",
        //current index of avatar image in the list
        currentImgPosition: 0,
        currentImgDir: "boy_0",

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.player = this.player.getComponent('Player');
        this.resetScene();
    },

    getInputName: function () {
        console.log(this.nameEditBox.string);
    },

    changeAvatar: function () {
        let boyAvatarsDir = ["boy_0", "boy_1", "boy_2"];
        let girlAvatarsDir = ["girl_0", "girl_1", "girl_2"];

        this.currentImgPosition += 1;
        if (this.currentImgPosition == boyAvatarsDir.length) {
            // reset to 0 if bigger than max index 
            this.currentImgPosition = 0;
        }

        if (this.currentGender == "boy") {
            this.currentImgDir = boyAvatarsDir[this.currentImgPosition];
        }
        else if (this.currentGender == "girl") {
            this.currentImgDir = girlAvatarsDir[this.currentImgPosition];
        }
        
        var self = this;
        // load image from resource folder
        cc.loader.loadRes(this.currentImgDir, cc.SpriteFrame, function (err, spriteFrame) {
            self.frontSprite.spriteFrame = spriteFrame;
        });
    },

    changeGender: function () {
        console.log("Change Gender");
        if (this.genderToggleContainer.toggleItems[0].isChecked) {
            this.currentGender = "boy";
        }
        else if (this.genderToggleContainer.toggleItems[1].isChecked) {
            this.currentGender = "girl";
        }

        this.currentImgPosition = -1; // to reset to 0. because +1 in changeAvatar function
        this.changeAvatar();
    },

    resetScene: function () {
        this.currentGender = "boy";
        this.currentImgPosition = 0;
        this.currentImgDir = "boy_0";
        this.nameEditBox.string = "";
        this.genderToggleContainer.toggleItems[0].isChecked = true;
        this.changeGender();
        // set nextButton unclickable
        this.nextButton.interactable = false;
    },

    goToNextScene: function () {
        // TODO: check more special character
        if (this.nameEditBox.string.length == 0 || this.nameEditBox.string.trim().length == 0) {
            console.log("Empty name input.");
        }
        else {
            console.log(this.nameEditBox.string);
            console.log(this.currentGender);
            console.log(this.currentImgDir);
            this.player.nickName = this.nameEditBox.string;
            this.player.gender = this.currentGender;
            this.player.avatarImgDir = this.currentImgDir;

            cc.director.loadScene("DoDiffusionTest");
        }
    },

    start () {

    },

    update: function (dt) {
        // determine whether can click nextButton
        if (this.nameEditBox.string.length == 0 || this.nameEditBox.string.trim().length == 0) {
            this.nextButton.interactable = false;
        }
        else {
            this.nextButton.interactable = true;
        }

    },
});

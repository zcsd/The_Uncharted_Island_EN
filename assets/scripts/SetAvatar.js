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

        coinsLabel: cc.Label,

        currentGender: "boy",
        //current index of avatar image in the list
        currentImgPosition: 0,
        currentImgDir: "boy_0",
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.resetScene();
    },

    getInputName: function () {
        //console.log(this.nameEditBox.string);
    },

    changeAvatar: function () {
        let boyAvatarsDir = ["boy_0", "boy_1"];
        let girlAvatarsDir = ["girl_0", "girl_1"];

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
        //console.log("Change Gender");
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
        var player = cc.find('player').getComponent('Player');

        this.currentGender = "boy";
        this.currentImgPosition = 0;
        this.currentImgDir = "boy_0";
        this.nameEditBox.string = "";
        this.genderToggleContainer.toggleItems[0].isChecked = true;
        this.changeGender();

        this.coinsLabel.string = player.coinsOwned.toString();

        // set nextButton unclickable
        this.nextButton.interactable = false;
    },

    goToNextScene: function () {
        // TODO: check more special character
        if (this.nameEditBox.string.length == 0 || this.nameEditBox.string.trim().length == 0) {
            console.log("Empty name input.");
        }
        else {
            var player = cc.find('player').getComponent('Player');
            player.nickName = this.nameEditBox.string;
            player.gender = this.currentGender;
            player.avatarImgDir = this.currentImgDir;

            G.user.nickname = player.nickName;
            G.user.sex = player.gender;
            G.user.coins = player.coinsOwned.toString();
            G.user.whichavatar = player.avatarImgDir.substring(player.avatarImgDir.length-1);
            
            G.globalSocket.emit('newUser', G.user);

            G.globalSocket.on('newUser', function(msg) {
                if (msg == "success"){
                    cc.director.loadScene("LevelMap");
                }else if (msg == "failure"){
                    cc.log("Fail to register, try again later.");
                }
            });
            
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

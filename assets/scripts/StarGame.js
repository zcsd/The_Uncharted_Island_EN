cc.Class({
    extends: cc.Component,

    properties: {
        startButton: {
            default: null,
            type: cc.Button
        },

        textLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        G.globalSocket = io.connect("http://13.229.231.71:3000");
        var User = require('user');
        G.user = new User('', '', '', '', '');
    },

    onTextChanged: function(event, customEventData) {
        var Regx = /^[A-Za-z0-9]*$/;
        if (Regx.test(this.textLabel.string)) {
            cc.log("input is ok");
        }
        else {
            cc.log("input is NOT ok");
            var newText = this.textLabel.string.substring(0, this.textLabel.string.length-1);
            //cc.log(cc.find("Canvas/usernameEditBox/TEXT_LABEL").getComponent(cc.Label).string);
            cc.find("Canvas/usernameEditBox").getComponent(cc.EditBox).string = newText;
            cc.find("Canvas/usernameEditBox").getComponent(cc.EditBox).blur();
            cc.find("Canvas/usernameEditBox").getComponent(cc.EditBox).focus();
        }

        if (this.textLabel.string.length >= 4) {
            this.startButton.interactable = true;
        }
        else {
            this.startButton.interactable = false;
        }
    },

    goToNextScene: function () {
        G.user.username = this.textLabel.string;
        G.globalSocket.emit('login', G.user);

        G.globalSocket.on('login', function(msg) {
            if (msg == 'new') {
                cc.director.loadScene('SetAvatar');
            }else if (msg == 'multiple') {
                console.log("Multiple users are detected.");
            }else {
                console.log("Avatar is already created.");
                G.user.username = msg.username;
                G.user.nickname = msg.nickname;
                G.user.sex = msg.sex;
                G.user.coins = msg.coins;
                G.user.whichavatar = msg.whichavatar;
                console.log(G.user);
            }
        });
    },

    start () {

    },

    // update (dt) {},
});

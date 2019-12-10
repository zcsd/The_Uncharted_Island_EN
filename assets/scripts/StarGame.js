cc.Class({
    extends: cc.Component,

    properties: {
        startButton: {
            default: null,
            type: cc.Button
        },

        //player: cc.Node,

        textLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        G.globalSocket = io.connect("http://13.229.231.71:3000", {'reconnect': true});
        
        G.globalSocket.on('connect', function(){
            console.log('You have been connected');
        });

        G.globalSocket.on('disconnect', function(){
            console.log('You have been disconnected');
        });

        G.globalSocket.on('reconnect', function(){
            console.log('You have been reconnected');
        });

        G.globalSocket.on('reconnect_error', function(){
            console.log('Attempt to reconnect has failed');
        });

        var User = require('user');
        G.user = new User('', '', '', '', '');
    },

    onTextChanged: function(event, customEventData) {
        var Regx = /^[A-Za-z0-9]*$/;
        if (Regx.test(this.textLabel.string)) {
            //cc.log("input is ok");
        }
        else {
            //cc.log("input is NOT ok");
            var newText = this.textLabel.string.substring(0, this.textLabel.string.length-1);
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
            if (msg == 'new') { // no userinfo detected
                cc.director.loadScene('SetAvatar');
            }else if (msg == 'multiple') {
                // imposssible condition
                console.log("Multiple userinfor are detected.");
            }else { // one userinfor detected
                console.log("user existed.");
                G.user.username = msg.username;
                G.user.nickname = msg.nickname;
                G.user.sex = msg.sex;
                G.user.coins = msg.coins;
                G.user.whichavatar = msg.whichavatar;

                var player = cc.find('player').getComponent('Player');
                player.nickName = G.user.nickname;
                player.gender = G.user.sex;
                player.coinsOwned = Number(G.user.coins);
                player.avatarImgDir = player.gender + '_' + G.user.whichavatar;
                cc.director.loadScene("LevelMap");
            }
        });
    },

    start () {

    },

    // update (dt) {},
});

cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: cc.Label,
        coinLabel: cc.Label,
        avatarSprite: cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        var player = cc.find('player').getComponent('Player');
        this.nameLabel.string = player.nickName;
        this.coinLabel.string = player.coinsOwned.toString();

        if (G.user.coins > 100) {
            G.isQuizOpen = false;
        }
        else {
            G.isQuizOpen = true;
        }

        var self = this;
        // load image from resource folder
        cc.loader.loadRes(player.avatarImgDir + '_s', cc.SpriteFrame, function (err, spriteFrame) {
            self.avatarSprite.spriteFrame = spriteFrame;
        });

        this.checkDone();
        
        //socket, username, sequenceID, stage, actionType, operatedItem, rewardType, rewardQty, totalCoins
        //insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "levelmap", "system", "na", "na", 0, G.user.coins);
    },

    checkDone: function () {
        for (var i = 0; i < KT.doneSize; i++) {
            var key = 'check' + (i+1).toString();
            if (KT.done[key]) {
                cc.find('Canvas/ktScrollView/view/content/ktBg/checkGroup/' + key).active = true;
            }else {
                cc.find('Canvas/ktScrollView/view/content/ktBg/checkGroup/' + key).active = false;
            }
        }
    },

    pressButton: function(){
        console.log('abcd')
    },

    backToLastScene: function(){
        cc.director.loadScene(KT.lastScene);
    },

    start () {

    },

    /*
    update: function (dt) {
    },*/
});

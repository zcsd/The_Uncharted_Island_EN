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

        this.checkKT();
        
        //socket, username, sequenceID, stage, actionType, operatedItem, rewardType, rewardQty, totalCoins
        //insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "levelmap", "system", "na", "na", 0, G.user.coins);
    },

    checkKT: function () {
        for (var i = 0; i < KT.branchSize; i++) {
            var keyStart = 'start' + (i+1).toString();
            var keyCheck = 'check' + (i+1).toString();
            var keyAttention = 'attention' + (i+1).toString();

            if (KT.toStart[keyStart]) {
                cc.find('Canvas/ktScrollView/view/content/ktBg/startGroup/' + keyStart).active = true;
                cc.find('Canvas/ktScrollView/view/content/ktBg/attentionGroup/' + keyAttention).active = false;
                cc.find('Canvas/ktScrollView/view/content/ktBg/checkGroup/' + keyCheck).active = false;
            }else {
                cc.find('Canvas/ktScrollView/view/content/ktBg/startGroup/' + keyStart).active = false;
            }

            if (KT.check[keyCheck]) {
                cc.find('Canvas/ktScrollView/view/content/ktBg/checkGroup/' + keyCheck).active = true;
                cc.find('Canvas/ktScrollView/view/content/ktBg/attentionGroup/' + keyAttention).active = false;
                cc.find('Canvas/ktScrollView/view/content/ktBg/startGroup/' + keyStart).active = false;
            }else {
                cc.find('Canvas/ktScrollView/view/content/ktBg/checkGroup/' + keyCheck).active = false;
            }

            if (KT.attention[keyAttention]) {
                cc.find('Canvas/ktScrollView/view/content/ktBg/attentionGroup/' + keyAttention).active = true;
                cc.find('Canvas/ktScrollView/view/content/ktBg/checkGroup/' + keyCheck).active = false;
                cc.find('Canvas/ktScrollView/view/content/ktBg/startGroup/' + keyStart).active = false;
            }else {
                cc.find('Canvas/ktScrollView/view/content/ktBg/attentionGroup/' + keyAttention).active = false;
            }
        }  
    },

    pressButton: function(event, customData){
        if (event.target._name.includes('start')){
            Alert.show(1.2, customData, 'You have not studied the related knowledge.', null, false);

        }else if (event.target._name.includes('check')) {
            Alert.show(1.2, customData, 'You have studied the related knowledge well.', null, false);

        }else if (event.target._name.includes('attention')){
            Alert.show(1.2, customData, 'You need to pay more time to study this knowledge.', null, false);
        }

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
